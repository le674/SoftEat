import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, UrlTree } from '@angular/router';
import { CIngredient, TIngredientBase } from '../../../../app/interfaces/ingredient';
import { Cmenu } from '../../../../app/interfaces/menu';
import { Cplat } from '../../../../app/interfaces/plat';
import { ConsommableInteractionService } from '../../../../app/services/menus/consommable-interaction.service';
import { IngredientsInteractionService } from '../../../../app/services/menus/ingredients-interaction.service';
import { MenuInteractionService } from '../../../../app/services/menus/menu-interaction.service';
import { PlatsInteractionService } from '../../../../app/services/menus/plats-interaction.service';
import { AddMenuComponent } from './add.menu/add.menu.component';
import { DisplayMenuComponent } from './display.menu/display.menu.component';
import { Cconsommable } from 'src/app/interfaces/consommable';
import { Unsubscribe } from 'firebase/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
  styleUrls: ['./app.menu.component.css']
})
export class AppMenuComponent implements OnInit, AfterViewInit, OnDestroy {

  public menus: Array<Cmenu>
  private url: UrlTree;
  private prop: string;
  private restaurant: string;
  private router: Router;
  private ingredients: Array<CIngredient>
  private consommables: Array<Cconsommable>
  private plats: Array<Cplat>;
  private req_ingredients!:Unsubscribe;
  private req_consommables!:Unsubscribe;
  private req_plats!:Unsubscribe;
  private req_menus!:Unsubscribe
  private ingredients_sub!:Subscription;
  private consommables_sub!:Subscription;
  private plats_sub!:Subscription;
  private menus_sub!:Subscription;

  constructor(private menu_service: MenuInteractionService,
    router: Router, public dialog: MatDialog, private ingredient_service: IngredientsInteractionService,
    private conso_service: ConsommableInteractionService, private plat_service: PlatsInteractionService, private _snackBar: MatSnackBar) {
    this.menus = [];
    this.ingredients = [];
    this.consommables = [];
    this.plats = [];
    this.prop = "";
    this.restaurant = "";
    this.router = router;
    this.url = this.router.parseUrl(this.router.url);
  }
  ngOnDestroy(): void {
    this.req_menus();
    this.req_plats();
    this.req_ingredients();
    this.req_consommables();
    this.menus_sub.unsubscribe();
    this.plats_sub.unsubscribe();
    this.ingredients_sub.unsubscribe();
    this.consommables_sub.unsubscribe();
  }

  ngOnInit(): void {
    let user_info = this.url.queryParams;
    this.prop = user_info["prop"];
    this.restaurant = user_info["restaurant"];
    this.req_ingredients =  this.ingredient_service.getIngredientsFromRestaurantsBDD(this.prop, this.restaurant);
    this.req_consommables =  this.conso_service.getConsommablesFromRestaurantsBDD(this.prop, this.restaurant);
    this.req_plats = this.plat_service.getPlatFromRestaurantBDD(this.prop);
    this.req_menus = this.menu_service.getMenuFromRestaurantBDD(this.prop);
    this.ingredients_sub = this.ingredient_service.getIngredientsFromRestaurants().subscribe((ingredients:Array<CIngredient>) => {
      this.ingredients = ingredients;
      this.consommables_sub = this.conso_service.getConsommablesFromRestaurants().subscribe((consommables:Array<Cconsommable>) => {
        this.consommables = consommables;
        this.plats_sub = this.plat_service.getPlatFromRestaurant().subscribe((plats: Array<Cplat>) => {
          this.plats = plats;
          this.menus_sub = this.menu_service.getMenuFromRestaurant().subscribe((menus: Array<Cmenu>) => {
            this.menus = menus;
          })
        })
      })
    })
  }
  ngAfterViewInit(): void {

  }

  addMenu(): void {

    const dialogRef = this.dialog.open(AddMenuComponent, {
      height: `${window.innerHeight - window.innerWidth / 10}px`,
      width: `${window.innerWidth - window.innerWidth / 10}px`,
      data: {
        prop: this.prop,
        restaurant: this.restaurant,
        ingredients: this.ingredients,
        consommables: this.consommables,
        plats: this.plats,
        menu: null,
        modification: false
      }
    });
  }

  modifyMenu(menu: Cmenu): void {
    const dialogRef = this.dialog.open(AddMenuComponent, {
      height: `${window.innerHeight - window.innerWidth / 10}px`,
      width: `${window.innerWidth - window.innerWidth / 10}px`,
      data: {
        prop: this.prop,
        restaurant: this.restaurant,
        ingredients: this.ingredients,
        consommables: this.consommables,
        plats: this.plats,
        menu: menu,
        modification: true
      }
    });
  }

  seeMenu(menu: Cmenu): void {
    const dialogRef = this.dialog.open(DisplayMenuComponent, {
      height: `${window.innerHeight}px`,
      width: `800px`,
      data: {
        prop:this.prop,
        restaurant: this.restaurant,
        plats:this.plats,
        menu: menu
      }
    })
  }

  suppressMenu(menu: Cmenu): void {
    
  }

}
