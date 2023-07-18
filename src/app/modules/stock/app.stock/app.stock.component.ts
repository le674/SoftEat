import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router, UrlTree } from '@angular/router';
import { Unsubscribe } from 'firebase/auth';
import {Subscription } from 'rxjs';
import { CIngredient } from '../../../../app/interfaces/ingredient';
import { IngredientsInteractionService } from '../../../../app/services/menus/ingredients-interaction.service';
import { CalculService } from '../../../../app/services/menus/menu.calcul/menu.calcul.ingredients/calcul.service';
import { AddIngComponent } from './app.stock.modals/add-ing/add.ing/add.ing.component';
import { CommonService } from '../../../../app/services/common/common.service';
import { RowIngredient } from 'src/app/interfaces/inventaire';

@Component({
  selector: 'app-stock',
  templateUrl: './app.stock.component.html',
  styleUrls: ['./app.stock.component.css']
})
export class AppStockComponent implements OnInit, OnDestroy{

  public windows_screen_mobile:boolean;
  public displayedColumns: string[] = ['nom', 'categorie_tva', 'quantity', 'quantity_unity',
    'unity', 'cost', 'cost_ttc', 'date_reception', 'dlc', 'actions'];
  public size:string;
  public dataSource: MatTableDataSource<RowIngredient>;

  public ingredients_displayed_br: Array<RowIngredient>;

