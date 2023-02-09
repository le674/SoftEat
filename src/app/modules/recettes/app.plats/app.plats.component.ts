import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, UrlTree } from '@angular/router';
import { Cconsommable, CIngredient } from 'src/app/interfaces/ingredient';
import { Cplat } from 'src/app/interfaces/plat';
import { Cpreparation } from 'src/app/interfaces/preparation';
import { IngredientsInteractionService } from 'src/app/services/menus/ingredients-interaction.service';
import { PlatsInteractionService } from 'src/app/services/menus/plats-interaction.service';
import { AddPlatsComponent } from './add.plats/add.plats.component';

@Component({
  selector: 'app-plats',
  templateUrl: './app.plats.component.html',
  styleUrls: ['./app.plats.component.css']
})
export class AppPlatsComponent implements OnInit {

  private full_lst_prepa:Array<Cpreparation>;
  private full_lst_ings:Array<CIngredient>;
  private full_lst_conso: Array<Cconsommable>;

  private url: UrlTree;
  private router: Router;
  public plats: Array<Cplat>;
  private prop:string;
  private restaurant:string;

  constructor(public dialog: MatDialog, private ingredient_service: IngredientsInteractionService, router: Router,
     private _snackBar: MatSnackBar, private plat_service: PlatsInteractionService) { 
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
  }
  
  addPlat(){
    this.dialog.open(AddPlatsComponent, {
      height: `${window.innerHeight}px`,
      width: `${window.innerWidth - window.innerWidth/5}px`,
      data: {
        prop: this.prop,
        restaurant: this.restaurant,
        plat: null
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
        plat: plat
      }
    });
  }
  seePlat(plat:Cplat){

  }
}
