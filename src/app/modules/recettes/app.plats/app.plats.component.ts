import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, UrlTree } from '@angular/router';
import { Cconsommable, CIngredient, TIngredientBase } from 'src/app/interfaces/ingredient';
import { Cplat } from 'src/app/interfaces/plat';
import { Cpreparation } from 'src/app/interfaces/preparation';
import { ConsommableInteractionService } from 'src/app/services/menus/consommable-interaction.service';
import { IngredientsInteractionService } from 'src/app/services/menus/ingredients-interaction.service';
import { PlatsInteractionService } from 'src/app/services/menus/plats-interaction.service';
import { PreparationInteractionService } from 'src/app/services/menus/preparation-interaction.service';
import { AddPlatsComponent } from './add.plats/add.plats.component';
import { DisplayPlatsComponent } from './display.plats/display.plats.component';

@Component({
  selector: 'app-plats',
  templateUrl: './app.plats.component.html',
  styleUrls: ['./app.plats.component.css']
})
export class AppPlatsComponent implements OnInit {

  public full_lst_prepa:Array<Cpreparation>;
  public full_lst_ings:Array<TIngredientBase>;
  public full_lst_conso: Array<Cconsommable>;

  private url: UrlTree;
  private router: Router;
  public plats: Array<Cplat>;
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
  }
  ngOnInit(): void {
    let user_info = this.url.queryParams;
    this.prop = user_info["prop"];
    this.restaurant = user_info["restaurant"];
    this.plat_service.getPlatFromRestaurant(this.prop, this.restaurant).then((plats) => { 
      this.plats = plats;
    })
    this.ingredient_service.getFullIngs(this.prop,this.restaurant).then((ingredients) => {
      this.full_lst_ings = ingredients;
    })
    this.conso_service.getFullConso(this.prop, this.restaurant).then((consomables) => {
      this.full_lst_conso = consomables;
    })
    this.ingredient_service.getIngredientsPrepFromRestaurantsPROMForMenu(this.prop, this.restaurant).then((preparations) => {
      this.full_lst_prepa = preparations;
    })
    
  }
  
  addPlat(){
    this.dialog.open(AddPlatsComponent, {
      height: `${window.innerHeight}px`,
      width: `${window.innerWidth - window.innerWidth/5}px`,
      data: {
        prop: this.prop,
        restaurant: this.restaurant,
        full_ingredients: this.full_lst_ings,
        full_consommables: this.full_lst_conso,
        full_preparations: this.full_lst_prepa,
        plat:null
      }
    });
  }
  suppressPlat(plat:Cplat){

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
        plat:plat
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
}
