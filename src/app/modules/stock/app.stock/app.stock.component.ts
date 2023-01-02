import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router, UrlTree } from '@angular/router';
import { CIngredient, Ingredient } from 'src/app/interfaces/ingredient';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { IngredientsInteractionService } from 'src/app/services/menus/ingredients-interaction.service';
import { AddIngComponent } from './app.stock.modals/add-ing/add.ing/add.ing.component';

@Component({
  selector: 'app-stock',
  templateUrl: './app.stock.component.html',
  styleUrls: ['./app.stock.component.css']
})
export class AppStockComponent implements OnInit {

  public displayedColumns: string[] = ['nom', 'categorie_tva', 'quantity', 'quantity_unity',
  'unity','cost', 'cost_ttc', 'date_reception', 'dlc', 'bef_prep', 'after_prep', 'val_bouch', 'cuisinee', 'actions'];
  private ingredients_displayed: Array<{
    nom:string;
    categorie_tva:string;
    cost:number;
    cost_ttc:number;
    val_bouch:number;
    bef_prep:number;
    after_prep:number;
    quantity:number;
    quantity_unity:number;
    unity:string;
    cuisinee:string;
    date_reception: string;
    dlc:string;
  }>
  private router: Router;
  private ingredient_table: Array<Ingredient>;
  private url: UrlTree;
  public dataSource: MatTableDataSource<{
    nom:string;
    categorie_tva:string;
    cost:number;
    cost_ttc:number;
    val_bouch:number;
    bef_prep:number;
    after_prep:number;
    quantity:number;
    quantity_unity:number;
    unity:string,
    cuisinee:string;
    date_reception: string;
    dlc:string;
  }>;
  constructor(private service:IngredientsInteractionService, router: Router, public dialog: MatDialog) { 
    this.router = router;
    this.ingredient_table = [];
    this.ingredients_displayed = [];
    this.dataSource = new MatTableDataSource(this.ingredients_displayed);
    this.url = this.router.parseUrl(this.router.url)
  }

ngOnInit(): void{
    let user_info = this.url.queryParams;
    const prop = user_info["prop"];
    const restaurant = user_info["restaurant"];

    const first_step = this.service.getIngredientsBrFromRestaurants(prop, restaurant).then(async (ingredients) => {
       for(let i = 0; i < ingredients.length; i++){
        console.log(i);
        
        await ingredients[i].getInfoDico().then((ingredient) => {
          if((ingredients[i].getTauxTva() === 0) || (ingredients[i].getTauxTva === undefined)){
            ingredient.getCostTtcFromCat();
          }
          else{
            ingredient.getCostTtcFromTaux();
          }
          let row_ingredient = {
            nom: ingredients[i].nom.split('_').join('<br>'),
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
            dlc: ingredient.dlc.toLocaleString()
          };
          this.ingredients_displayed.push(row_ingredient);
          if(i === ingredients.length - 1){
            this.ingredient_table = ingredients;
            this.dataSource.data = this.ingredients_displayed;
          }
        })
       }
    })

    first_step.then(() => {
      this.service.getIngredientsPrepFromRestaurants(prop, restaurant).then((ingredients) => {
        for(let i = 0; i < ingredients.length; i++){
          console.log(this.ingredient_table);
          console.log( ingredients[i]);
          
          let base_ing = this.ingredient_table.filter((ingredient) => ingredient.nom === ingredients[i].nom)[0]
          console.log(base_ing);
          
          if((ingredients[i].categorie_dico === "") || (ingredients[i].categorie_dico === null)){
            ingredients[i].categorie_dico = base_ing.categorie_dico;
          }
          if((ingredients[i].categorie_restaurant === "") || (ingredients[i].categorie_restaurant === null)){
            ingredients[i].categorie_restaurant = base_ing.categorie_restaurant;
          }
          if((ingredients[i].categorie_tva === "") || (ingredients[i].categorie_tva === null)){
            ingredients[i].categorie_tva = base_ing.categorie_tva;
          }  
          if((ingredients[i].dlc === null)){
            ingredients[i].dlc = base_ing.dlc;
          }

          ingredients[i].cost = base_ing.cost;
          ingredients[i].cost_ttc = base_ing.cost_ttc;


          ingredients[i].getValBouchFromNewQauntity();
    
          let row_ingredient = {
            nom: ingredients[i].nom.split('_').join('<br>'),
            categorie_tva: ingredients[i].categorie_tva.split(' ').join('<br>'),
            cost: ingredients[i].cost,
            cost_ttc: ingredients[i].cost_ttc,
            val_bouch: ingredients[i].val_bouch,
            bef_prep: ingredients[i].quantity_bef_prep,
            after_prep: ingredients[i].quantity_after_prep,
            quantity: ingredients[i].quantity,
            quantity_unity: ingredients[i].quantity_unity,
            unity: ingredients[i].unity,
            cuisinee: 'oui',
            date_reception: ingredients[i].date_reception.toLocaleString(),
            dlc: ingredients[i].dlc.toLocaleString()
          };
          this.ingredients_displayed.push(row_ingredient);
        }
        this.dataSource.data = this.ingredients_displayed;
      })
    }) 
  }

  OpenAddIngForm(){
    const dialogRef = this.dialog.open(AddIngComponent, {
      height: `${window.innerHeight - window.innerHeight/16}px`,
      width:`${window.innerWidth - window.innerWidth/4}px`,
    });
  }
}
