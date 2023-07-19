import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { child, connectDatabaseEmulator, Database, get, getDatabase, ref, update } from 'firebase/database';
import { Cetape } from '../../../app/interfaces/etape';
import {CIngredient, TIngredientBase } from '../../../app/interfaces/ingredient';
import { AfterPreparation, Cpreparation } from '../../../app/interfaces/preparation';
import { FIREBASE_DATABASE_EMULATOR_HOST, FIREBASE_PROD } from '../../../environments/variables';
import { CalculService } from './menu.calcul/menu.calcul.ingredients/calcul.service';
import { TConsoBase } from 'src/app/interfaces/consommable';
import { RowPreparation } from 'src/app/interfaces/inventaire';
import { collection, deleteDoc, doc, DocumentSnapshot, Firestore, getFirestore, setDoc, SnapshotOptions, updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class PreparationInteractionService {
  private firestore: Firestore;
  private db: Database;
  private preparations: Array<Cpreparation>;
  private preparation_converter:any;
  constructor(private ofApp: FirebaseApp, private calcul_service:CalculService) {
    this.firestore = getFirestore(ofApp);
    this.preparations = [];
    this.db = getDatabase(ofApp);
    if ((location.hostname === "localhost") && (!FIREBASE_PROD)) {
      try {
        // Point to the RTDB emulator running on localhost.
        connectDatabaseEmulator(this.db,FIREBASE_DATABASE_EMULATOR_HOST.host, FIREBASE_DATABASE_EMULATOR_HOST.port); 
      } catch (error) {
        console.log(error);
      }
    }
    this.preparation_converter = {
      toFirestore: (preparation:Cpreparation) => {
        return preparation;
      },
      fromFirestore: (snapshot:DocumentSnapshot<Cpreparation>, options:SnapshotOptions) => {
        const data = snapshot.data(options);
        if(data !== undefined){
          let preparation = new Cpreparation(this.calcul_service);
          preparation.setData(data)
          return preparation;
        }
        else{
          return null;
        }
      } 
    } 
  }

  //on ajoute la préparation pour le stock et pour la fiche technique
  async setNewPreparation(restaurant:string,prop:string, name:string,etapes: Array<Cetape>,
     ings: Array<TIngredientBase>, conso:Array<TConsoBase>,
     after_prepa:AfterPreparation, is_stock:boolean, modification:boolean,
     prime_cost:number, val_bouch:number, tmps_prepa:number){

    let updates = {};
    const ref_db = ref(this.db);
    Object.assign(updates, {[`ingredients_${prop}_${restaurant}/${prop}/${restaurant}/preparation/${name}/consommables`]: conso});
    Object.assign(updates, {[`ingredients_${prop}_${restaurant}/${prop}/${restaurant}/preparation/${name}/base_ing`]: ings});
    Object.assign(updates, {[`ingredients_${prop}_${restaurant}/${prop}/${restaurant}/preparation/${name}/etapes`]:  etapes});
    if(!modification){
      Object.assign(updates, {[`ingredients_${prop}_${restaurant}/${prop}/${restaurant}/preparation/${name}/is_stock`]:is_stock});
    }
    Object.assign(updates, {[`ingredients_${prop}_${restaurant}/${prop}/${restaurant}/preparation/${name}/quantity_after_prep`]:after_prepa.quantity});
    Object.assign(updates, {[`ingredients_${prop}_${restaurant}/${prop}/${restaurant}/preparation/${name}/unity`]:after_prepa.unity});
    Object.assign(updates, {[`ingredients_${prop}_${restaurant}/${prop}/${restaurant}/preparation/${name}/prime_cost`]:prime_cost});
    Object.assign(updates, {[`ingredients_${prop}_${restaurant}/${prop}/${restaurant}/preparation/${name}/val_bouch`]:val_bouch});
    Object.assign(updates, {[`ingredients_${prop}_${restaurant}/${prop}/${restaurant}/preparation/${name}/temps`]:tmps_prepa});


    // même procédure pour la liste des préparations
    Object.assign(updates, {[`inventaire_${prop}_${restaurant}/${prop}/${restaurant}/preparations/${name}/consommables`]: conso});
    Object.assign(updates, {[`inventaire_${prop}_${restaurant}/${prop}/${restaurant}/preparations/${name}/base_ing`]: ings});
    Object.assign(updates, {[`inventaire_${prop}_${restaurant}/${prop}/${restaurant}/preparations/${name}/etapes`]: etapes});
    Object.assign(updates, {[`inventaire_${prop}_${restaurant}/${prop}/${restaurant}/preparations/${name}/quantity_after_prep`]:after_prepa.quantity});
    Object.assign(updates, {[`inventaire_${prop}_${restaurant}/${prop}/${restaurant}/preparations/${name}/unity`]:after_prepa.unity});
    Object.assign(updates, {[`inventaire_${prop}_${restaurant}/${prop}/${restaurant}/preparations/${name}/prime_cost`]:prime_cost});
    Object.assign(updates, {[`inventaire_${prop}_${restaurant}/${prop}/${restaurant}/preparations/${name}/val_bouch`]:val_bouch});
    Object.assign(updates, {[`inventaire_${prop}_${restaurant}/${prop}/${restaurant}/preparations/${name}/temps`]:tmps_prepa});
    console.log(`ont écrits ${updates.toString().length} ko de préparation`);
    
    await update(ref_db, updates);
  }

  async getFullPreparations(prop:string, restaurant:string){
    const path = `inventaire_${prop}_${restaurant}/${prop}/${restaurant}/preparations`;
    const ref_db = ref(this.db)
    
    await get(child(ref_db, path)).then((preparations) => {
      this.preparations = [];
      preparations.forEach((prepa) => {
        if(prepa.key !== null){
          let preparation:Cpreparation = new Cpreparation(this.calcul_service);
          preparation.name = prepa.key;
          preparation.ingredients = prepa.child('base_ing').val();
          preparation.consommables = prepa.child('consommables').val();
          preparation.unity = prepa.child('unity').val();
          this.preparations.push(preparation);
        }
      })
    })
    console.log(`${this.preparations.length/1000} ko de préparations récupérés`);
    return this.preparations;
  }
  /**
   * Suppréssion de la préparation de la base de donnée 
   * @param preparation preparation que l'on supprime de la base de donnée
   * @param prop id de enseigne qui détient la préparation  
   * @param restaurant id du restaurant qui détient la préparation
   */
  async removePrepaInBdd(preparation: RowPreparation, prop: string, restaurant: string) {  
    const preparation_ref = doc(collection(doc(
      collection(
        doc(
          collection(
            this.firestore, "proprietaires"
            ), prop
          ), "restaurants"
        ), restaurant
      ), "preparations"),
      preparation.id).withConverter(this.preparation_converter);
    await deleteDoc(preparation_ref);
  }
  /**
   * 
   * @param preparation preparation à ajoutrer à la base de donnnée
   * @param prop nom de l'ancienne qui détient la préparation 
   * @param restaurant nom du restaurant qui détient la préparation
   * @param base_ings_prepa ingrédients utilisés pour la préparation
   */
  async setPreparationInBdd(preparation: Cpreparation, prop: string, restaurant: string) {
    const preparation_ref =  doc(collection(doc(
      collection(
        doc(
          collection(
            this.firestore, "proprietaires"
            ), prop
          ), "restaurants"
        ), restaurant
      ), "preparations")).withConverter(this.preparation_converter);
      await setDoc(preparation_ref, preparation.getData(preparation_ref.id, prop))
  }
  /**
   * permet de modifier une préparation dans la base de donnée 
   * @param preparation préparation à modifier dans la base de donnée
   * @param prop id de l'ancienne qui possède la préparation
   * @param restaurant id du restaurant qui possède la préparation
   */
  async updatePreparationInBdd(preparation: Cpreparation, prop: string, restaurant: string){
    const ingredients_ref = doc(collection(doc(
      collection(
        doc(
          collection(
            this.firestore, "proprietaires"
            ), prop
          ), "restaurants"
        ), restaurant
      ), "preparations"),
      preparation.id).withConverter(this.preparation_converter);
      await updateDoc(ingredients_ref, preparation.getData(null, prop))
  }

  /**
   * 
   * @param restaurant identifiant du restaurant qui détient la préparation
   * @param prop identifiant de l'enseigne qui détient la préparation
   * @param preparation préparation à ajouter à l'inventaire
   */
  async setPreparation(preparation: Cpreparation, restaurant: string, prop: string) {
    if(preparation !== null){
      const preparation_ref = doc(collection(doc(
        collection(
          doc(
            collection(
              this.firestore, "proprietaires"
              ), prop
            ), "restaurants"
          ), restaurant
        ), "ingredients")).withConverter(this.preparation_converter);
      await setDoc(preparation_ref, preparation.getData(preparation_ref.id, prop));
    }
  }
  updatePreparation(restaurant: string, prop: string, preparation: Cpreparation | null) {
    throw new Error('Method not implemented.');
  }

}


