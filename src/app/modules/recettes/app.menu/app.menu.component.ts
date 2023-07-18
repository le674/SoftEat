import { AfterViewInit, Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
  styleUrls: ['./app.menu.component.css']
})
export class AppMenuComponent implements OnInit, AfterViewInit {

  public menus: Array<Cmenu>
  private url: UrlTree;
  private prop: string;
  private restaurant: string;
  private router: Router;
  private ingredients: Array<CIngredient>
  private consommables: Array<Cconsommable>
  private plats: Array<Cplat>;

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

  ngOnInit(): void {
    let user_info = this.url.queryParams;
    this.prop = user_info["prop"];
    this.restaurant = user_info["restaurant"];
    this.ingredient_service.getIngredientsFromRestaurantsBDD(this.prop, this.restaurant)
    this.ingredient_service.getIngredientsFromRestaurants().subscribe((ingredients) => {
      this.ingredients = ingredients;
      this.conso_service.getConsommablesFromRestaurantsBDD(this.prop, this.restaurant);
      this.conso_service.getConsommablesFromRestaurants().subscribe((consommables) => {
        this.consommables = consommables;
        this.plat_service.getPlatFromRestaurantBDD(this.prop, this.restaurant);
        this.plat_service.getPlatFromRestaurant().subscribe((plats: Array<Cplat>) => {
          this.menu_service.getMenuFromRestaurantBDD(this.prop, this.restaurant);
          this.menu_service.getMenuFromRestaurant().subscribe((menu: Array<Cmenu>) => {

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
        menu: null
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
        menu: menu
      }
    });
  }

  seeMenu(menu: Cmenu): void {
    const dialogRef = this.dialog.open(DisplayMenuComponent, {
      height: `${window.innerHeight}px`,
      width: `800px`,
      data: {
        menu: menu
      }
    })
  }

  suppressMenu(menu: Cmenu): void {
    this.menu_service.deleteMenu(this.prop, this.restaurant, menu).catch(() => {
      this._snackBar.open("la suppression du menu n'a pas pu être réalisée", "fermer");
    }).finally(() => {
      this._snackBar.open(`le menu ${menu.nom} vient d'être supprimé`, "fermer")
    });
  }

}
