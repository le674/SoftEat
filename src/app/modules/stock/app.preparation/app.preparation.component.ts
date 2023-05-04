import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router, UrlTree } from '@angular/router';
import { Unsubscribe } from 'firebase/auth';
import { Subscription, withLatestFrom } from 'rxjs';
import { CIngredient } from '../../../../app/interfaces/ingredient';
import { Cpreparation } from '../../../../app/interfaces/preparation';
import { IngredientsInteractionService } from '../../../../app/services/menus/ingredients-interaction.service';
import { CalculService } from '../../../../app/services/menus/menu.calcul/menu.calcul.ingredients/calcul.service';
import { AppAddPreparationComponent } from './app.preparation.modals/app.add.preparation/app.add.preparation.component';
import { AppHelpPreparationComponent } from './app.preparation.modals/app.help.preparation/app.help.preparation/app.help.preparation.component';
import { CommonService } from '../../../../app/services/common/common.service';

@Component({
  selector: 'app-prepa',
  templateUrl: './app.preparation.component.html',
  styleUrls: ['./app.preparation.component.css']
})
export class AppPreparationComponent implements OnInit, OnDestroy, AfterViewInit {

  public windows_screen_mobile: boolean;
  public visibles: Array<boolean>;
  public displayedColumns: string[] = ['nom', 'categorie_tva', 'quantity', 'quantity_unity',
    'unity', 'cost', 'cost_ttc', 'date_reception', 'dlc', 'actions'];
  public dataSource: MatTableDataSource<{
    nom: string;
    categorie_tva: string;
    cost: number;
    cost_ttc: number;
    quantity: number;
    quantity_unity: number;
    unity: string,
    date_reception: string;
    dlc: string;
    marge: number;
    vrac: string;
    after_prep: number
  }>;

