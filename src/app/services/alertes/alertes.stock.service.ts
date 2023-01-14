import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { child, Database, get, getDatabase, ref } from 'firebase/database';
import { CAlerte } from 'src/app/interfaces/alerte';

@Injectable({
  providedIn: 'root'
})
export class AlertesStockService {
  private db: Database;
  private alertes: Array<CAlerte>;

  constructor(private ofApp: FirebaseApp){
    this.db = getDatabase(ofApp);
    this.alertes = [];
  }

  async getLastPAlertes(prop: string, restaurant: string){
    const ref_db = ref(this.db);
    await get(child(ref_db, `Alertes/${prop}/${restaurant}/stock/nombre_package`)).then((number) => {
      const path =  `Alertes/${prop}/${restaurant}/stock/package_${number.val()}`
      return path
    }).then(async (path) => {
      await get(child(ref_db, path)).then((alertes) => {  
        alertes.forEach((alerte) => {
          const new_alerte = new CAlerte();
          new_alerte.label = alerte.child("label").val();
          new_alerte.from = alerte.child("from").val();
          new_alerte.read = alerte.child("read").val();
          new_alerte.to = alerte.child("to").val();
          new_alerte.response = alerte.child("response").val(); 
          this.alertes.push(new_alerte);
          console.log(this.alertes);  
        })

      })
    })
  
    console.log(this.alertes);
    
    return this.alertes;
  }

  async setStockAlertes(message:string){

  }

  async setResponseAlertes(message:string, id_alerte:string, from:string, to:string){

  }

}
