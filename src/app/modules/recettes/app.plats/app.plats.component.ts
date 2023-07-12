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
  public full_lst_prepa:Array<CpreparationBase>;
  public full_lst_ings:Array<TIngredientBase>;
  public full_lst_conso: Array<TConsoBase>;

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
    this.full_lst_prepa = [];
    this.full_lst_conso = [];
    this.full_lst_ings = [];
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
        let ingredients_base = ingredients.map((ingredient) => ingredient.convertToBase());
        this.full_lst_ings = ingredients_base;
        this.conso_service.getConsommablesFromRestaurantsBDD(this.prop, this.restaurant);
        this.conso_service.getConsommablesFromRestaurants().subscribe((consommables:Cconsommable[]) => {
          let consommables_base = consommables.map((consommable) => consommable.convertToBase());
          this.full_lst_conso = consommables_base;
          this.ingredient_service.getPreparationsFromRestaurantsBDD(this.prop, this.restaurant);
          this.ingredient_service.getPrepraparationsFromRestaurants().subscribe((preparations:Cpreparation[]) => {
            let preparations_base = preparations.map((preparation) =>{
              return preparation.convertToBase()
            })
            this.full_lst_prepa = preparations_base;
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
        full_ingredients: this.full_lst_ings,
        full_consommables: this.full_lst_conso,
        full_preparations: this.full_lst_prepa,
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
        full_ingredients: this.full_lst_ings,
        full_consommables: this.full_lst_conso,
        full_preparations: this.full_lst_prepa,
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
        ingredients: this.full_lst_ings,
        consommables: this.full_lst_conso,
        preparations: this.full_lst_prepa,
        plat:plat
      }
    })
  }

  getSection(categorie: number): Array<Cplat> {
    return this.carte[categorie];
  }

}