  private page_number: number;
  private router: Router;
  private ingredient_table: Array<CIngredient>;
/*   private ingredient_table_prep: Array<Cpreparation>; */
  private url: UrlTree;
  private prop: string;
  private restaurant: string;
  private req_ingredients_brt!: Unsubscribe;
  private req_merge_obs!: Subscription
  public visibles: Array<boolean>;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private service: IngredientsInteractionService, private calc_service: CalculService,
    router: Router, public dialog: MatDialog, private _snackBar: MatSnackBar, public mobile_service:CommonService) {
    this.page_number = 1;
    this.prop = "";
    this.restaurant = "";
    this.router = router;
    this.ingredient_table = [];
    this.ingredients_displayed_br = [];
    this.dataSource = new MatTableDataSource(this.ingredients_displayed_br);
    this.url = this.router.parseUrl(this.router.url);
    this.visibles = [];
    this.size = "";
    this.windows_screen_mobile = this.mobile_service.getMobileBreakpoint("ing");
  }

  ngOnDestroy(): void {
    this.req_ingredients_brt();
    this.req_merge_obs.unsubscribe();
  }

  ngOnInit(): void {
    let user_info:any = this.url.queryParams;
    this.prop = user_info.prop;
    this.restaurant = user_info.restaurant;
    this.req_ingredients_brt = this.service.getIngredientsFromRestaurantsBDD(this.prop, this.restaurant);
    const obs_ing = this.service.getIngredientsFromRestaurants()
    this.req_merge_obs = obs_ing.subscribe((ingredients) => {
      this.ingredients_displayed_br = [];
      this.dataSource = new MatTableDataSource(this.ingredients_displayed_br);
      this.ingredient_table = ingredients;
      for (let ingredient of ingredients) {
        // on vérifie si le nombre d'ingrédient présent est inférieur à la marge si c'est le cas on lève une alerte
        if((ingredient.taux_tva === 0) || (ingredient.taux_tva === null)){
          ingredient.getCostTtcFromCat();
        }
        else{
          
          ingredient.getCostTtcFromTaux(); 
        }
        const name = ingredient.name.split(' ').join('<br>');
        const cost = ingredient.cost;
        const unity = ingredient.unity;
        const quantity = ingredient.quantity;
        const quantity_unity = ingredient.quantity_unity;
        const id = ingredient.id;
        let row_ingredient = new RowIngredient(name, cost, quantity, quantity_unity, unity, id);
        row_ingredient.setIngredient(ingredient);
        this.ingredients_displayed_br.push(row_ingredient);
        this.visibles.push(false);
        const first_event = new PageEvent();
        first_event.length = ingredients.length;
        first_event.pageSize = 6
        this.pageChangedFirst(first_event);
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
          name: "",
          categorie_restaurant: null,
          categorie_tva: null,
          taux_tva: null,
          cost: 0,
          quantity: 0,
          quantity_unity: 0,
          total_quantity: 0,
          unity: "",
          date_reception: new Date(),
          dlc: 0,
          cost_ttc: null,
          is_similar:0,
          marge: 0,
          vrac: 'non',
          base_ingredient_id:null,
          id:""
        }
      }
    });
  }

  modifIng(ele: RowIngredient) {
    let dlc = ""
    let categorie_tva = "";
    let _ingredient = this.ingredient_table.find((ingredient) => ingredient.id === ele.id);
    if(ele.dlc !== null){
      dlc = ele.dlc;
    }
    if(ele.categorie_tva !== null){
      categorie_tva = ele.categorie_tva;
    }
    let res_dlc = 0;
    let var_base_ing: Array<{ name: string; quantity_unity: number; quantity: number; unity: string; cost: number }> = [];
    
    const dlc_date = this.calc_service.stringToDate(dlc);
    if (ele.date_reception !== undefined && ele.date_reception !== null) {
      const date_reception = this.calc_service.stringToDate(ele.date_reception);
      if(dlc_date !== null && date_reception !== null){
        res_dlc = (dlc_date.getTime() - date_reception.getTime()) / (1000 * 60 * 60 * 24)
      }
      else{
        res_dlc = 0;
      }
    }

    ele.name = ele.name.split('<br>').join(' ')
    ele.categorie_tva = categorie_tva.split('<br>').join(' ')
    let ingredient = new CIngredient(this.calc_service)

    ingredient.name = ele.name;
    ingredient.categorie_tva = ele.categorie_tva;
    ingredient.cost = ele.cost;
    ingredient.quantity = ele.quantity;
    ingredient.quantity_unity = ele.quantity_unity;
    if(_ingredient !== undefined){
      const dialogRef = this.dialog.open(AddIngComponent, {
        height: `${window.innerHeight}px`,
        width: `${window.innerWidth - window.innerWidth / 15}px`,
        data: {
          restaurant: this.restaurant,
          prop: this.prop,
          is_modif: true,
          ingredient: {
            id:ele.id,
            /* cuisinee: ele.cuisinee, */
            name: ele.name,
            categorie_restaurant: _ingredient.categorie_restaurant,
            categorie_tva: _ingredient.categorie_tva,
            taux_tva: _ingredient.taux_tva,
            cost: _ingredient.cost,
            quantity: ele.quantity,
            quantity_unity: ele.quantity_unity,
            total_quantity: _ingredient.total_quantity,
            unity: ele.unity,
            unitary_cost: ele.cost,
            date_reception: ele.date_reception,
            dlc: res_dlc,
            cost_ttc: _ingredient.cost_ttc,
            marge: ele.marge,
            vrac: ele.vrac,
            base_ingredient_id: null,
            base_ing: var_base_ing,
            not_prep: this.ingredient_table,
           /*  quantity_after_prep: ele.after_prep, */
          }
        }
      });
    }
    else{
      throw `No Ingredient founded for array element of id ${ele.id} and name ${ele.name}`;
    }
  }

  suppIng(ele: RowIngredient) {
    this.service.removeIngInBdd(ele, this.prop, this.restaurant).then(() => {
      this._snackBar.open("l'ingrédient vient d'être supprimé de la base de donnée du restaurant", "fermer")
    }).catch(() => {
      this._snackBar.open("l'ingrédient n'a pas pu être supprimé de la base de donnée du restaurant", "fermer")
    });
  }
  pageChanged(event: PageEvent) {
    let datasource = [... this.ingredients_displayed_br];
    this.page_number = event.pageIndex;
    this.dataSource.data = datasource.splice(event.pageIndex * event.pageSize, event.pageSize);
  }

  pageChangedFirst(event: PageEvent) {
    let datasource = [... this.ingredients_displayed_br];
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