  public displayed_prep: Array<{
    nom: string;
    categorie_tva: string;
    cost: number;
    cost_ttc: number;
    quantity: number;
    quantity_unity: number;
    unity: string;
    date_reception: string;
    dlc: string;
    marge: number;
    vrac: string;
    after_prep: number
  }>;
  private page_number: number;
  private router: Router;
  private ingredients_table: Array<CIngredient>;
  private preparation_table: Array<Cpreparation>;
  private url: UrlTree;
  private prop: string;
  private restaurant: string;
  private req_ingredients_prep!: Unsubscribe;
  private req_ingredients_br!: Unsubscribe;
  private req_merge_obs!: Subscription
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private service: IngredientsInteractionService, private calc_service: CalculService,
    router: Router, public dialog: MatDialog, private _snackBar: MatSnackBar, public mobile_service:CommonService) {
    this.page_number = 1;
    this.prop = "";
    this.restaurant = "";
    this.router = router;
    this.preparation_table = [];
    this.ingredients_table = [];
    this.displayed_prep = [];
    this.dataSource = new MatTableDataSource(this.displayed_prep);
    this.url = this.router.parseUrl(this.router.url);
    this.windows_screen_mobile = false;
    this.visibles = [];
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.req_ingredients_prep();
    this.req_ingredients_br();
    this.req_merge_obs.unsubscribe();
  }

  ngOnInit(): void {
    let user_info = this.url.queryParams;
    this.prop = user_info["prop"];
    this.restaurant = user_info["restaurant"];
    this.req_ingredients_prep = this.service.getIngredientsPrepFromRestaurantsBDD(this.prop, this.restaurant);
    this.req_ingredients_br = this.service.getIngredientsBrFromRestaurantsBDD(this.prop, this.restaurant);

    const merge_obs = this.service.getIngredientsBrFromRestaurants().pipe(
      withLatestFrom(this.service.getIngredientsPrepFromRestaurants())
    )
    this.req_merge_obs = merge_obs.subscribe(([ingBR, ingPREP]) => {

      this.ingredients_table = ingBR;
      this.preparation_table = ingPREP;
      this.displayed_prep = [];
      this.dataSource = new MatTableDataSource(this.displayed_prep);
      for (let i = 0; i < ingPREP.length; i++) {
        ingPREP[i].setDefautPrep();
        const nom = (ingPREP[i].nom === null) ? "" : ingPREP[i].nom as string;
        if ((ingPREP[i].base_ing !== null) && (ingPREP[i].base_ing !== undefined)) {
          let lst_base_ing = this.ingredients_table
            .filter((ingredient) => ingPREP[i].base_ing
              .map((ing) => ing.name)
              .includes(ingredient.nom))
          this.calc_service.sortTwoListStringByName(lst_base_ing, ingPREP[i].base_ing);
          let ings = ingPREP[i].base_ing.filter((ing) => lst_base_ing.map((base) => base.nom).includes(ing.name));
          ings.map((ing, index: number) => {

            ing.unity = lst_base_ing[index].unity_unitary;
            ing.cost = lst_base_ing[index].cost;
            ing.quantity_unity = lst_base_ing[index].quantity_unity;
          })

          if (lst_base_ing.length > 0) {
            ingPREP[i].cost = lst_base_ing
              .map((base) => base.cost)
              .reduce((cost, next_cost) => cost + next_cost);
            ingPREP[i].cost_ttc = lst_base_ing
              .map((base) => base.cost_ttc)
              .reduce((cost, next_cost) => cost + next_cost);
          }


        }

        let row_ingredient = {
          nom: nom.split('_').join('<br>'),
          categorie_tva: ingPREP[i].categorie_tva.split(' ').join('<br>'),
          cost: ingPREP[i].cost,
          cost_ttc: ingPREP[i].cost_ttc,
          bef_prep: ingPREP[i].quantity_bef_prep,
          after_prep: ingPREP[i].quantity_after_prep,
          quantity: ingPREP[i].quantity,
          quantity_unity: ingPREP[i].quantity_unity,
          unity: ingPREP[i].unity,
          date_reception: ingPREP[i].date_reception.toLocaleString(),
          dlc: ingPREP[i].dlc.toLocaleString(),
          marge: ingPREP[i].marge,
          vrac: ingPREP[i].vrac
        };
        if (ingPREP[i].is_stock) {
          this.displayed_prep.push(row_ingredient);
        }
        if (i === ingPREP.length - 1) {
          const first_event = new PageEvent();
          first_event.length = ingBR.length;
          first_event.pageSize = 6
          this.pageChangedFirst(first_event);
        }
      }
    })
    this.windows_screen_mobile = this.mobile_service.getMobileBreakpoint("prepa");
  }

  OpenHelp() {
    const dialogRef = this.dialog.open(AppHelpPreparationComponent, {
      height: `500px`,
      width: `400px`,
    });
  }

  modifPrepa(ele: {
    nom: string;
    categorie_tva: string;
    cost: number;
    cost_ttc: number;
    after_prep: number;
    quantity: number;
    quantity_unity: number;
    unity: string;
    dlc: string;
    marge: number;
    vrac: string;
    date_reception: string;
  }) {
    let res_dlc = 0;
    let var_base_ing: Array<{ name: string; quantity_unity: number; quantity: number; unity: string; cost: number }> = [];
    const dlc = this.calc_service.stringToDate(ele.dlc);
    if (ele.date_reception !== undefined) {
      const date_reception = this.calc_service.stringToDate(ele.date_reception);
      res_dlc = (dlc.getTime() - date_reception.getTime()) / (1000 * 60 * 60 * 24)
    }


    ele.nom = ele.nom.split('<br>').join('_');
    ele.categorie_tva = ele.categorie_tva.split('<br>').join(' ');
    const base_ings = this.preparation_table.filter((ingredient) => ingredient.nom === ele.nom)
    // TO DO remplacer les window.alert
    // On récupère les ingrédients de bases que l'on envoie 
    if (base_ings.length > 1) window.alert('attention plusieurs ingrésient en base de donnée pour l ingrédient modifié (on prend le premier), contctez SoftEat');
    if (base_ings.length === 1) {
      var_base_ing = base_ings[0].base_ing;
    }

    const dialogRef = this.dialog.open(AppAddPreparationComponent, {
      height: `700px`,
      width: `900px`,
      data: {
        restaurant: this.restaurant,
        prop: this.prop,
        is_modif: true,
        preparation: {
          nom: ele.nom,
          quantity: ele.quantity,
          quantity_unity: ele.quantity_unity,
          unity: ele.unity,
          unitary_cost: ele.cost,
          dlc: res_dlc,
          date_reception: ele.date_reception,
          base_ing: var_base_ing,
          not_prep: this.ingredients_table,
          quantity_after_prep: ele.after_prep,
          marge: ele.marge,
          vrac: ele.vrac
        }
      }
    });

  }

  suppPrepa(ele: {
    nom: string;
    categorie_tva: string;
    cost: number;
    cost_ttc: number;
    after_prep: number;
    quantity: number;
    quantity_unity: number;
    unity: string;
    date_reception: string;
    dlc: string;
  }) {
    this.service.removeIngInBdd(ele.nom.split('<br>').join('_'), this.prop, this.restaurant, true).then(() => {
      this._snackBar.open("l'ingrédient vient d'être supprimé de la base de donnée du restaurant", "fermer")
    }).catch(() => {
      this._snackBar.open("l'ingrédient n'a pas pu être supprimé de la base de donnée du restaurant", "fermer")
    });
  }

  pageChanged(event: PageEvent) {
    let datasource = [... this.displayed_prep];
    this.page_number = event.pageIndex;
    this.dataSource.data = datasource.splice(event.pageIndex * event.pageSize, event.pageSize);
  }

  pageChangedFirst(event: PageEvent) {
    let datasource = [... this.displayed_prep];
    this.page_number = 0;
    this.dataSource.data = datasource.splice(0, event.pageSize);
    if(this.paginator !== undefined){
      this.paginator.firstPage();
    }
  }
  // Gestion de l'accordéon
  getVisible(i: number):boolean{
    return this.visibles[i];
  }
  changeArrow(arrow_index: number) {
    this.visibles[arrow_index] = !this.visibles[arrow_index];
  }
}

