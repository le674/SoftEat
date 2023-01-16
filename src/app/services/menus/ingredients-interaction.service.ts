import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { FirebaseApp } from "@angular/fire/app";
import { child, Database, DatabaseReference, get, getDatabase, onValue, ref, remove, set, update } from 'firebase/database';
import { collection, doc, Firestore, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { Subject } from 'rxjs';
import { CIngredient, Ingredient } from 'src/app/interfaces/ingredient';
import { CalculService } from './menu.calcul/menu.calcul.ingredients/calcul.service';


@Injectable({
  providedIn: 'root'
})
export class IngredientsInteractionService {

  private db: Database;
  private firestore: Firestore;
  private ingredients_prep: Array<CIngredient>;
  private ingredients: Array<CIngredient>;
  private data_ingredient = new Subject<Array<CIngredient>>();
  private data_ingredient_prep = new Subject<Array<CIngredient>>();


  constructor(private ofApp: FirebaseApp, private service: CalculService) {
    this.db = getDatabase(ofApp);
    this.firestore = getFirestore(ofApp);
    this.ingredients = [];
    this.ingredients_prep = [];
  }

 getIngredientsBrFromRestaurantsBDD(prop: string, restaurant: string):void {
    const ref_db = ref(this.db);
    const path = `ingredients/${prop}/${restaurant}/`;
    onValue(child(ref_db, `ingredients/${prop}/${restaurant}/`), (ingredients) => {
      this.ingredients = [];
      this.data_ingredient.next([]);
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
          add_ingredient.setMarge(ingredient.child("marge").val());
          this.ingredients.push(add_ingredient);
        }
      })
      this.data_ingredient.next(this.ingredients)
    })
  }

 getIngredientsPrepFromRestaurantsBDD(prop: string, restaurant: string):void {
    const ref_db = ref(this.db);
     onValue(child(ref_db, `ingredients/${prop}/${restaurant}/preparation`), (ingredients) => {
      this.ingredients_prep = [];
      this.data_ingredient_prep.next([]);
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
        add_ingredient.setDlc(new Date(ingredient.child("dlc").val()));
        add_ingredient.setDateReception(new Date(ingredient.child("date_reception").val()));
        add_ingredient.setMarge(ingredient.child("marge").val());
        this.ingredients_prep.push(add_ingredient);
      })
      this.data_ingredient_prep.next(this.ingredients_prep);
    })
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

  async setIngInBdd(ingredient: CIngredient, prop:string, restaurant:string, is_prep:boolean, new_ing_aft_prepa: CIngredient[] | null){
    let ref_db: DatabaseReference;
    ref_db = ref(this.db, `ingredients/${prop}/${restaurant}/`);

    if(is_prep){
      // dans le cas d'ajout d'une préparation on modifie l'ingrédient préparé et les ingrédients de base
      let prep_path = `preparation/${ingredient.nom}`
      let brut_path = new_ing_aft_prepa?.map((ing) => ing.nom)
      let ingredient_princ =  {
        [prep_path]: {
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
          dlc: ingredient.dlc,
          marge: ingredient.marge
        }
      }
      // si on reçoit des ingrédients brut à modifier 
      if(brut_path !== undefined && new_ing_aft_prepa !== null){
        brut_path.forEach((path, index:number) => {
          Object.assign(ingredient_princ, {
            [path]: {
              categorie_tva:  new_ing_aft_prepa[index].categorie_tva,
              taux_tva:  new_ing_aft_prepa[index].taux_tva,
              cost:  new_ing_aft_prepa[index].cost,
              quantity: new_ing_aft_prepa[index].quantity,
              quantity_unitaire: new_ing_aft_prepa[index].quantity_unity,
              unity: new_ing_aft_prepa[index].unity,
              base_ing: new_ing_aft_prepa[index].base_ing,
              quantity_after_prep: new_ing_aft_prepa[index].quantity_after_prep,
              quantity_bef_prep: new_ing_aft_prepa[index].quantity_bef_prep,
              cost_ttc: new_ing_aft_prepa[index].cost_ttc,
              date_reception: new_ing_aft_prepa[index].date_reception,
              dlc: new_ing_aft_prepa[index].dlc,
              marge: new_ing_aft_prepa[index].marge
            }
          })
        })
      }
      await update(ref_db, ingredient_princ)
    }
    else{
    // dans le cas d'ajout d'une non préparation  on modifie l'ingrédient préparé 
    const ingredient_princ =  {
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
          dlc: ingredient.dlc,
          marge: ingredient.marge
        }
      }
      console.log(ingredient_princ);
      await update(ref_db, ingredient_princ)
    }
  }

  async removeIngInBdd(name_ing: string, prop:string, restaurant:string, is_prep:boolean){
    let ref_db: DatabaseReference;
    if(name_ing !== ""){
      if(is_prep){
        ref_db = ref(this.db, `ingredients/${prop}/${restaurant}/preparation/${name_ing}`);
      }
      else{
        ref_db = ref(this.db, `ingredients/${prop}/${restaurant}/${name_ing}`);
      }
  
      await remove(ref_db).then(() => console.log("ingrédient ", name_ing, "bien supprimée"))
    }
  }

  getIngredientsBrFromRestaurants(){
    return this.data_ingredient.asObservable();
  }

  getIngredientsPrepFromRestaurants(){
    return this.data_ingredient_prep.asObservable();
  }
}
