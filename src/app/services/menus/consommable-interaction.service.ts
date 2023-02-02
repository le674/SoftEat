import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { child, Database, DatabaseReference, get, getDatabase, ref, remove, update } from 'firebase/database';
import { Cconsommable } from 'src/app/interfaces/ingredient';

@Injectable({
  providedIn: 'root'
})
export class ConsommableInteractionService {

  private db: Database;
  private consommable: Array<Cconsommable>;

  constructor(private ofApp: FirebaseApp){
    this.db = getDatabase(ofApp);
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

  async getConsosmmablesFromBaseConso(base_conso: Array<Cconsommable>, prop:string, restaurant:string){
    this.consommable = [];
    let ref_db: DatabaseReference;
    ref_db = ref(this.db)
    for (let index = 0; index < base_conso.length; index++) {
      const conso_name = base_conso[index].nom;
      const conso_quantity = base_conso[index].quantity;
      const path = `consommables_${prop}_${restaurant}/${prop}/${restaurant}/${conso_name}`
      await get(child(ref_db, path)).then((conso_bdd) => {
        if(conso_bdd.key !== null){
          let conso:Cconsommable = new Cconsommable();
          conso.nom = conso_name
          conso.quantity = conso_quantity
          conso.cost = conso_bdd.child("cost").val()
          this.consommable.push(conso);
        }
      })
    }
    return this.consommable;
  }

  async setConsoInBdd(consommable: Cconsommable, prop:string, restaurant:string){
    let ref_db: DatabaseReference;
    const path = `consommables_${prop}_${restaurant}/${prop}/${restaurant}/`;
    ref_db = ref(this.db, path);
    // dans le cas d'ajout d'une non préparation  on modifie l'ingrédient préparé 
    const consommable_db =  {
        [consommable.nom]: {
          taux_tva: consommable.taux_tva,
          cost: consommable.cost,
          quantity: consommable.quantity,
          unity: consommable.unity,
          cost_ttc: consommable.cost_ttc,
          date_reception: consommable.date_reception,
        }
      }
      console.log(consommable_db);
      await update(ref_db, consommable_db)
  }

  async removeConsoInBdd(name_conso: string, prop:string, restaurant:string){
    let ref_db: DatabaseReference;
    if(name_conso !== ""){
        const path = `consommables_${prop}_${restaurant}/${prop}/${restaurant}/${name_conso}`;
        ref_db = ref(this.db, path);
        await remove(ref_db).then(() => console.log("consommable ", name_conso, "bien supprimée"))
    }
  }

}
