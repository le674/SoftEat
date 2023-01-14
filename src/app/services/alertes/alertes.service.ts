import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { child, Database, get, getDatabase, onValue, ref } from 'firebase/database';
import { CAlerte } from 'src/app/interfaces/alerte';
import { Subject, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AlertesService {
  private db: Database;
  private alertes: Array<CAlerte>;
  private num_package: number;
  private dataSubject = new Subject<Array<CAlerte>>();


  constructor(private ofApp: FirebaseApp) {
    this.db = getDatabase(ofApp);
    this.alertes = [];
    this.num_package = 0;
  }

getLastPAlertesBDD(prop: string, restaurant: string, num_package:number):void {
    const ref_db = ref(this.db);
    let first = true;
    const path = `Alertes/${prop}/${restaurant}/stock/package_${num_package}`;
    console.log(path);
    
    onValue(child(ref_db, path), (alertes) => {
      // on rend vide la liste des alertes car on fait deux appel à getLastPAlertes (le premier dans dashboard )
      // le second dans app.alertes.ts comme this.alertes garde en cache les données il vaut mieux 
      // remettre la liste à vide sinon on doubles les alertes
      this.alertes = [];
      alertes.forEach((alerte) => {
        const new_alerte = new CAlerte();
        new_alerte.label = alerte.child("label").val();
        new_alerte.from = alerte.child("from").val();
        new_alerte.read = alerte.child("read").val();
        new_alerte.to = alerte.child("to").val();
        new_alerte.response = alerte.child("response").val();
        new_alerte.date = alerte.child("date").val();
        this.alertes.push(new_alerte);
      })
      this.dataSubject.next(this.alertes);
    })
  }

  async getPPakageNumber(prop: string, restaurant: string){
    const ref_db = ref(this.db);
    await get(child(ref_db, `Alertes/${prop}/${restaurant}/stock/nombre_package`)).then((number) => {
      this.num_package = number.val();
    })
    return this.num_package;
  }

  async setStockAlertes(message: string) {

  }

  async setResponseAlertes(message: string, id_alerte: string, from: string, to: string) {

  }

  getLastPAlertes() {
    return this.dataSubject.asObservable();
  }
  
}
