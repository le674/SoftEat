import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, UrlTree } from '@angular/router';
import { Cpreparation } from 'src/app/interfaces/preparation';
import { IngredientsInteractionService } from 'src/app/services/menus/ingredients-interaction.service';
import { AddPreparationsComponent } from './add.preparations/add.preparations.component';
import { DisplayPreparationsComponent } from './display.preparation/display.preparations/display.preparations.component';
import { ModifPreparationsComponent } from './modif.preparations/modif.preparations/modif.preparations.component';

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

  constructor(public dialog: MatDialog, private ingredient_service: IngredientsInteractionService, router: Router) { 
    this.preparations = [];
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
    this.ingredient_service.getIngredientsPrepFromRestaurantsPROMForMenu(this.prop,this.restaurant).then((preparations) => {
      let nom_prep = "";
      for (let index = 0; index < preparations.length; index++) {
        if(preparations[index].nom !== null){
         nom_prep = preparations[index].nom?.split("_").join(" ") as string;
         preparations[index].nom = nom_prep;
         this.preparations.push(preparations[index]);
        }
      }
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
        ingredients: [],
        consommables: [],
        etapes: []
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
        ingredients:preparation.base_ing,
        consommables: preparation.consommables,
        etapes: preparation.etapes
      } 
    })
  }
  
  seePreparation(preparation:Cpreparation):void{
    this.dialog.open(DisplayPreparationsComponent, {
      height: `${window.innerHeight}px`,
      width: `${window.innerWidth - window.innerWidth/5}px`
    })
  }

}
