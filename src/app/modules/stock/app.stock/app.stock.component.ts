import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router, UrlTree } from '@angular/router';
import { Unsubscribe } from 'firebase/auth';
import {Subscription } from 'rxjs';
import { CIngredient } from 'src/app/interfaces/ingredient';
import { IngredientsInteractionService } from 'src/app/services/menus/ingredients-interaction.service';
import { CalculService } from 'src/app/services/menus/menu.calcul/menu.calcul.ingredients/calcul.service';
import { AddIngComponent } from './app.stock.modals/add-ing/add.ing/add.ing.component';

@Component({
  selector: 'app-stock',
  templateUrl: './app.stock.component.html',
  styleUrls: ['./app.stock.component.css']
})
export class AppStockComponent implements OnInit, OnDestroy, AfterViewInit {

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
  }>;

  public ingredients_displayed_br: Array<{
    nom: string;
    categorie_tva: string;
    cost: number;
    cost_ttc: number;
    quantity: number;
    quantity_unity: number;
    unity: string;
    date_reception: string;
    dlc: string;
  }>;
  public ingredients_displayed_prep: Array<{
    nom: string;
    categorie_tva: string;
    cost: number;
    cost_ttc: number;
    quantity: number;
    quantity_unity: number;
    unity: string;
    date_reception: string;
    dlc: string;
  }>;
  private page_number: number;
  private router: Router;
  private ingredient_table: Array<CIngredient>;
