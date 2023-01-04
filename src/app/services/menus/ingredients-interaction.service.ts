import { Injectable } from '@angular/core';
import { FirebaseApp } from "@angular/fire/app";
import { child, Database, DatabaseReference, get, getDatabase, ref, set, update } from 'firebase/database';
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

  async getIngredientsBrFromRestaurants(prop: string, restaurant: string) {
    const ref_db = ref(this.db);
    this.ingredients = [];
    await get(child(ref_db, `ingredients/${prop}/${restaurant}/`)).then((ingredients) => {
      ingredients.forEach((ingredient) => {
        if ((ingredient.key !== "preparation") && (ingredient.key !== "resto_auth")) {
          const add_ingredient = new CIngredient(this.service, this);
          add_ingredient.setNom(ingredient.key);
          add_ingredient.setCategorieRestaurant(ingredient.child("categorie").val());
          add_ingredient.setCategorieDico(ingredient.child("categorie_dico").val());
          add_ingredient.setCategorieTva(ingredient.child("categorie_tva").val());
          add_ingredient.setTauxTva(ingredient.child("taux_tva").val());
          add_ingredient.setCost(ingredient.child("cost").val());
          add_ingredient.setQuantity(ingredient.child("quantity").val());
          add_ingredient.setQuantityUniy(ingredient.child("quantity_unitaire").val());
          add_ingredient.setUnity(ingredient.child("unity").val());
          add_ingredient.setQuantityAfterPrep(ingredient.child("quantity_after_prep").val());
          add_ingredient.setQuantityBefPrep(ingredient.child("quantity_bef_prep").val());
          add_ingredient.setCostTtc(ingredient.child("cost_ttc").val());
          add_ingredient.setDlc(ingredient.child("dlc").val());
          add_ingredient.setDateReception(ingredient.child("date_reception").val());
          this.ingredients.push(add_ingredient);
        }
      })
    })
    return this.ingredients
  }

  async getIngredientsPrepFromRestaurants(prop: string, restaurant: string) {
    this.ingredients = [];
    const ref_db = ref(this.db);
    await get(child(ref_db, `ingredients/${prop}/${restaurant}/preparation`)).then((ingredients) => {
      ingredients.forEach((ingredient) => {
        const add_ingredient = new CIngredient(this.service, this);
        add_ingredient.setNom(ingredient.key);
        add_ingredient.setCategorieRestaurant(ingredient.child("categorie").val());
        add_ingredient.setCategorieDico(ingredient.child("categorie_dico").val());
        add_ingredient.setCategorieTva(ingredient.child("categorie_tva").val());
        add_ingredient.setTauxTva(ingredient.child("taux_tva").val());
        add_ingredient.setCost(ingredient.child("cost").val());
        add_ingredient.setQuantity(ingredient.child("quantity").val());
        add_ingredient.setQuantityUniy(ingredient.child("quantity_unitaire").val());
        add_ingredient.setUnity(ingredient.child("unity").val());
        add_ingredient.setBaseIng(ingredient.child("base_ing").val());
        add_ingredient.setQuantityAfterPrep(ingredient.child("quantity_after_prep").val());
        add_ingredient.setQuantityBefPrep(ingredient.child("quantity_bef_prep").val());
        add_ingredient.setCostTtc(ingredient.child("cost_ttc").val());
        add_ingredient.setDlc(ingredient.child("dlc").val());
        add_ingredient.setDlc(ingredient.child("date_reception").val());
        this.ingredients.push(add_ingredient);
      })
    })
    return this.ingredients;
  }


  async getInfoIngFromDico(nom: string) {
    let ingredient ={
      is_similar: 0,
      categorie_dico: "",
      categorie_tva: "",
      conditionnement: false,
      dlc: 0,
      gelee: false,
      refrigiree: false
    };
    const db = collection(this.firestore, 'dico_ingredients');
    const query_snapshot = await getDocs(db)
    query_snapshot.forEach((ingredient_dico) => {    
      const nom_array = nom.split('_');
      const is_ing_in = nom_array.map((ingredient_chunck) => ingredient_dico.data()['array_id'].includes(ingredient_chunck));
      const is_similar = is_ing_in.reduce((sum,next) => sum + next);
      let actual_coeff = ingredient.is_similar
      if(actual_coeff === undefined) actual_coeff = 0;
      if(is_similar > actual_coeff){
        ingredient.categorie_dico = ingredient_dico.data()['id'];
        ingredient.categorie_tva = ingredient_dico.data()['categorie'];
        ingredient.conditionnement = ingredient_dico.data()['conditionnement'];
        ingredient.dlc = ingredient_dico.data()['DLC'];
        ingredient.gelee = ingredient_dico.data()['gelee'];
        ingredient.refrigiree = ingredient_dico.data()['refrigiree'];
      }
      ingredient.is_similar =  is_similar;
    })
    return ingredient;
  }

  async setIngInBdd(ingredient: CIngredient, prop:string, restaurant:string, is_prep:boolean){
    let ref_db: DatabaseReference;
    if(is_prep){
      ref_db = ref(this.db, `ingredients/${prop}/${restaurant}/preparation/`);
    }
    else{
      ref_db = ref(this.db, `ingredients/${prop}/${restaurant}/`);
    }

    await update(ref_db, {
      [ingredient.nom]: {
      categorie_tva: ingredient.categorie_tva,
      taux_tva: ingredient.taux_tva,
      cost: ingredient.cost,
      quantity: ingredient.quantity,
      quantity_unitaire: ingredient.quantity_unity,
      unity: ingredient.unity,
      base_ing: ingredient.base_ing,
      quantity_after_prep: ingredient.quantity_after_prep,
      quantity_bef_prep: ingredient.quantity_bef_prep,
      cost_ttc: ingredient.cost_ttc,
      date_reception: ingredient.date_reception,
      dlc: ingredient.dlc
    }
  })
  }
}
