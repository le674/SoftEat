import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, UrlTree } from '@angular/router';
import { Cconsommable, TIngredientBase } from '../../../../app/interfaces/ingredient';
import { Cmenu } from '../../../../app/interfaces/menu';
import { Cplat } from '../../../../app/interfaces/plat';
import { ConsommableInteractionService } from '../../../../app/services/menus/consommable-interaction.service';
import { IngredientsInteractionService } from '../../../../app/services/menus/ingredients-interaction.service';
import { MenuInteractionService } from '../../../../app/services/menus/menu-interaction.service';
import { PlatsInteractionService } from '../../../../app/services/menus/plats-interaction.service';
import { AddMenuComponent } from './add.menu/add.menu.component';
import { DisplayMenuComponent } from './display.menu/display.menu.component';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
  styleUrls: ['./app.menu.component.css']
})
export class AppMenuComponent implements OnInit, AfterViewInit {

  public menus: Array<Cmenu>
  private url: UrlTree;
  private prop:string;
  private restaurant:string;
  private router: Router;
  private ingredients: Array<TIngredientBase>
  private consommables: Array<Cconsommable>
  private plats: Array<Cplat>;

  constructor(private menu_service:MenuInteractionService,
    router: Router,  public dialog: MatDialog, private ingredient_service: IngredientsInteractionService,
    private conso_service: ConsommableInteractionService, private plat_service: PlatsInteractionService, private _snackBar:MatSnackBar) {
    this.menus = [];  
    this.ingredients = [];
    this.consommables = [];
    this.plats = [];
    this.prop = "";
    this.restaurant = "";  
    this.router = router; 
    this.url = this.router.parseUrl(this.router.url);
  }

  ngOnInit(): void {
    let user_info = this.url.queryParams;
    this.prop = user_info["prop"];
    this.restaurant = user_info["restaurant"];
    this.ingredient_service.getIngredientsBrFromRestaurantsPROM(this.prop, this.restaurant).then((ingredients) => {
      this.ingredients = ingredients.map((ingredient) => {
        return ingredient.convertToBase()
      });
    }).then(() => {
      this.conso_service.getConsommablesFromRestaurantsFiltreIds(this.prop, this.restaurant).then((consos) => {
        this.consommables = consos;
      }).then(() => {
        this.plat_service.getPlatFromRestaurant(this.prop, this.restaurant).then((plats) => {
            this.plats = plats;
        }).then(() => {
          this.menu_service.getMenusFromRestaurants(this.prop, this.restaurant, this.ingredients, this.consommables, this.plats).then((menus) => {
            this.menus = menus;   
          })
      })
    })
  })
}

  ngAfterViewInit(): void {
    
  }

  addMenu():void{

    const dialogRef = this.dialog.open(AddMenuComponent, {
      height: `${window.innerHeight - window.innerWidth / 10}px`,
      width: `${window.innerWidth - window.innerWidth / 10}px`,
      data:{
        prop: this.prop,
        restaurant: this.restaurant,
        ingredients: this.ingredients,
        consommables:this.consommables,
        plats:this.plats,
        menu:null
      }
    });
  }

  modifyMenu(menu:Cmenu):void{
    console.log(menu);
    const dialogRef = this.dialog.open(AddMenuComponent, {
      height: `${window.innerHeight - window.innerWidth / 10}px`,
      width: `${window.innerWidth - window.innerWidth / 10}px`,
      data:{
        prop: this.prop,
        restaurant: this.restaurant,
        ingredients: this.ingredients,
        consommables:this.consommables,
        plats:this.plats,
        menu:menu
      }
    });
  }

  seeMenu(menu:Cmenu):void{
    const dialogRef = this.dialog.open(DisplayMenuComponent, {
      height: `${window.innerHeight}px`,
      width: `800px`,
      data:{
        menu:menu
      }
    })
  }

  suppressMenu(menu:Cmenu):void{
      this.menu_service.deleteMenu(this.prop, this.restaurant, menu).catch(() => {
        this._snackBar.open("la suppression du menu n'a pas pu être réalisée", "fermer");
      }).finally(() => {
        this._snackBar.open(`le menu ${menu.nom} vient d'être supprimé`, "fermer")
      });
  }

}
