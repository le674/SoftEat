import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { FirebaseApp } from "@angular/fire/app";
import { Unsubscribe } from 'firebase/auth';
import { child, Database, DatabaseReference, get, getDatabase, onValue, ref, remove, update } from 'firebase/database';
import { collection, Firestore, getDocs, getFirestore } from "firebase/firestore";
import { Subject } from 'rxjs';
import { CIngredient, TIngredientBase } from 'src/app/interfaces/ingredient';
import { Cpreparation } from 'src/app/interfaces/preparation';
import { CalculService } from './menu.calcul/menu.calcul.ingredients/calcul.service';


@Injectable({
  providedIn: 'root'
})
export class IngredientsInteractionService {
  private db: Database;
  private firestore: Firestore;
  private ingredients_minimal: Array<TIngredientBase>
  private preparation: Array<Cpreparation>;
  private ingredients: Array<CIngredient>;
  private data_ingredient = new Subject<Array<CIngredient>>();
  private data_ingredient_prep = new Subject<Array<Cpreparation>>();
  private sub_ingredients_br!:Unsubscribe;
  private sub_ingredients_prep!:Unsubscribe;


  constructor(private ofApp: FirebaseApp, private service: CalculService) {
    this.db = getDatabase(ofApp);
    this.firestore = getFirestore(ofApp);
    this.ingredients = [];
    this.preparation = [];
    this.ingredients_minimal = [];
  }

 getIngredientsBrFromRestaurantsBDD(prop: string, restaurant: string):Unsubscribe{
    const ref_db = ref(this.db);
    const path = `ingredients_${prop}_${restaurant}/${prop}/${restaurant}/`;
    this.sub_ingredients_br = onValue(child(ref_db, path), (ingredients) => {
      this.ingredients = [];
      this.data_ingredient.next([]);
      ingredients.forEach((ingredient) => {
        if (ingredient.key !== "preparation") {
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
          add_ingredient.setCostTtc(ingredient.child("cost_ttc").val());
          add_ingredient.setDlc(ingredient.child("dlc").val());
          add_ingredient.setDateReception(ingredient.child("date_reception").val());
          add_ingredient.setMarge(ingredient.child("marge").val());
          add_ingredient.setVrac(ingredient.child("vrac").val());
          this.ingredients.push(add_ingredient);
        }
      })
      this.data_ingredient.next(this.ingredients)
    })
    return this.sub_ingredients_br;
  }

 getIngredientsPrepFromRestaurantsBDD(prop: string, restaurant: string):Unsubscribe{
    const ref_db = ref(this.db);
    const path = `ingredients_${prop}_${restaurant}/${prop}/${restaurant}/preparation`;
     this.sub_ingredients_prep = onValue(child(ref_db, path), (preparations) => {
      this.preparation = [];
      this.data_ingredient_prep.next([]);
      preparations.forEach((preparation) => {
        const add_preparation= new Cpreparation(this.service);
        add_preparation.nom = preparation.key;
        add_preparation.categorie_restaurant = preparation.child("categorie").val();
        add_preparation.categorie_tva = preparation.child("categorie_tva").val();
        add_preparation.taux_tva = preparation.child("taux_tva").val();
        add_preparation.cost = preparation.child("cost").val();
        add_preparation.quantity = preparation.child("quantity").val();
        add_preparation.quantity_unity = preparation.child("quantity_unitaire").val();
        add_preparation.unity = preparation.child("unity").val();
        add_preparation.base_ing = preparation.child("base_ing").val();
        add_preparation.quantity_bef_prep = preparation.child("quantity_bef_prep").val();
        add_preparation.quantity_after_prep = preparation.child("quantity_after_prep").val();
        add_preparation.cost_ttc = preparation.child("cost_ttc").val();
        add_preparation.dlc = new Date(preparation.child("dlc").val());
        add_preparation.date_reception = new Date(preparation.child("date_reception").val());
        add_preparation.marge = preparation.child("marge").val();
        add_preparation.vrac = preparation.child("vrac").val();
        add_preparation.consommables = preparation.child('consommables').val();
        add_preparation.etapes = preparation.child("etapes").val();
        add_preparation.is_stock =  preparation.child("is_stock").val();
        this.preparation.push(add_preparation);
      })
      this.data_ingredient_prep.next(this.preparation);
    })
    return this.sub_ingredients_prep;
  }

