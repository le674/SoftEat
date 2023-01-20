import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { child, Database, get, getDatabase, onValue, ref,set, update } from 'firebase/database';
import { CAlerte } from 'src/app/interfaces/alerte';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { Unsubscribe } from 'firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class AlertesService {
  private db: Database;
  private alertes: Array<CAlerte>;
  private num_package: number;
  private size_package:number;
  private current_size:number;
  private data_alertes = new Subject<Array<CAlerte>>();
  private get_last_p_alertes!: Unsubscribe;

  constructor(private ofApp: FirebaseApp) {
    this.db = getDatabase(ofApp);
    this.alertes = [];
    this.num_package = 0;
    this.size_package = 0;
    this.current_size = 0;
  }

getLastPAlertesBDD(prop: string, restaurant: string, num_package:number):Unsubscribe {
    const ref_db = ref(this.db);
    const path = `alertes_${prop}_${restaurant}/${prop}/${restaurant}/stock/package_${num_package}`;  
    this.get_last_p_alertes =  onValue(child(ref_db, path), (alertes) => {
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
      this.data_alertes.next(this.alertes);
    })
    return this.get_last_p_alertes;
  }

  async getPPakageNumber(prop: string, restaurant: string){
    const ref_db = ref(this.db);
    const path = `alertes_${prop}_${restaurant}/${prop}/${restaurant}/stock/nombre_package`;  
    await get(child(ref_db, path)).then((number) => {
      this.num_package = number.val();
    })
    return this.num_package;
  }


  async getPPakageSize(prop: string, restaurant: string){
    const ref_db = ref(this.db);
    const path = `alertes_${prop}_${restaurant}/${prop}/${restaurant}/stock/package_size`;  
    await get(child(ref_db, path)).then((number) => {
      this.size_package = number.val();
    })
    return this.size_package;
  }

  async getCurrentSize(prop: string, restaurant: string){
    const ref_db = ref(this.db);
    const path = `alertes_${prop}_${restaurant}/${prop}/${restaurant}/stock/current_size`;  
    await get(child(ref_db, path)).then((number) => {
      this.size_package = number.val();
    })
    return this.size_package;
  }

  getLastPAlertes() {
    return this.data_alertes.asObservable();
  }

  async setStockAlertes(message: string, restaurant:string, prop:string, from:string, to:string) {
    this.getPPakageNumber(prop, restaurant).then((num_package) => {
        this.getPPakageSize(prop, restaurant).then((size_package) => {
            this.getCurrentSize(prop, restaurant).then((curr_size) => {
              if(curr_size < size_package){
                this.setInPackageAlertes(message, restaurant, prop, num_package, curr_size, from, to, false)
              }
              else{
                this.setInPackageAlertes(message, restaurant, prop, num_package, curr_size, from, to, true)
              }
            })
        })
    })
  }

  async setInPackageAlertes(message:string, restaurant:string, prop:string,
     num_package:number, curr_size:number, from:string, to:string, new_pack:boolean){
    let  name_alerte = ''
    let str_num_package = ''
    const ref_db = ref(this.db, `alertes_${prop}_${restaurant}/${prop}/${restaurant}/stock/`);
    let local_date = new Date().toLocaleString();
    // important il faut ajouter from et to 
    if(!new_pack){
      
      str_num_package = num_package.toString();
      name_alerte = `package_${str_num_package}/alertes_${curr_size + 1}`;
      await update(ref_db,{
        [name_alerte]: {
          date: local_date,
          label: message,
          from:from,
          to:to,
          read: false
        },
        "current_size": curr_size + 1
      })
    }
    else{
      str_num_package = (num_package + 1).toString();
      name_alerte = `package_${str_num_package}/alertes_1`;
      await update(ref_db,{
        [name_alerte]: {
          date: local_date,
          label: message,
          from:from,
          to:to,
          read: false
        },
        "current_size": 1,
        "nombre_package": num_package + 1
      })
    }

  }
  async setResponseAlertes(message: string, id_alerte: string, from: string, to: string) {

  }

  
}
