import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, UrlTree } from '@angular/router';
import { CIngredient } from '../../../../app/interfaces/ingredient';
import { Cpreparation } from '../../../../app/interfaces/preparation';
import { AddPreparationsComponent } from './add.preparations/add.preparations.component';
import { DisplayPreparationsComponent } from './display.preparation/display.preparations/display.preparations.component';
import { Cconsommable } from 'src/app/interfaces/consommable';
import { Unsubscribe } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { InteractionBddFirestore } from 'src/app/interfaces/interaction_bdd';

@Component({
  selector: 'app-preparations',
  templateUrl: './app.preparations.component.html',
  styleUrls: ['./app.preparations.component.css']
})
export class AppPreparationsComponent implements OnInit, OnDestroy{
  @Input() recette:string | null;
  private url: UrlTree;
  private router: Router;
  private prop:string;
  private restaurant:string;
  private path_to_ingredients:Array<string>;
  private path_to_preparation:Array<string>;
  private path_to_consommable:Array<string>;
  private req_ingredients!:Unsubscribe;
  private req_preparations!:Unsubscribe;
  private req_consommables!:Unsubscribe;
  private ingredients_sub!:Subscription;
  private preparations_sub!:Subscription;
  private consommables_sub!:Subscription;
  private ingredients:Array<CIngredient>;
  private consommables:Array<Cconsommable>;
  private prepa_names: Array<string | null>;
  public preparations: Array<Cpreparation>;
  public write: boolean;

  constructor(public dialog: MatDialog, router: Router, private _snackBar: MatSnackBar, private firestore:FirebaseService) {
    this.preparations = [];
    this.prepa_names = [];
    this.router = router;
    this.prop = "";
    this.restaurant = "";
    this.ingredients = [];
    this.consommables = [];
    this.url = this.router.parseUrl(this.router.url);
    this.recette = null;
    this.write = false;
    this.path_to_ingredients = [];
    this.path_to_preparation = [];
    this.path_to_consommable = [];
  }
  ngOnDestroy(): void {
    this.req_ingredients();
    this.req_consommables();
    this.req_preparations();
    this.ingredients_sub.unsubscribe();
    this.consommables_sub.unsubscribe();
    this.preparations_sub.unsubscribe();
  }
  ngOnInit(): void {
    if(this.recette !== null){
      if(this.recette.includes("w")) this.write = true;
      if(this.recette.includes("r")){
        let user_info = this.url.queryParams;
        this.prop = user_info["prop"];
        this.restaurant = user_info["restaurant"];
        this.path_to_ingredients = CIngredient.getPathsToFirestore(this.prop, this.restaurant);
        this.path_to_preparation = Cpreparation.getPathsToFirestore(this.prop, this.restaurant);
        this.path_to_consommable = Cconsommable.getPathsToFirestore(this.prop, this.restaurant);
        this.req_ingredients = this.firestore.getFromFirestoreBDD(this.path_to_ingredients,CIngredient);
        this.ingredients_sub = this.firestore.getFromFirestore().subscribe((ingredients:Array<InteractionBddFirestore>) => {
          this.req_preparations = this.firestore.getFromFirestoreBDD(this.path_to_preparation, Cpreparation);
          this.ingredients = ingredients as Array<CIngredient>;
          this.preparations_sub = this.firestore.getFromFirestore().subscribe((preparations:Array<InteractionBddFirestore>) => {
            this.req_consommables = this.firestore.getFromFirestoreBDD(this.path_to_consommable,Cconsommable);
            this.preparations = preparations as Array<Cpreparation>;
            this.consommables_sub = this.firestore.getFromFirestore().subscribe((consommables:Array<InteractionBddFirestore>) => {
              this.consommables = consommables as Array<Cconsommable>;;
            });
          });
        });
      }
    }
  }
  addPreparation():void {
   this.prepa_names =  this.preparations.map(prepa => prepa.name); 
   this.dialog.open(AddPreparationsComponent, {
      height: `${window.innerHeight}px`,
      width: `900px`,
      data: {
        prop: this.prop,
        restaurant: this.restaurant,
        names: this.prepa_names,
        _ingredients: this.ingredients,
        _consommables: this.consommables,
        preparation: null,
        modification: false
      }
    });
  }

  modifPreparation(preparation:Cpreparation):void {
    this.dialog.open(AddPreparationsComponent, {
      height: `${window.innerHeight}px`,
      width: `900px`,
      data: {
        prop: this.prop,
        restaurant: this.restaurant,
        names: this.prepa_names,   
        _ingredients: this.ingredients,
        _consommables: this.consommables,
        preparation:preparation,
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
        _ingredients: this.ingredients,
        _consommables: this.consommables, 
        preparation: preparation,
      }
    })
  }
  suppressPreparation(preparation: Cpreparation):void{
    if(preparation.name !== null){
      this.firestore.removeFirestoreBDD(preparation.id,this.path_to_preparation).catch((e) => {
        console.log(e);
        this._snackBar.open("Impossible de supprimer la préparation veuillez contacter softeat", "fermer");
      }).finally(() => {
        this._snackBar.open("Nous venons de supprimer la préparation", "fermer")
      })
    } 
  }
}
