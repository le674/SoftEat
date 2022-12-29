import { Injectable } from '@angular/core';
import { FirebaseApp } from "@angular/fire/app";
import { child, Database, get, getDatabase, ref } from 'firebase/database';
import { CIngredient, CingredientModif, Ingredient } from 'src/app/interfaces/ingredient';

@Injectable({
  providedIn: 'root'
})
export class IngredientsInteractionService {
  
  private db: Database;
  private ingredients: Array<Ingredient>
  private ingredientsModif: Array<CingredientModif>

  constructor(private ofApp: FirebaseApp) { 
    this.db = getDatabase(ofApp);
    this.ingredients = [];
    this.ingredientsModif = [];
  }

  async getIngredientsBrFromRestaurants(prop:string, restaurant:string){
    const ref_db = ref(this.db);
    await get(child(ref_db, `ingredients/${prop}/${restaurant}/`)).then((ingredients) => {
      ingredients.forEach((ingredient) => {
        if(ingredient.key !== "preparation"){
          const add_ingredient = new CIngredient();
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
    const ref_db = ref(this.db);
    await get(child(ref_db, `ingredients/${prop}/${restaurant}/preparation`)).then((ingredients) => {
          ingredients.forEach((ingredient) => {
            const add_ingredient = new CingredientModif();
            add_ingredient.setNom(ingredient.key);
            add_ingredient.setNomBase(ingredient.child("name").val())
            add_ingredient.setQuantity(ingredient.child("quantity").val());
            add_ingredient.setQuantityUniy(ingredient.child("quantity_unitaire").val());
            add_ingredient.setUnity(ingredient.child("unity").val());
            this.ingredientsModif.push(add_ingredient);
          })
      })
    return  this.ingredientsModif
  }
}