  async getIngredientsBrFromRestaurantsPROM(prop: string, restaurant: string){
    this.ingredients = [];
    const ref_db = ref(this.db);
    const path = `ingredients_${prop}_${restaurant}/${prop}/${restaurant}/`
    await get(child(ref_db, path)).then((ingredients) => {
      ingredients.forEach((ingredient) => {
        if (ingredient.key !== "preparation") {
          if(ingredient.key !== null){
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
            add_ingredient.setCostTtc(ingredient.child("cost_ttc").val());
            add_ingredient.setDlc(ingredient.child("dlc").val());
            add_ingredient.setDateReception(ingredient.child("date_reception").val());
            add_ingredient.setMarge(ingredient.child("marge").val());
            add_ingredient.setVrac(ingredient.child("vrac").val());
            this.ingredients.push(add_ingredient);
          }
        }
      })
    })
    return this.ingredients;
  }

  async getIngredientsPrepFromRestaurantsPROMForMenu(prop: string, restaurant: string){
    this.preparation = [];
    const ref_db = ref(this.db);
    const path = `ingredients_${prop}_${restaurant}/${prop}/${restaurant}/preparation/`
    await get(child(ref_db, path)).then((preparations) => {
      preparations.forEach((preparation) => {
            const add_preparation = new Cpreparation(this.service);
            add_preparation.nom = preparation.key;
            add_preparation.categorie_restaurant = preparation.child("categorie").val();
            add_preparation.categorie_tva =  preparation.child("categorie_tva").val();
            add_preparation.taux_tva =  preparation.child("taux_tva").val();
            add_preparation.cost = preparation.child("cost").val();
            add_preparation.quantity = preparation.child("quantity").val();
            add_preparation.quantity_unity = preparation.child("quantity_unitaire").val();
            add_preparation.unity = preparation.child("unity").val();
            add_preparation.cost_ttc = preparation.child("cost_ttc").val();
            add_preparation.dlc = new Date(preparation.child("dlc").val());
            add_preparation.date_reception = new Date(preparation.child("date_reception").val());
            add_preparation.etapes = preparation.child("etapes").val();
            add_preparation.consommables = preparation.child("consommables").val();
            add_preparation.vrac = preparation.child("vrac").val();
            add_preparation.base_ing = preparation.child("base_ing").val();
            add_preparation.quantity_bef_prep = preparation.child("quantity_after_prep").val();
            add_preparation.quantity_after_prep = preparation.child("quantity_after_prep").val();
            add_preparation.is_stock = preparation.child("is_stock").val();
            this.preparation.push(add_preparation);
      })
    })
    return this.preparation;
  }


