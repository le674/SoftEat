import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router, UrlTree } from '@angular/router';
import { concat, map, Observable, Subscription, switchMap, withLatestFrom } from 'rxjs';
import { CIngredient, Ingredient } from 'src/app/interfaces/ingredient';
import { Restaurant } from 'src/app/interfaces/restaurant';
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
    'unity', 'cost', 'cost_ttc', 'date_reception', 'dlc', 'bef_prep', 'after_prep', 'val_bouch', 'cuisinee', 'actions'];
  public dataSource: MatTableDataSource<{
    nom: string;
    categorie_tva: string;
    cost: number;
    cost_ttc: number;
    val_bouch: number;
    bef_prep: number;
    after_prep: number;
    quantity: number;
    quantity_unity: number;
    unity: string,
    cuisinee: string;
    date_reception: string;
    dlc: string;
  }>;

  public ingredients_displayed_br: Array<{
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
  }>;
  public ingredients_displayed_prep: Array<{
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
  }>;
  private page_number: number;
  private router: Router;
  private ingredient_table: Array<CIngredient>;
  private ingredient_table_prep: Array<CIngredient>;
  private url: UrlTree;
  private prop: string;
  private restaurant: string;
  private ingredients_brt: Subscription;
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
    this.ingredient_table_prep = [];
    this.ingredients_brt = new Subscription();
  }
  
  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.ingredients_brt.unsubscribe();
  }

  ngOnInit(): void {
    let user_info = this.url.queryParams;
    this.prop = user_info["prop"];
    this.restaurant = user_info["restaurant"];
    this.service.getIngredientsBrFromRestaurantsBDD(this.prop, this.restaurant);
    this.service.getIngredientsPrepFromRestaurantsBDD(this.prop, this.restaurant);
    const merge_obs_ing = this.service.getIngredientsBrFromRestaurants().pipe(
      withLatestFrom(this.service.getIngredientsPrepFromRestaurants())
    )
    merge_obs_ing.subscribe(([ingBR, ingPREP]) => {
      this.ingredients_displayed_br = [];
      this.ingredients_displayed_prep = [];
      this.ingredient_table = ingBR;
      this.ingredient_table_prep = ingPREP;
      for (let i = 0; i < ingBR.length; i++) {
        ingBR[i].getInfoDico().then((ingredient:any) => {
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
            unity: ingredient.unity,
            cuisinee: 'non',
            date_reception: ingredient.date_reception.toLocaleString(),
            dlc: ingredient.dlc.toLocaleString(),
            marge: ingredient.marge
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
    if(ingBR.length > 0){
      for (let i = 0; i < ingPREP.length; i++) {
        let lst_base_ing = this.ingredient_table
        .filter((ingredient) => ingPREP[i].base_ing
          .map((ing) => ing.name)
          .includes(ingredient.nom))
        this.calc_service.sortTwoListStringByName(lst_base_ing, ingPREP[i].base_ing);
        let ings = ingPREP[i].base_ing.filter((ing) => lst_base_ing.map((base) => base.nom).includes(ing.name));
        ings.map((ing, index: number) => {

        ing.unity = lst_base_ing[index].unity;
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

      ingPREP[i].val_bouch = this.calc_service.getValBouchFromBasIng(lst_base_ing, ingPREP[i]);

      let val_bouch: any = ingPREP[i].val_bouch;
      if ((ingPREP[i].quantity_bef_prep > 0) && (val_bouch === 0)) {
        val_bouch = "veuillez entrer les ingrédients de bases"
      }

      let row_ingredient = {
        nom: ingPREP[i].nom.split('_').join('<br>'),
        categorie_tva: ingPREP[i].categorie_tva.split(' ').join('<br>'),
        cost: ingPREP[i].cost,
        cost_ttc: ingPREP[i].cost_ttc,
        val_bouch: val_bouch,
        bef_prep: ingPREP[i].quantity_bef_prep,
        after_prep: ingPREP[i].quantity_after_prep,
        quantity: ingPREP[i].quantity,
        quantity_unity: ingPREP[i].quantity_unity,
        unity: ingPREP[i].unity,
        cuisinee: 'oui',
        date_reception: ingPREP[i].date_reception.toLocaleString(),
        dlc: ingPREP[i].dlc.toLocaleString(),
        marge: ingPREP[i].marge
      };
        this.ingredients_displayed_prep.push(row_ingredient);
      }
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
          base_ing: [],
          not_prep: this.ingredient_table,
          quantity_after_prep: 0,
          marge: 0
        }
      }
    });
  }

  modifIng(ele: {
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
    marge: number
  }) {
    let res_dlc = 0;
    let var_base_ing: Array<{ name: string; quantity_unity: number; quantity: number; unity: string; cost: number }> = [];
    const dlc = this.calc_service.stringToDate(ele.dlc);
    const date_reception = this.calc_service.stringToDate(ele.date_reception);


    ele.nom = ele.nom.split('<br>').join('_')
    ele.categorie_tva = ele.categorie_tva.split('<br>').join(' ')
    let ingredient = new CIngredient(this.calc_service, this.service)
    const base_ings = this.ingredient_table_prep.filter((ingredient) => ingredient.nom === ele.nom)
    // TO DO remplacer les window.alert
    if (base_ings.length > 1) window.alert('attention plusieurs ingrésient en base de donnée pour l ingrédient modifié (on prend le premier), contctez SoftEat');
    if (base_ings.length === 1) {
      var_base_ing = base_ings[0].base_ing;
    }


    ingredient.nom = ele.nom;
    ingredient.categorie_tva = ele.categorie_tva;
    ingredient.cost = ele.cost;
    ingredient.quantity = ele.quantity;
    ingredient.quantity_unity = ele.quantity_unity;
    res_dlc = (dlc.getTime() - date_reception.getTime()) / (1000 * 60 * 60 * 24)
    console.log("dlc en jours : ", res_dlc);

    const dialogRef = this.dialog.open(AddIngComponent, {
      height: `${window.innerHeight}px`,
      width: `${window.innerWidth - window.innerWidth / 15}px`,
      data: {
        restaurant: this.restaurant,
        prop: this.prop,
        is_modif: true,
        ingredient: {
          cuisinee: ele.cuisinee,
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
          quantity_after_prep: ele.after_prep,
          marge: ele.marge
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

  pageChangedFirst(event: PageEvent){
    let datasource = [... this.ingredients_displayed_br.concat(this.ingredients_displayed_prep)];
    this.page_number = 0;
    this.dataSource.data = datasource.splice(0, event.pageSize);
    this.paginator.firstPage();
  }
}
