import { Injectable } from '@angular/core';
import { FirebaseApp } from "@angular/fire/app";
import { Unsubscribe } from 'firebase/auth';
import { DocumentSnapshot, Firestore, getFirestore, SnapshotOptions } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { CIngredient, TIngredientBase } from '../../../app/interfaces/ingredient';
import { Cpreparation } from '../../../app/interfaces/preparation';
import { CalculService } from './menu.calcul/menu.calcul.ingredients/calcul.service';
import { addDoc, collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { RowIngredient } from 'src/app/interfaces/inventaire';


@Injectable({
  providedIn: 'root'
})
export class IngredientsInteractionService {
  private firestore: Firestore;
  private ingredient_converter:any;
  private preparation_converter:any;
  private base_ingredient_converter:any;
  private ingredients_minimal: Array<TIngredientBase>
  private _preparations: Array<Cpreparation>;
  private _ingredients: Array<CIngredient>;
  private ingredients = new Subject<Array<CIngredient>>();
  private preparations = new Subject<Array<Cpreparation>>();
  private sub_ingredients_base!:Unsubscribe;
  private sub_preparations!:Unsubscribe;
  private sub_ingredients!:Unsubscribe;


  constructor(private ofApp: FirebaseApp, private service: CalculService) {
    this.firestore = getFirestore(ofApp);
    this.ingredient_converter = {
      toFirestore: (ingredient:CIngredient) => {
        return ingredient;
      },
      fromFirestore: (snapshot:DocumentSnapshot<CIngredient>, options:SnapshotOptions) => {
        const data = snapshot.data(options);
        let ingredient = new CIngredient(this.service);
        ingredient.setData(data);
        if(data !== undefined){
          return ingredient;
        }
        else{
          return null;
        }
      } 
    }
    this.base_ingredient_converter = {
      toFirestore: (ingredient:TIngredientBase) => {
        return ingredient;
      },
      fromFirestore: (snapshot:DocumentSnapshot<TIngredientBase>, options:SnapshotOptions) => {
        const data = snapshot.data(options);
        if(data !== undefined){
          let ingredient = new TIngredientBase(data.name, data.quantity, data.unity);
          ingredient.id = data.id;
          ingredient.added_price = data.added_price;
          return ingredient;
        }
        else{
          return null;
        }
      } 
    }
    this.preparation_converter = {
      toFirestore: (preparation:Cpreparation) => {
        return preparation;
      },
      fromFirestore: (snapshot:DocumentSnapshot<Cpreparation>, options:SnapshotOptions) => {
        const data = snapshot.data(options);
        if(data !== undefined){
          let preparation = new Cpreparation(this.service);
          preparation.setData(data)
          return preparation;
        }
        else{
          return null;
        }
      } 
    }
    this._ingredients = [];
    this._preparations = [];
    this.ingredients_minimal = [];
  }
  /**
   * Ajout d'un ingrédient à la base de donnée
   * @param ingredient ingrédient à ajouter dans la base de donnée
   * @param prop id du propriétaire pour lequel ont ajoute l'ingrédient
   * @param restaurant id du resdtaurant pour lequel ont ajoute l'ingreient
   */
  async setIngInBdd(ingredient: CIngredient, prop: string, restaurant: string) {
   const ingredients_ref = doc(collection(doc(
      collection(
        doc(
          collection(
            this.firestore, "proprietaires"
            ), prop
          ), "restaurants"
        ), restaurant
      ), "ingredients")).withConverter(this.ingredient_converter);
    await setDoc(ingredients_ref, ingredient.getData(ingredients_ref.id, prop))
  }
  /**
   * modification d'un ingrédient de la base de donnée
   * @param ingredient ingrédient que l'on modifie dans la base de donnée
   * @param proprietaire_id identifiant de l'enseigne qui contient l'ingrédient
   * @param restaurant_id identifiant du restaurant qui contient l'ingrédient
   */
  async updateIngInBdd(ingredient:CIngredient, proprietaire_id:string, restaurant_id:string){
    const ingredients_ref = doc(collection(doc(
      collection(
        doc(
          collection(
            this.firestore, "proprietaires"
            ), proprietaire_id
          ), "restaurants"
        ), restaurant_id
      ), "ingredients"),
      ingredient.id).withConverter(this.ingredient_converter);
      await updateDoc(ingredients_ref, ingredient.getData(null, proprietaire_id))
  }
  /**
   * Suppréssion de l'ingrédient ddans la base de donnée 
   * @param ingredient ingrédient que l'on supprime de la base de donnée 
   * @param prop enseigne qui possède l'ingrédient
   * @param restaurant restaurant qui possède l'ingrédient
   */
  async removeIngInBdd(ingredient: RowIngredient, prop: string, restaurant: string) {
    const ingredients_ref = doc(collection(doc(
      collection(
        doc(
          collection(
            this.firestore, "proprietaires"
            ), prop
          ), "restaurants"
        ), restaurant
      ), "ingredients"),
      ingredient.id).withConverter(this.ingredient_converter);
    await deleteDoc(ingredients_ref); 
  }
  /**
    * récupération de l'ensemble des ingrédients depuis le restaurant
    * @param proprietaire_id identifiant de l'enseigne qui détient les ingrédients
    * @param restaurant_id identifiant du restaurant qui détient les ingrédients
    * @returns 
  */
  getIngredientsFromRestaurantsBDD(proprietaire_id:string, restaurant_id:string){
    const ingredients_ref = collection(doc(
      collection(
        doc(
          collection(
            this.firestore, "proprietaires"
            ), proprietaire_id
          ), "restaurants"
        ), restaurant_id
      ), "ingredients").withConverter(this.ingredient_converter);
    this.sub_ingredients = onSnapshot(ingredients_ref, (ingredients) => {

      this._ingredients = [];
      ingredients.forEach((ingredient) => {
          if(ingredient.exists()){
            this._ingredients.push(ingredient.data() as CIngredient)
          }
      })
      this.ingredients.next(this._ingredients);
    })
    return this.sub_ingredients;
  }
  /**
  * TODO
  * @param proprietaire_id TODO
  * @param restaurant_id TODO
  * @returns TODO
 */
  getPreparationsFromRestaurantsBDD(proprietaire_id:string, restaurant_id:string){
    const preparations_ref = collection(doc(
      collection(
        doc(
          collection(
            this.firestore, "proprietaires"
            ), proprietaire_id
          ), "restaurants"
        ), restaurant_id
      ), "preparations").withConverter(this.preparation_converter);
      this.sub_preparations = onSnapshot(preparations_ref, (preparations) =>{
        this._preparations = [];
        preparations.forEach((preparation) => {
          if(preparation.exists()){
            this._preparations.push(preparation.data() as Cpreparation);
          }
        })
        this.preparations.next(this._preparations);
      })
      return this.sub_preparations;
  }
  getIngredientsFromBaseIngBDD(){
    
  }
  
  getIngredientsFromBaseIng(){

  }
  getIngredientsFromRestaurants(){
    return this.ingredients.asObservable();
  }

  getPrepraparationsFromRestaurants(){
    return this.preparations.asObservable();
  }
}