  async getIngredientsQuantityUnityFromBaseIngs(base_ings: Array<TIngredientBase>, prop:string, restaurant:string){

    this.ingredients_minimal = [];
    let ref_db: DatabaseReference;
    ref_db = ref(this.db)
    for (let index = 0; index < base_ings.length; index++) {
      
      const ingredient_name = base_ings[index].name.split(' ').join('_');
      const ingredient_quantity = base_ings[index].quantity;
      const path = `ingredients_${prop}_${restaurant}/${prop}/${restaurant}/${ingredient_name}`
      await get(child(ref_db, path)).then((ingredient_bdd) => {
        
        if((ingredient_bdd.child("cost").val() !== null)){
          let ingredient:TIngredientBase = {
            name: ingredient_name,
            quantity: ingredient_quantity,
            quantity_unity: ingredient_bdd.child("quantity_unitaire").val(),
            unity: ingredient_bdd.child("unity").val(),
            cost: ingredient_bdd.child("cost").val(),
            vrac: ingredient_bdd.child("vrac").val(),
            material_cost: ingredient_bdd.child("material_cost").val(),
            taux_tva: this.service.getTauxFromCat(ingredient_bdd.child("categorie_tva").val()),
            marge: 0
          };
          this.ingredients_minimal.push(ingredient);
        }
      })
    }
    return this.ingredients_minimal;
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

  async setPreparationInBdd(preparation: Cpreparation, prop:string, restaurant:string, new_ing_aft_prepa: CIngredient[] | null){
    let ref_db: DatabaseReference;
    const path = `ingredients_${prop}_${restaurant}/${prop}/${restaurant}/preparation/`;
    ref_db = ref(this.db, path);
         // dans le cas d'ajout d'une préparation on modifie l'ingrédient préparé et les ingrédients de base
         let prep_path = `${preparation.nom}`
         let brut_path = new_ing_aft_prepa?.map((ing) => ing.nom)
         let preparation_princ =  {
           [prep_path]: {
             categorie_tva: preparation.categorie_tva,
             taux_tva: preparation.taux_tva,
             cost: preparation.cost,
             quantity: preparation.quantity,
             quantity_unitaire: preparation.quantity_unity,
             unity: preparation.unity,
             base_ing: preparation.base_ing,
             quantity_after_prep: preparation.quantity_after_prep,
             quantity_bef_prep: preparation.quantity_bef_prep,
             cost_ttc: preparation.cost_ttc,
             date_reception: preparation.date_reception,
             dlc: preparation.dlc,
             marge: preparation.marge,
             vrac: preparation.vrac,
             is_stock:preparation.is_stock
           }
         }
         // si on reçoit des ingrédients brut à modifier 
         if(brut_path !== undefined && new_ing_aft_prepa !== null){
           brut_path.forEach((path, index:number) => {
             Object.assign(preparation_princ, {
               [path]: {
                 categorie_tva:  new_ing_aft_prepa[index].categorie_tva,
                 taux_tva:  new_ing_aft_prepa[index].taux_tva,
                 cost:  new_ing_aft_prepa[index].cost,
                 quantity: new_ing_aft_prepa[index].quantity,
                 quantity_unitaire: new_ing_aft_prepa[index].quantity_unity,
                 unity: new_ing_aft_prepa[index].unity,
                 cost_ttc: new_ing_aft_prepa[index].cost_ttc,
                 date_reception: new_ing_aft_prepa[index].date_reception,
                 dlc: new_ing_aft_prepa[index].dlc,
                 marge: new_ing_aft_prepa[index].marge,
                 vrac: new_ing_aft_prepa[index].vrac
               }
             })
           })
         }
         await update(ref_db, preparation_princ)
  }

  async setIngInBdd(ingredient: CIngredient, prop:string, restaurant:string, is_prep:boolean){
    let ref_db: DatabaseReference;
    const path_ings = `ingredients_${prop}_${restaurant}/${prop}/${restaurant}/${ingredient.nom}/`;
    const path_lst_ings = `inventaire_${prop}_${restaurant}/${prop}/${restaurant}/ingredients/${ingredient.nom}/`;
    ref_db = ref(this.db);
    // dans le cas d'ajout d'une non préparation  on modifie l'ingrédient préparé 
    const ingredient_princ =  {
        [path_ings]: {
          categorie_tva: ingredient.categorie_tva,
          taux_tva: ingredient.taux_tva,
          cost: ingredient.cost,
          quantity: ingredient.quantity,
          quantity_unitaire: ingredient.quantity_unity,
          unity: ingredient.unity,
          cost_ttc: ingredient.cost_ttc,
          date_reception: ingredient.date_reception,
          dlc: ingredient.dlc,
          marge: ingredient.marge,
          vrac: ingredient.vrac
        },
        [path_lst_ings]:{
          taux_tva: ingredient.taux_tva,
          cost: ingredient.cost,
          quantity_unitaire: ingredient.quantity_unity,
          unity: ingredient.unity,
          vrac: ingredient.vrac
        }
      }
      await update(ref_db, ingredient_princ)
  }

  async removeIngInBdd(name_ing: string, prop:string, restaurant:string, is_prep:boolean){
    let ref_db: DatabaseReference;
    if(name_ing !== ""){
      if(is_prep){
        const path = `ingredients_${prop}_${restaurant}/${prop}/${restaurant}/preparation/${name_ing}`;
        ref_db = ref(this.db,  path);
      }
      else{
        const path = `ingredients_${prop}_${restaurant}/${prop}/${restaurant}/${name_ing}`;
        ref_db = ref(this.db, path);
      }
  
      await remove(ref_db).then(() => console.log("ingrédient ", name_ing, "bien supprimée"))

      if(!is_prep){
        ref_db = ref(this.db,  `inventaire_${prop}_${restaurant}/${prop}/${restaurant}/ingredients/${name_ing}`);
        await remove(ref_db).then(() => console.log("ingrédient ", name_ing, "bien supprimée"))
      }
    }
  }

  // ont va chercher les ingrédients directement dans 
  async getFullIngs(prop:string, restaurant:string) {
    let ref_db: DatabaseReference;
    ref_db = ref(this.db, `inventaire_${prop}_${restaurant}/${prop}/${restaurant}/ingredients`)
    await get(ref_db).then((ings) => {
      this.ingredients_minimal = [];
      ings.forEach((ing) => {
        if(ing.key !== null){
          let ingredient:TIngredientBase = {
            name: ing.key,
            cost:ing.child('cost').val(),
            quantity:0,
            quantity_unity: ing.child('quantity_unitaire').val(),
            unity: ing.child('unity').val(),
            vrac: ing.child('vrac').val(),
            taux_tva: ing.child('taux_tva').val(), 
            material_cost: 0,
            marge: 0
          }
          this.ingredients_minimal.push(ingredient);
        }
      })
    })
    return this.ingredients_minimal;
  } 

  getIngredientsBrFromRestaurants(){
    return this.data_ingredient.asObservable();
  }

  getIngredientsPrepFromRestaurants(){
    return this.data_ingredient_prep.asObservable();
  }
}
