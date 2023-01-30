import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Database, getDatabase, ref, update } from 'firebase/database';
import { Cetape } from 'src/app/interfaces/etape';
import { TConsoBase, TIngredientBase } from 'src/app/interfaces/ingredient';

@Injectable({
  providedIn: 'root'
})
export class PreparationInteractionService {
  private db: Database;
  constructor(private ofApp: FirebaseApp) { 
    this.db = getDatabase(ofApp);
  }

  async setNewPreparation(restaurant:string,prop:string, name:string,etapes: Array<Cetape>, ings: Array<TIngredientBase>, conso:Array<TConsoBase>){
    const updates = {}
    const path = `ingredients_${prop}_${restaurant}/${prop}/${restaurant}/preparation/${name}/`
    const ref_db = ref(this.db, path);
    Object.assign(updates, {"consommables": conso});
    Object.assign(updates, {"ingredients": ings});
    Object.assign(updates, {"etapes": etapes});
    await update(ref_db, updates);
  }
}
