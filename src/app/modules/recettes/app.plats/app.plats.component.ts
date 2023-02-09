import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, UrlTree } from '@angular/router';
import { Cplat } from 'src/app/interfaces/plat';
import { IngredientsInteractionService } from 'src/app/services/menus/ingredients-interaction.service';
import { AddPlatsComponent } from './add.plats/add.plats.component';

@Component({
  selector: 'app-plats',
  templateUrl: './app.plats.component.html',
  styleUrls: ['./app.plats.component.css']
})
export class AppPlatsComponent implements OnInit {

  private url: UrlTree;
  private router: Router;
  public plats: Array<Cplat>;
  private prop:string;
  private restaurant:string;

  constructor(public dialog: MatDialog, private ingredient_service: IngredientsInteractionService, router: Router,
     private _snackBar: MatSnackBar) { 
    this.plats = [];
    this.router = router;
    this.prop = "";
    this.restaurant = "";
    this.url = this.router.parseUrl(this.router.url);
  }
  ngOnInit(): void {
    let user_info = this.url.queryParams;
    this.prop = user_info["prop"];
    this.restaurant = user_info["restaurant"];
    

  }
  
  addPlat(){
    this.dialog.open(AddPlatsComponent, {
      height: `${window.innerHeight}px`,
      width: `${window.innerWidth - window.innerWidth/5}px`,
      data: {
        prop: this.prop,
        restaurant: this.restaurant,
      }
    });
  }
  suppressPlat(plat:Cplat){

  }
  modifPlat(plat:Cplat){

  }
  seePlat(plat:Cplat){

  }
}
