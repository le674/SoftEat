import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { child, Database, DatabaseReference, get, getDatabase, ref, update } from 'firebase/database';
import { Cetape } from 'src/app/interfaces/etape';
import { TConsoBase, TIngredientBase } from 'src/app/interfaces/ingredient';
import { AfterPreparation, Cpreparation } from 'src/app/interfaces/preparation';
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
  }

  //on ajoute la préparation pour le stock et pour la fiche technique
  async setNewPreparation(restaurant:string,prop:string, name:string,etapes: Array<Cetape>,
     ings: Array<TIngredientBase>, conso:Array<TConsoBase>, after_prepa:AfterPreparation, is_stock:boolean){

    let updates = {};
    const ref_db = ref(this.db);
    Object.assign(updates, {[`ingredients_${prop}_${restaurant}/${prop}/${restaurant}/preparation/${name}/consommables`]: conso});
    Object.assign(updates, {[`ingredients_${prop}_${restaurant}/${prop}/${restaurant}/preparation/${name}/base_ing`]: ings});
    Object.assign(updates, {[`ingredients_${prop}_${restaurant}/${prop}/${restaurant}/preparation/${name}/etapes`]:  etapes});
    Object.assign(updates, {[`ingredients_${prop}_${restaurant}/${prop}/${restaurant}/preparation/${name}/is_stock`]:is_stock});
    Object.assign(updates, {[`ingredients_${prop}_${restaurant}/${prop}/${restaurant}/preparation/${name}/quantity_after_prep`]:after_prepa.quantity});
    Object.assign(updates, {[`ingredients_${prop}_${restaurant}/${prop}/${restaurant}/preparation/${name}/unity`]:after_prepa.unity});

    // même procédure pour la liste des préparations
    Object.assign(updates, {[`inventaire_${prop}_${restaurant}/${prop}/${restaurant}/preparations/${name}/consommables`]: conso});
    Object.assign(updates, {[`inventaire_${prop}_${restaurant}/${prop}/${restaurant}/preparations/${name}/base_ing`]: ings});
    Object.assign(updates, {[`inventaire_${prop}_${restaurant}/${prop}/${restaurant}/preparations/${name}/etapes`]: etapes});
    Object.assign(updates, {[`inventaire_${prop}_${restaurant}/${prop}/${restaurant}/preparations/${name}/quantity_after_prep`]:after_prepa.quantity});
    Object.assign(updates, {[`inventaire_${prop}_${restaurant}/${prop}/${restaurant}/preparations/${name}/unity`]:after_prepa.unity});
  
    await update(ref_db, updates);
  }

  async getFullPreparations(restaurant:string,prop:string){
    let ref_db: DatabaseReference;
    const path = `inventaire_${prop}_${restaurant}/${prop}/${restaurant}/preparations`;
    ref_db = ref(this.db)
    
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
          this.preparations.push(preparation);
        }
      })
    })
    return this.preparations;
  }
}