import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { child, connectDatabaseEmulator, Database, get, getDatabase, ref, remove, update } from 'firebase/database';
import {TIngredientBase } from '../../../app/interfaces/ingredient';
import { Cmenu } from '../../../app/interfaces/menu';
import { Cplat } from '../../../app/interfaces/plat';
import { FIREBASE_DATABASE_EMULATOR_HOST, FIREBASE_PROD } from '../../../environments/variables';
import { ConsommableInteractionService } from './consommable-interaction.service';
import { IngredientsInteractionService } from './ingredients-interaction.service';
import { PlatsInteractionService } from './plats-interaction.service';
import { Cconsommable } from 'src/app/interfaces/consommable';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuInteractionService {
  private db: Database;
  private _menus: Array<Cmenu>
  private menus = new Subject<Array<Cmenu>>();

  constructor(private ofApp: FirebaseApp, private ingredient_service: IngredientsInteractionService,
    private conso_service: ConsommableInteractionService, private plat_service: PlatsInteractionService) {
    this.db = getDatabase(ofApp);
    if((location.hostname === "localhost") && (!FIREBASE_PROD)) {
      try {
       // Point to the RTDB emulator running on localhost.
       connectDatabaseEmulator(this.db, FIREBASE_DATABASE_EMULATOR_HOST.host, FIREBASE_DATABASE_EMULATOR_HOST.port); 
      } catch (error) {
        console.log(error);
        
      }
    } 
    this._menus = [];
  }

  async getMenusFromRestaurants(prop: string, restaurant: string, all_ingredients: Array<TIngredientBase>,
    all_consommables: Array<Cconsommable>, all_plats: Array<Cplat>) {
    this._menus = [];
    const ref_db = ref(this.db);
    const path = `menu_${prop}_${restaurant}/${prop}/${restaurant}/`;
    await get(child(ref_db, path)).then((menus) => {
      menus.forEach((menu) => {
        const add_menu = new Cmenu();
        let consommables = menu.child("consommables").val();
        let ingredients = menu.child("ingredients").val();
        let plats = menu.child("plats").val();
        let prix = menu.child("price").val();
        let taux_tva = menu.child("taux_tva").val();
        let prix_ttc = menu.child("price_ttc").val();
        if (menu.key !== null) {
          add_menu.setPrix(prix)
          add_menu.setNom(menu.key.split('_').join(' '));
          add_menu.setIngredients(ingredients);
          add_menu.setConsommbale(consommables);
          add_menu.setPlats(plats);
          add_menu.setTauxTva(taux_tva);
          add_menu.setPrixTtc(prix_ttc);

        }
        this._menus.push(add_menu);
      })
    })
    console.log(`Ont récupère ${this._menus.toString().length/1000} ko de menu`);
    return this._menus
  }

  async setMenu(prop:string,restaurant:string,menu:Cmenu){
    const ref_db = ref(this.db, `menu_${prop}_${restaurant}/${prop}/${restaurant}/`);
    const name = menu.nom;
    console.log(name);
    console.log(menu);
    if((name !== null) && (name!== undefined) && (name !== "")){
      await update(ref_db, {
        [menu.nom.split(' ').join('_')]: {
          price: menu.prix,
          price_ttc:menu.prix_ttc,
          taux_tva:menu.taux_tva,
          ingredients:menu.ingredients.map((ingredient) => { return {name: ingredient.name,
             cost:ingredient.cost,
             taux_tva:ingredient.taux_tva,
             quantity:ingredient.quantity,
             quantity_unity:ingredient.quantity_unity,
             unity:ingredient.unity,
             vrac:ingredient.vrac
          }}),
          consommables:menu.consommables,
          plats:menu.plats,
        }
      })
    }
  }


  async deleteMenu(prop: string, restaurant: string, menu: Cmenu) {
      if((menu.nom !== null) && (menu.nom !== undefined) && (menu.nom !== "")){
        const ref_db = ref(this.db,  `menu_${prop}_${restaurant}/${prop}/${restaurant}/${menu.nom.split(" ").join('_')}`)
        await remove(ref_db).catch((e) => console.log(e));
      }
  }

  getMenuFromRestaurantBDD(prop: string, restaurant: string) {
  
  }

  getMenuFromRestaurant(){
    return this.menus.asObservable();
  }
}
