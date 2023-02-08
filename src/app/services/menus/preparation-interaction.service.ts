import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Database, getDatabase, ref, set, update } from 'firebase/database';
import { Cetape } from 'src/app/interfaces/etape';
import { TConsoBase, TIngredientBase } from 'src/app/interfaces/ingredient';
import { AfterPreparation } from 'src/app/interfaces/preparation';

@Injectable({
  providedIn: 'root'
})
export class PreparationInteractionService {
  private db: Database;
  constructor(private ofApp: FirebaseApp) { 
    this.db = getDatabase(ofApp);
  }

  async setNewPreparation(restaurant:string,prop:string, name:string,etapes: Array<Cetape>,
     ings: Array<TIngredientBase>, conso:Array<TConsoBase>, after_prepa:AfterPreparation, is_stock:boolean){

    let updates = {};
    const path = `ingredients_${prop}_${restaurant}/${prop}/${restaurant}/preparation/${name}/`;
    const ref_db = ref(this.db, path);
    Object.assign(updates, {"consommables": null});
    Object.assign(updates, {"base_ing": null});
    Object.assign(updates, {"etapes": null});
    Object.assign(updates, {"is_stock":is_stock});
    Object.assign(updates, {"quantity_after_prep":after_prepa.quantity});
    Object.assign(updates, {"unity":after_prepa.unity});
    await update(ref_db, updates);
    updates = {};
    Object.assign(updates, {"consommables": conso});
    Object.assign(updates, {"base_ing": ings});
    Object.assign(updates, {"etapes": etapes});
    await update(ref_db, updates);
  }
}
