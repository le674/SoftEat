import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, UrlTree } from '@angular/router';
import { Cconsommable, CIngredient, TIngredientBase } from 'src/app/interfaces/ingredient';
import { Cmenu } from 'src/app/interfaces/menu';
import { Cplat } from 'src/app/interfaces/plat';
import { ConsommableInteractionService } from 'src/app/services/menus/consommable-interaction.service';
import { IngredientsInteractionService } from 'src/app/services/menus/ingredients-interaction.service';
import { MenuInteractionService } from 'src/app/services/menus/menu-interaction.service';
import { PlatsInteractionService } from 'src/app/services/menus/plats-interaction.service';
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
  private ingredients: Array<CIngredient>
  private consommables: Array<Cconsommable>
  private plats: Array<Cplat>;

  constructor(private menu_service:MenuInteractionService,
    router: Router,  public dialog: MatDialog, private ingredient_service: IngredientsInteractionService,
    private conso_service: ConsommableInteractionService, private plat_service: PlatsInteractionService) {
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
      this.ingredients = ingredients;
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
      height: `${window.innerHeight - window.innerWidth / 5}px`,
      width: `${window.innerWidth - window.innerWidth / 10}px`,
      data:{
        ingredients: this.ingredients,
        consommables:this.consommables,
        plats:this.plats,
        menu:null
      }
    });
  }

  modifyMenu(menu:Cmenu):void{
    const dialogRef = this.dialog.open(AddMenuComponent, {
      height: `${window.innerHeight - window.innerWidth / 5}px`,
      width: `${window.innerWidth - window.innerWidth / 10}px`,
      data:{
        ingredients: this.ingredients,
        consommables:this.consommables,
        plats:this.plats,
        menu:menu
      }
    });
  }

  seeMenu(menu:Cmenu):void{
    const dialogRef = this.dialog.open(DisplayMenuComponent, {
      height: `${window.innerHeight - window.innerWidth / 5}px`,
      width: `${window.innerWidth - window.innerWidth / 10}px`
    })
  }

  suppressMenu(menu:Cmenu):void{
      
  }

}
