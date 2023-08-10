import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
import { Unsubscribe } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { PreparationInteractionService } from 'src/app/services/menus/preparation-interaction.service';

@Component({
  selector: 'app-preparations',
  templateUrl: './app.preparations.component.html',
  styleUrls: ['./app.preparations.component.css']
})
export class AppPreparationsComponent implements OnInit, OnDestroy{
  @Input() recette:string | null;
  private url: UrlTree;
  private router: Router;
  private prop:string;
  private restaurant:string;
  private req_ingredients!:Unsubscribe;
  private req_preparations!:Unsubscribe;
  private req_consommables!:Unsubscribe;
  private ingredients_sub!:Subscription;
  private preparations_sub!:Subscription;
  private consommables_sub!:Subscription;
  private ingredients:Array<CIngredient>;
  private consommables:Array<Cconsommable>;
  private prepa_names: Array<string | null>;
  public preparations: Array<Cpreparation>;
  public write: boolean;

  constructor(public dialog: MatDialog, private ingredient_service: IngredientsInteractionService,
  private consommable_service: ConsommableInteractionService,
  router: Router, private _snackBar: MatSnackBar, private preparation_service:PreparationInteractionService) { 
    this.preparations = [];
    this.prepa_names = [];
    this.router = router;
    this.prop = "";
    this.restaurant = "";
    this.ingredients = [];
    this.consommables = [];
    this.url = this.router.parseUrl(this.router.url);
    this.recette = null;
    this.write = false;
  }
  ngOnDestroy(): void {
    this.req_ingredients();
    this.req_consommables();
    this.req_preparations();
    this.ingredients_sub.unsubscribe();
    this.consommables_sub.unsubscribe();
    this.preparations_sub.unsubscribe();
  }
  ngOnInit(): void {
    if(this.recette !== null){
      if(this.recette.includes("w")) this.write = true;
      if(this.recette.includes("r")){
        let user_info = this.url.queryParams;
        this.prop = user_info["prop"];
        this.restaurant = user_info["restaurant"];
        this.req_ingredients = this.ingredient_service.getIngredientsFromRestaurantsBDD(this.prop, this.restaurant);
        this.req_preparations = this.ingredient_service.getPreparationsFromRestaurantsBDD(this.prop, this.restaurant);
        this.req_consommables = this.consommable_service.getConsommablesFromRestaurantsBDD(this.prop, this.restaurant);
        this.ingredients_sub = this.ingredient_service.getIngredientsFromRestaurants().subscribe((ingredients:Array<CIngredient>) => {
          this.ingredients = ingredients;
          this.preparations_sub = this.ingredient_service.getPrepraparationsFromRestaurants().subscribe((preparations:Array<Cpreparation>) => {
            this.preparations = preparations;
            this.consommables_sub = this.consommable_service.getConsommablesFromRestaurants().subscribe((consommables:Array<Cconsommable>) => {
              this.consommables = consommables;
            });
          });
        });
      }
    }
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
      this.preparation_service.removePrepaInBdd(preparation,this.prop, this.restaurant).catch((e) => {
        console.log(e);
        this._snackBar.open("Impossible de supprimer la préparation veuillez contacter softeat", "fermer");
      }).finally(() => {
        this._snackBar.open("Nous venons de supprimer la préparation", "fermer")
      })
    } 
  }
}
