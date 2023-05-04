import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { child, connectDatabaseEmulator, Database, DatabaseReference, get, getDatabase, ref, remove, update } from 'firebase/database';
import { Cconsommable, TConsoBase } from '../../../app/interfaces/ingredient';
import { FIREBASE_DATABASE_EMULATOR_HOST, FIREBASE_PROD } from '../../../environments/variables';

@Injectable({
  providedIn: 'root'
})
export class ConsommableInteractionService {

  private db: Database;
  private consommable: Array<Cconsommable>;
  constructor(private ofApp: FirebaseApp){
    this.db = getDatabase(ofApp);
    if((location.hostname === "localhost") && (!FIREBASE_PROD) ) {
      try {
        connectDatabaseEmulator(this.db, FIREBASE_DATABASE_EMULATOR_HOST.host, FIREBASE_DATABASE_EMULATOR_HOST.port);
      } catch (error) {
        console.log(error);
        
      }
    } 
    this.consommable = [];
  }

  async getConsommablesFromRestaurants(prop: string, restaurant: string) {
    const ref_db = ref(this.db);
    this.consommable = [];
    const path = `consommables_${prop}_${restaurant}/${prop}/${restaurant}/`;
    await get(child(ref_db, path)).then((consommable) => {
      consommable.forEach((conso) => {
        if ((conso.key !== "preparation") && (conso.key !== "resto_auth")) {
          const add_consommable = new Cconsommable();
          add_consommable.setNom(conso.key);
          add_consommable.setTauxTva(conso.child("taux_tva").val());
          add_consommable.setCost(conso.child("cost").val());
          add_consommable.setQuantity(conso.child("quantity").val());
          add_consommable.setUnity(conso.child("unity").val());
          add_consommable.setCostTTC(conso.child("cost_ttc").val());
          add_consommable.setDateReception(conso.child("date_reception").val());
          add_consommable.setMarge(conso.child("marge").val());
          this.consommable.push(add_consommable);
        }
      })
    })
    return this.consommable
  }

  async getConsommablesFromRestaurantsFiltreIds(prop: string, restaurant: string) {
    const ref_db = ref(this.db);
    this.consommable = [];
    const path = `consommables_${prop}_${restaurant}/${prop}/${restaurant}/`;
    await get(child(ref_db, path)).then((consommable) => {
      consommable.forEach((conso) => {
        if ((conso.key !== "preparation")) {
          if((conso.key !== null)){
            const add_consommable = new Cconsommable();
            add_consommable.setNom(conso.key);
            add_consommable.setTauxTva(conso.child("taux_tva").val());
            add_consommable.setCost(conso.child("cost").val());
            add_consommable.setQuantity(conso.child("quantity").val());
            add_consommable.setUnity(conso.child("unity").val());
            add_consommable.setCostTTC(conso.child("cost_ttc").val());
            add_consommable.setDateReception(conso.child("date_reception").val());
            add_consommable.setMarge(conso.child("marge").val());
            this.consommable.push(add_consommable);
          }
        }
      })
    })
    return this.consommable
  }

  async getConsosmmablesFromBaseConso(base_conso: Array<TConsoBase>, prop:string, restaurant:string){
    this.consommable = [];
    let ref_db: DatabaseReference;
    ref_db = ref(this.db)
    for (let index = 0; index < base_conso.length; index++) {

      const conso_name = base_conso[index].name.split(' ').join('_');
      const conso_quantity = base_conso[index].quantity;
      const path = `consommables_${prop}_${restaurant}/${prop}/${restaurant}/${conso_name}`
      await get(child(ref_db, path)).then((conso_bdd) => {
        if((conso_bdd.child("cost").val() !== null)){
          let conso:Cconsommable = new Cconsommable();
          conso.name = conso_name.split('_').join(' ');
          conso.quantity = conso_quantity;
          conso.cost = conso_bdd.child("cost").val();
          conso.unity = conso_bdd.child("unity").val();
          this.consommable.push(conso);
        }
      })
    }
    return this.consommable;
  }

  async setConsoInBdd(consommable: Cconsommable, prop:string, restaurant:string){
    let ref_db: DatabaseReference;
    console.log(consommable);
    
    const path_conso = `consommables_${prop}_${restaurant}/${prop}/${restaurant}/${consommable.name}`;
    const path_lst_conso = `inventaire_${prop}_${restaurant}/${prop}/${restaurant}/consommables/${consommable.name}`;
    ref_db = ref(this.db);
    // dans le cas d'ajout d'une non préparation  on modifie l'ingrédient préparé 
    const consommable_db =  {
        [path_conso]: {
          taux_tva: consommable.taux_tva,
          cost: consommable.cost,
          quantity: consommable.quantity,
          unity: consommable.unity,
          cost_ttc: consommable.cost_ttc,
          date_reception: consommable.date_reception,
          quantity_added: consommable.total_quantity
        },
        [path_lst_conso]:{
          taux_tva: consommable.taux_tva,
          cost: consommable.cost,
          unity: consommable.unity
        }
      }
      await update(ref_db, consommable_db)
  }

  async removeConsoInBdd(name_conso: string, prop:string, restaurant:string){
    let ref_db: DatabaseReference;
    if(name_conso !== ""){
        const path = `consommables_${prop}_${restaurant}/${prop}/${restaurant}/${name_conso}`;
        const path_lst_conso = `inventaire_${prop}_${restaurant}/${prop}/${restaurant}/consommables/${name_conso}`;
        ref_db = ref(this.db, path);
        await remove(ref_db).then(() => console.log("consommable ", name_conso, "bien supprimée"))
        ref_db = ref(this.db, path_lst_conso);
        await remove(ref_db).then(() => console.log("consommable ", name_conso, "bien supprimée"))
    }
  }

  async getFullConso(prop:string, restaurant:string){
    let ref_db: DatabaseReference;
    ref_db = ref(this.db, `inventaire_${prop}_${restaurant}/${prop}/${restaurant}/consommables`)
    await get(ref_db).then((ings) => {
      this.consommable = [];
      ings.forEach((ing) => {
        if(ing.key !== null){
          let consommable:Cconsommable = new Cconsommable();
          consommable.name = ing.key;
          consommable.cost = ing.child('cost').val();
          consommable.unity = ing.child('unity').val();
          consommable.taux_tva =  ing.child('taux_tva').val();
          consommable.date_reception =  new Date();
          this.consommable.push(consommable);
        }
      })
    })
    return this.consommable;
  }

}