/*   private ingredient_table_prep: Array<Cpreparation>; */
  private url: UrlTree;
  private prop: string;
  private restaurant: string;
  private req_ingredients_brt!: Unsubscribe;
  private req_merge_obs!: Subscription
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private service: IngredientsInteractionService, private calc_service: CalculService,
    router: Router, public dialog: MatDialog, private _snackBar: MatSnackBar) {
    this.page_number = 1;
    this.prop = "";
    this.restaurant = "";
    this.router = router;
    this.ingredient_table = [];
    this.ingredients_displayed_br = [];
    this.ingredients_displayed_prep = [];
    this.dataSource = new MatTableDataSource(this.ingredients_displayed_br);
    this.url = this.router.parseUrl(this.router.url);
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.req_ingredients_brt();
    this.req_merge_obs.unsubscribe();
  }

  ngOnInit(): void {
    let user_info = this.url.queryParams;
    this.prop = user_info["prop"];
    this.restaurant = user_info["restaurant"];
    this.req_ingredients_brt = this.service.getIngredientsBrFromRestaurantsBDD(this.prop, this.restaurant);
    const obs_ing = this.service.getIngredientsBrFromRestaurants()
    this.req_merge_obs = obs_ing.subscribe((ingBR) => {
      let val_bouch: any = "veuillez entre les ingrédients de bases"
      this.ingredients_displayed_br = [];
      this.dataSource = new MatTableDataSource(this.ingredients_displayed_br);
      this.ingredient_table = ingBR;
      for (let i = 0; i < ingBR.length; i++) {
        // on vérifie si le nombre d'ingrédient présent est inférieur à la marge si c'est le cas on lève une alerte
        ingBR[i].getInfoDico().then((ingredient: any) => {
          if ((ingBR[i].getTauxTva() === 0) || (ingBR[i].getTauxTva === undefined)) {
            ingredient.getCostTtcFromCat();
          }
          else {
            ingredient.getCostTtcFromTaux();
          }
          let row_ingredient = {
            nom: ingBR[i].nom.split('_').join('<br>'),
            categorie_tva: ingredient.categorie_tva.split(' ').join('<br>'),
            cost: ingredient.cost,
            cost_ttc: ingredient.cost_ttc,
            val_bouch: 0,
            bef_prep: 0,
            after_prep: 0,
            quantity: ingredient.quantity,
            quantity_unity: ingredient.quantity_unity,
            unity: ingredient.unity_unitary,
            cuisinee: 'non',
            date_reception: ingredient.date_reception.toLocaleString(),
            dlc: ingredient.dlc.toLocaleString(),
            marge: ingredient.marge,
            vrac: ingredient.vrac
          };
          this.ingredients_displayed_br.push(row_ingredient);
          if (i === ingBR.length - 1) {
            const first_event = new PageEvent();
            first_event.length = ingBR.length;
            first_event.pageSize = 6
            this.pageChangedFirst(first_event);
          }
        })
      }
    })
  }

  OpenAddIngForm() {
    const dialogRef = this.dialog.open(AddIngComponent, {
      height: `${window.innerHeight}px`,
      width: `${window.innerWidth - window.innerWidth / 15}px`,
      data: {
        restaurant: this.restaurant,
        prop: this.prop,
        is_modif: false,
        ingredient: {
          nom: "",
          categorie: "",
          quantity: 0,
          quantity_unity: 0,
          unity: "",
          unitary_cost: 0,
          dlc: 0,
          date_reception: new Date(),
          marge: 0,
          vrac: 'non'
        }
      }
    });
  }

  modifIng(ele: {
    nom: string;
    categorie_tva: string;
    cost: number;
    cost_ttc: number;
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


    ele.nom = ele.nom.split('<br>').join('_')
    ele.categorie_tva = ele.categorie_tva.split('<br>').join(' ')
    let ingredient = new CIngredient(this.calc_service, this.service)

    ingredient.nom = ele.nom;
    ingredient.categorie_tva = ele.categorie_tva;
    ingredient.cost = ele.cost;
    ingredient.quantity = ele.quantity;
    ingredient.quantity_unity = ele.quantity_unity;

    const dialogRef = this.dialog.open(AddIngComponent, {
      height: `${window.innerHeight}px`,
      width: `${window.innerWidth - window.innerWidth / 15}px`,
      data: {
        restaurant: this.restaurant,
        prop: this.prop,
        is_modif: true,
        ingredient: {
          /* cuisinee: ele.cuisinee, */
          nom: ele.nom,
          categorie: ele.categorie_tva,
          quantity: ele.quantity,
          quantity_unity: ele.quantity_unity,
          unity: ele.unity,
          unitary_cost: ele.cost,
          dlc: res_dlc,
          date_reception: ele.date_reception,
          base_ing: var_base_ing,
          not_prep: this.ingredient_table,
         /*  quantity_after_prep: ele.after_prep, */
          marge: ele.marge,
          vrac: ele.vrac
        }
      }
    });

  }

  suppIng(ele: {
    nom: string;
    categorie_tva: string;
    cost: number;
    cost_ttc: number;
    val_bouch: number;
    bef_prep: number;
    after_prep: number;
    quantity: number;
    quantity_unity: number;
    unity: string;
    cuisinee: string;
    date_reception: string;
    dlc: string;
  }) {
    let is_prep = false
    if (ele.cuisinee === 'oui') {
      is_prep = true
    }

    console.log(ele.nom);
    this.service.removeIngInBdd(ele.nom.split('<br>').join('_'), this.prop, this.restaurant, is_prep).then(() => {
      this._snackBar.open("l'ingrédient vient d'être supprimé de la base de donnée du restaurant", "fermer")
    }).catch(() => {
      this._snackBar.open("l'ingrédient n'a pas pu être supprimé de la base de donnée du restaurant", "fermer")
    });

    //on regénère la datasource 
    this.ingredients_displayed_br = this.ingredients_displayed_br.filter((ingredient) => ingredient.nom !== ele.nom.split('<br>').join('_'));
    this.ingredients_displayed_prep = this.ingredients_displayed_prep.filter((ingredient) => ingredient.nom !== ele.nom.split('<br>').join('_'));

    const supp_event = new PageEvent();
    supp_event.length = this.ingredients_displayed_prep.length + this.ingredients_displayed_br.length;
    supp_event.pageSize = 6
    this.pageChangedFirst(supp_event);
  }

  pageChanged(event: PageEvent) {
    let datasource = [... this.ingredients_displayed_br.concat(this.ingredients_displayed_prep)];
    this.page_number = event.pageIndex;
    this.dataSource.data = datasource.splice(event.pageIndex * event.pageSize, event.pageSize);
  }

  pageChangedFirst(event: PageEvent) {
    let datasource = [... this.ingredients_displayed_br.concat(this.ingredients_displayed_prep)];
    this.page_number = 0;
    this.dataSource.data = datasource.splice(0, event.pageSize);
    this.paginator.firstPage();
  }
}
