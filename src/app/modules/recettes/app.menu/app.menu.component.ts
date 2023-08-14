import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, UrlTree } from '@angular/router';
import { CIngredient } from '../../../../app/interfaces/ingredient';
import { Cmenu } from '../../../../app/interfaces/menu';
import { Cplat } from '../../../../app/interfaces/plat';
import { AddMenuComponent } from './add.menu/add.menu.component';
import { DisplayMenuComponent } from './display.menu/display.menu.component';
import { Cconsommable } from 'src/app/interfaces/consommable';
import { Unsubscribe } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { InteractionBddFirestore } from 'src/app/interfaces/interaction_bdd';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
  styleUrls: ['./app.menu.component.css']
})
export class AppMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() recette:string | null;
  public menus: Array<Cmenu>
  private url: UrlTree;
  private prop: string;
  private restaurant: string;
  private router: Router;
  private ingredients: Array<CIngredient>
  private consommables: Array<Cconsommable>
  private plats: Array<Cplat>;
  private path_to_ing:Array<string>;
  private path_to_conso:Array<string>;
  private path_to_plat:Array<string>;
  private path_to_menu:Array<string>;
  private req_ingredients!:Unsubscribe;
  private req_consommables!:Unsubscribe;
  private req_plats!:Unsubscribe;
  private req_menus!:Unsubscribe
  private ingredients_sub!:Subscription;
  private consommables_sub!:Subscription;
  private plats_sub!:Subscription;
  private menus_sub!:Subscription;
  public write:boolean;
  constructor(router: Router, public dialog: MatDialog, private firestore: FirebaseService, private _snackBar: MatSnackBar) {
    this.menus = [];
    this.ingredients = [];
    this.consommables = [];
    this.plats = [];
    this.path_to_ing = [];
    this.path_to_conso = [];
    this.path_to_plat = [];
    this.path_to_menu = [];
    this.prop = "";
    this.restaurant = "";
    this.router = router;
    this.url = this.router.parseUrl(this.router.url);
    this.recette = null;
    this.write = false;
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
    if(this.recette !== null){
      if(this.recette.includes("w")) this.write = true;
      if(this.recette.includes("r")){
        let user_info = this.url.queryParams;
        this.prop = user_info["prop"];
        this.restaurant = user_info["restaurant"];
        this.path_to_ing = CIngredient.getPathsToFirestore(this.prop, this.restaurant);
        this.path_to_conso = Cconsommable.getPathsToFirestore(this.prop, this.restaurant);
        this.path_to_plat = Cplat.getPathsToFirestore(this.prop);
        this.path_to_menu = Cmenu.getPathsToFirestore(this.prop);
        this.req_ingredients =  this.firestore.getFromFirestoreBDD(this.path_to_ing, CIngredient);
        this.ingredients_sub = this.firestore.getFromFirestore().subscribe((ingredients:Array<InteractionBddFirestore>) => {
          this.ingredients = ingredients as Array<CIngredient>;
          this.req_consommables =  this.firestore.getFromFirestoreBDD(this.path_to_conso, Cconsommable);
          this.consommables_sub = this.firestore.getFromFirestore().subscribe((consommables:Array<InteractionBddFirestore>) => {
            this.consommables = consommables as Array<Cconsommable>;
            this.req_plats = this.firestore.getFromFirestoreBDD(this.path_to_plat, Cplat);
            this.plats_sub = this.firestore.getFromFirestore().subscribe((plats: Array<InteractionBddFirestore>) => {
              this.plats = plats as Array<Cplat>;
              this.req_menus = this.firestore.getFromFirestoreBDD(this.path_to_menu,Cmenu);
              this.menus_sub = this.firestore.getFromFirestore().subscribe((menus: Array<InteractionBddFirestore>) => {
                this.menus = menus as Array<Cmenu>;
              })
            })
          })
        })
      }
    }
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
