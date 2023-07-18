import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, UrlTree } from '@angular/router';
import {CIngredient, TIngredientBase } from '../../../../app/interfaces/ingredient';
import { Cplat } from '../../../../app/interfaces/plat';
import { Cpreparation, CpreparationBase } from '../../../../app/interfaces/preparation';
import { ConsommableInteractionService } from '../../../../app/services/menus/consommable-interaction.service';
import { IngredientsInteractionService } from '../../../../app/services/menus/ingredients-interaction.service';
import { PlatsInteractionService } from '../../../../app/services/menus/plats-interaction.service';
import { PreparationInteractionService } from '../../../../app/services/menus/preparation-interaction.service';
import { AddPlatsComponent } from './add.plats/add.plats.component';
import { DisplayPlatsComponent } from './display.plats/display.plats.component';
import { Cconsommable, TConsoBase } from 'src/app/interfaces/consommable';

@Component({
  selector: 'app-plats',
  templateUrl: './app.plats.component.html',
  styleUrls: ['./app.plats.component.css']
})
export class AppPlatsComponent implements OnInit {
  public _preparations:Array<CpreparationBase>;
  public _ingredients:Array<TIngredientBase>;
  public _consommables: Array<TConsoBase>;
  public preparations:Array<Cpreparation>;
  public ingredients:Array<CIngredient>;
  public consommables: Array<Cconsommable>;

  private url: UrlTree;
  private router: Router;
  public plats: Array<Cplat>;
  public display_categorie: Array<string> = ['Entrée', 'Plat', 'Dessert'];
  private categorie: Array<string> = ['entree', 'plat', 'dessert'];
  public carte:Array<Array<Cplat>>;
  private prop:string;
  private restaurant:string;

  constructor(public dialog: MatDialog, private ingredient_service: IngredientsInteractionService,private conso_service:ConsommableInteractionService,
    router: Router, private _snackBar: MatSnackBar, private plat_service: PlatsInteractionService, private prepa_service: PreparationInteractionService) { 
    this.plats = [];
    this.router = router;
    this.prop = "";
    this.restaurant = "";
    this.url = this.router.parseUrl(this.router.url);
    this._preparations = [];
    this._consommables = [];
    this._ingredients = [];
    this.preparations = [];
    this.consommables = [];
    this.ingredients = [];
    this.carte = [];
  }
  ngOnInit(): void {
    let user_info = this.url.queryParams;
    this.prop = user_info["prop"];
    this.restaurant = user_info["restaurant"];
    this.plat_service.getPlatFromRestaurantBDD(this.prop, this.restaurant);
    this.plat_service.getPlatFromRestaurant().subscribe((plats:Cplat[]) => {
      this.plats = plats;
      this.categorie.map((categorie) => this.carte.push(plats.filter((plat) => plat.type === categorie)));
      this.ingredient_service.getIngredientsFromRestaurantsBDD(this.prop, this.restaurant)
      this.ingredient_service.getIngredientsFromRestaurants().subscribe((ingredients:CIngredient[]) => {
        this.ingredients = ingredients;
        this.conso_service.getConsommablesFromRestaurantsBDD(this.prop, this.restaurant);
        this.conso_service.getConsommablesFromRestaurants().subscribe((consommables:Cconsommable[]) => {
          this.consommables = consommables;
          this.ingredient_service.getPreparationsFromRestaurantsBDD(this.prop, this.restaurant);
          this.ingredient_service.getPrepraparationsFromRestaurants().subscribe((preparations:Cpreparation[]) => {
           this.preparations = preparations;
          })
        })
      })
    })
  }
  
  addPlat(categorie:number){
    this.dialog.open(AddPlatsComponent, {
      height: `${window.innerHeight}px`,
      width: `${window.innerWidth - window.innerWidth/5}px`,
      data: {
        prop: this.prop,
        restaurant: this.restaurant,
        ingredients: this.ingredients,
        consommables: this.consommables,
        preparations: this.preparations,
        plat:null,
        type: this.categorie[categorie]
      }
    });
  }
  suppressPlat(plat:Cplat){
    if(plat.nom !== null){
      this.plat_service.removePlatInBdd(plat.nom.split(" ").join('_'), this.prop, this.restaurant).catch((e) => {
        console.log(e);
        this._snackBar.open(`nous ne somme pas parvenu à supprimer le ${plat.nom}`)
      }).finally(() => {
        this._snackBar.open(`la préparation ${plat.nom.split(" ").join('_')} vient d'être suprrimé de la base de donnée`, "fermer")
      });
    }
  }
  modifPlat(plat:Cplat){
    this.dialog.open(AddPlatsComponent, {
      height: `${window.innerHeight}px`,
      width: `${window.innerWidth - window.innerWidth/5}px`,
      data: {
        prop: this.prop,
        restaurant: this.restaurant,
        ingredients: this.ingredients,
        consommables: this.consommables,
        preparations: this.preparations,
        plat:plat,
        type: ""
      }
    });
  }
  seePlat(plat:Cplat){
    this.dialog.open(DisplayPlatsComponent, {
      height: `${window.innerHeight - window.innerHeight/10}px`,
      width: `${window.innerWidth - window.innerWidth/5}px`,
      data: {
        prop: this.prop,
        restaurant: this.restaurant,
        ingredients: this.ingredients,
        consommables: this.consommables,
        preparations: this.preparations,
        plat:plat
      }
    })
  }

  getSection(categorie: number): Array<Cplat> {
    return this.carte[categorie];
  }

}
