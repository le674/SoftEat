import { Injectable } from '@angular/core';
import { FirebaseApp } from "@angular/fire/app";
import { child, Database, get, getDatabase, ref } from 'firebase/database';
import { collection, doc, Firestore, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { CIngredient, Ingredient } from 'src/app/interfaces/ingredient';
import { CalculService } from './menu.calcul/menu.calcul.ingredients/calcul.service';


@Injectable({
  providedIn: 'root'
})
export class IngredientsInteractionService {
  
  private db: Database;
  private firestore: Firestore;
  private ingredients: Array<CIngredient>;


  constructor(private ofApp: FirebaseApp, private service: CalculService) { 
    this.db = getDatabase(ofApp);
    this.firestore = getFirestore(ofApp);
    this.ingredients = [];
  }

  async getIngredientsBrFromRestaurants(prop:string, restaurant:string){
    const ref_db = ref(this.db);
    this.ingredients = [];
    await get(child(ref_db, `ingredients/${prop}/${restaurant}/`)).then((ingredients) => {
      ingredients.forEach((ingredient) => {
        if((ingredient.key !== "preparation") && (ingredient.key !== "resto_auth")){
          const add_ingredient = new CIngredient(this.service, this);
          add_ingredient.setNom(ingredient.key);
          add_ingredient.setCategorieRestaurant(ingredient.child("categorie").val());
          add_ingredient.setCategorieDico(ingredient.child("categorie_dico").val());
          add_ingredient.setCategorieTva(ingredient.child("categorie_tva").val());
          add_ingredient.setCost(ingredient.child("cost").val());
          add_ingredient.setQuantity(ingredient.child("quantity").val());
          add_ingredient.setQuantityUniy(ingredient.child("quantity_unitaire").val());
          add_ingredient.setUnity(ingredient.child("unity").val());
          this.ingredients.push(add_ingredient);
        }
      })
    })
    return this.ingredients
  }

  async getIngredientsPrepFromRestaurants(prop:string, restaurant:string){
    this.ingredients = [];
    const ref_db = ref(this.db);
    await get(child(ref_db, `ingredients/${prop}/${restaurant}/preparation`)).then((ingredients) => {
          ingredients.forEach((ingredient) => {
            const add_ingredient = new CIngredient(this.service, this);
            add_ingredient.setNom(ingredient.key);
            add_ingredient.setCategorieRestaurant(ingredient.child("categorie").val());
            add_ingredient.setCategorieDico(ingredient.child("categorie_dico").val());
            add_ingredient.setCategorieTva(ingredient.child("categorie_tva").val());
            add_ingredient.setCost(ingredient.child("cost").val());
            add_ingredient.setQuantity(ingredient.child("quantity").val());
            add_ingredient.setQuantityAfterPrep(ingredient.child("quantity_after_prep").val())
            add_ingredient.setQuantityBefPrep(ingredient.child("quantity_bef_prep").val())
            add_ingredient.setQuantityUniy(ingredient.child("quantity_unitaire").val());
            add_ingredient.setUnity(ingredient.child("unity").val());
            this.ingredients.push(add_ingredient);
          })
      })
    return  this.ingredients;
  }


  async getInfoIngFromDico(nom: string){
    console.log('===============dico==============');
    let ingredient = new CIngredient(this.service, this);
    const db = collection(this.firestore, 'dico_ingredients');
    const res = query(db, where('id',"==",nom))
    const query_snapshot =  await getDocs(res)
    /* à priorie on a un seul identifiant contacter SoftEat au cas ou il y'aurait deux même id*/
    query_snapshot.forEach((doc) => {
      ingredient.categorie_dico =  doc.data()['id'];
      ingredient.categorie_tva = doc.data()['categorie'];
      ingredient.conditionnement = doc.data()['conditionnement'];
      ingredient.dlc = doc.data()['DLC'];
      ingredient.gelee = doc.data()['gelee'];
      ingredient.refrigiree = doc.data()['refrigiree'];
      
      console.log('===============dico==============');
      console.log(ingredient);
      
    })
    console.log('===============dico2==============');
    return ingredient;
  }
}
