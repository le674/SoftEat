import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { child, connectDatabaseEmulator, Database, DatabaseReference, get, getDatabase, ref, update } from 'firebase/database';
import { FIREBASE_DATABASE_EMULATOR_HOST, FIREBASE_PROD } from 'src/environments/variables';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private db: Database;
  private salary:number
  constructor(private ofApp: FirebaseApp) { 
    this.salary = 0;
    this.db = getDatabase(ofApp);
    if ((location.hostname === "localhost") && (!FIREBASE_PROD)) {
      connectDatabaseEmulator(this.db, FIREBASE_DATABASE_EMULATOR_HOST.host, FIREBASE_DATABASE_EMULATOR_HOST.port);
    } 
  }

  async getSalaryCuisiniee(prop:string, restaurant:string){
    let ref_db: DatabaseReference;
    const path = `restaurants/${prop}/${restaurant}/cuisiniee/salary`;
    ref_db = ref(this.db, path);
    await get(child(ref_db, path)).then((salary) => {
      this.salary = salary.val()
    })
    return this.salary;
  }

  async setCuisinieSalary(prop:string,restaurant:string, salary:number){
    let ref_db: DatabaseReference;
    const path = `restaurants/${prop}/${restaurant}/`;
    ref_db = ref(this.db, path);
    await update(ref_db, {
      "cuisiniee": {
        "salary":salary
      }
    });
  }
}


