import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, UrlTree } from '@angular/router';
import { CIngredient, TIngredientBase } from '../../../../app/interfaces/ingredient';
import { Cpreparation, CpreparationBase } from '../../../../app/interfaces/preparation';
import { ConsommableInteractionService } from '../../../../app/services/menus/consommable-interaction.service';
import { IngredientsInteractionService } from '../../../../app/services/menus/ingredients-interaction.service';
import { AddPreparationsComponent } from './add.preparations/add.preparations.component';
import { DisplayPreparationsComponent } from './display.preparation/display.preparations/display.preparations.component';
import { Cconsommable, TConsoBase } from 'src/app/interfaces/consommable';

@Component({
  selector: 'app-preparations',
  templateUrl: './app.preparations.component.html',
  styleUrls: ['./app.preparations.component.css']
})
export class AppPreparationsComponent implements OnInit {
  private url: UrlTree;
  private router: Router;
  public preparations: Array<Cpreparation>;
  private prepa_names: Array<string | null>;
  private prop:string;
  private restaurant:string;
  private ingredients:Array<CIngredient>;
  private consommables:Array<Cconsommable>;

  constructor(public dialog: MatDialog, private ingredient_service: IngredientsInteractionService,
  private consommable_service: ConsommableInteractionService,
  router: Router, private _snackBar: MatSnackBar) { 
    this.preparations = [];
    this.prepa_names = [];
    this.router = router;
    this.prop = "";
    this.restaurant = "";
    this.ingredients = [];
    this.consommables = [];
    this.url = this.router.parseUrl(this.router.url);
  }

  ngOnInit(): void {
    let user_info = this.url.queryParams;
    this.prop = user_info["prop"];
    this.restaurant = user_info["restaurant"];
    this.ingredient_service.getIngredientsFromRestaurantsBDD(this.prop, this.restaurant);
    this.ingredient_service.getPreparationsFromRestaurantsBDD(this.prop, this.restaurant);
    this.consommable_service.getConsommablesFromRestaurantsBDD(this.prop, this.restaurant);
    this.ingredient_service.getIngredientsFromRestaurants().subscribe((ingredients:Array<CIngredient>) => {
     this.ingredients = ingredients;
      this.ingredient_service.getPrepraparationsFromRestaurants().subscribe((preparations:Array<Cpreparation>) => {
        this.preparations = preparations;
        this.consommable_service.getConsommablesFromRestaurants().subscribe((consommables:Array<Cconsommable>) => {
          this.consommables = consommables;
        })
      })
    })
  }

  addPreparation():void {
   this.prepa_names =  this.preparations.map(prepa => prepa.name); 
   this.dialog.open(AddPreparationsComponent, {
      height: `${window.innerHeight}px`,
      width: `900px`,
      data: {
        prop: this.prop,
        restaurant: this.restaurant,
        names: this.prepa_names,
        _ingredients: this.ingredients,
        _consommables: this.consommables,
        preparation: null,
        modification: false
      }
    });
  }

  modifPreparation(preparation:Cpreparation):void {
    this.dialog.open(AddPreparationsComponent, {
      height: `${window.innerHeight}px`,
      width: `900px`,
      data: {
        prop: this.prop,
        restaurant: this.restaurant,
        names: this.prepa_names,   
        _ingredients: this.ingredients,
        _consommables: this.consommables,
        preparation:preparation,
        modification: true
      } 
    })
  }
  
  seePreparation(preparation:Cpreparation):void{
    this.dialog.open(DisplayPreparationsComponent, {
      height: `${window.innerHeight - window.innerWidth/10}px`,
      width: `${window.innerWidth - window.innerWidth/5}px`,
      data: {
        prop: this.prop,
        restaurant: this.restaurant,
        _ingredients: this.ingredients,
        _consommables: this.consommables, 
        preparation: preparation,
      }
    })
  }
  suppressPreparation(preparation: Cpreparation):void{
    if(preparation.name !== null){
      /* this.ingredient_service.removeIngInBdd(preparation.nom.split(" ").join('_'), this.prop, this.restaurant, true).catch((e) => {
        console.log(e);
        this._snackBar.open(`nous ne somme pas parvenu à supprimer le ${preparation.nom}`)
      }).finally(() => {
        this._snackBar.open(`la préparation ${preparation.nom} vient d'être suprrimé de la base de donnée`, "fermer")
      }); */
    }
  }
}
