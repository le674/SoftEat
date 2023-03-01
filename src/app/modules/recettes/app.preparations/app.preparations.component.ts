import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, UrlTree } from '@angular/router';
import { Cconsommable, TIngredientBase } from 'src/app/interfaces/ingredient';
import { Cpreparation } from 'src/app/interfaces/preparation';
import { ConsommableInteractionService } from 'src/app/services/menus/consommable-interaction.service';
import { IngredientsInteractionService } from 'src/app/services/menus/ingredients-interaction.service';
import { AddPreparationsComponent } from './add.preparations/add.preparations.component';
import { DisplayPreparationsComponent } from './display.preparation/display.preparations/display.preparations.component';

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
  private full_ing_lst: Array<TIngredientBase>;
  private full_conso_lst: Array<Cconsommable>;

  constructor(public dialog: MatDialog, private ingredient_service: IngredientsInteractionService,
  private consommable_service: ConsommableInteractionService, router: Router, private _snackBar: MatSnackBar) { 
    this.preparations = [];
    this.full_ing_lst = [];
    this.full_conso_lst = [];
    this.prepa_names = [];
    this.router = router;
    this.prop = "";
    this.restaurant = "";
    this.url = this.router.parseUrl(this.router.url);
  }

  ngOnInit(): void {
    let user_info = this.url.queryParams;
    this.prop = user_info["prop"];
    this.restaurant = user_info["restaurant"];

    this.ingredient_service.getIngredientsBrFromRestaurantsPROM(this.prop, this.restaurant).then((ingredients) => {
      this.full_ing_lst = ingredients.map((ingredient) => ingredient.convertToBase());
    });

    this.ingredient_service.getIngredientsPrepFromRestaurantsPROMForMenu(this.prop,this.restaurant).then((preparations) => {
      let nom_prep = "";
      for (let index = 0; index < preparations.length; index++) {
        if(preparations[index].nom !== null){
         nom_prep = preparations[index].nom?.split("_").join(" ") as string;
         preparations[index].nom = nom_prep;
         this.preparations.push(preparations[index]);
        }
      }
    });

    this.consommable_service.getConsommablesFromRestaurants(this.prop, this.restaurant).then((consommables) => {
      this.full_conso_lst = consommables;
    })

  }

  addPreparation():void {
   this.prepa_names =  this.preparations.map(prepa => prepa.nom); 
   this.dialog.open(AddPreparationsComponent, {
      height: `${window.innerHeight}px`,
      width: `${window.innerWidth - window.innerWidth/5}px`,
      data: {
        prop: this.prop,
        restaurant: this.restaurant,
        names: this.prepa_names,
        name:"",
        full_ingredients: this.full_ing_lst,
        full_consommables: this.full_conso_lst,
        ingredients: [],
        consommables: [],
        etapes: [],
        unity: "",
        quantity_after_prep: 0,
        modification: false
      }
    });
  }

  modifPreparation(preparation:Cpreparation):void {
    this.dialog.open(AddPreparationsComponent, {
      height: `${window.innerHeight}px`,
      width: `${window.innerWidth - window.innerWidth/5}px`,
      data: {
        prop: this.prop,
        restaurant: this.restaurant,
        names: this.prepa_names,   
        name:preparation.nom,
        full_ingredients: this.full_ing_lst,
        full_consommables: this.full_conso_lst,
        ingredients:preparation.base_ing,
        consommables: preparation.consommables,
        etapes: preparation.etapes,
        unity: preparation.unity,
        quantity_after_prep: preparation.quantity_after_prep,
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
        name:preparation.nom,
        ingredients: preparation.base_ing,
        consommables: preparation.consommables,
        etapes: preparation.etapes,
        unity: preparation.unity,
        quantity_after_prep: preparation.quantity_after_prep
      }
    })
  }
  suppressPreparation(preparation: Cpreparation):void{
    if(preparation.nom !== null){
      this.ingredient_service.removeIngInBdd(preparation.nom.split(" ").join('_'), this.prop, this.restaurant, true).catch((e) => {
        console.log(e);
        this._snackBar.open(`nous ne somme pas parvenu à supprimer le ${preparation.nom}`)
      }).finally(() => {
        this._snackBar.open(`la préparation ${preparation.nom} vient d'être suprrimé de la base de donnée`, "fermer")
      });
    }
  }
}
