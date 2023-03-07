import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { child, connectDatabaseEmulator, Database, DatabaseReference, get, getDatabase, ref, update } from 'firebase/database';
import { Cetape } from 'src/app/interfaces/etape';
import { TConsoBase, TIngredientBase } from 'src/app/interfaces/ingredient';
import { AfterPreparation, Cpreparation } from 'src/app/interfaces/preparation';
import { FIREBASE_DATABASE_EMULATOR_HOST, FIREBASE_PROD } from 'src/environments/variables';
import { CalculService } from './menu.calcul/menu.calcul.ingredients/calcul.service';

@Injectable({
  providedIn: 'root'
})
export class PreparationInteractionService {
  private db: Database;
  private preparations: Array<Cpreparation>;
  constructor(private ofApp: FirebaseApp, private calcul_service:CalculService) {
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
          preparation.nom = prepa.key;
          preparation.base_ing = prepa.child('base_ing').val();
          preparation.consommables = prepa.child('consommables').val();
          preparation.etapes =  prepa.child('etapes').val();
          preparation.quantity_after_prep =  prepa.child('quantity_after_prep').val();
          preparation.unity = prepa.child('unity').val();
          preparation.unity_unitary = prepa.child('unity_unitary').val();
          this.preparations.push(preparation);
        }
      })
    })
    return this.preparations;
  }
}


