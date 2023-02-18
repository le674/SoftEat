import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { child, Database, DatabaseReference, get, getDatabase, ref, update } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private db: Database;
  private salary:number
  constructor(private ofApp: FirebaseApp) { 
    this.salary = 0;
    this.db = getDatabase(ofApp);
    if (location.hostname === "localhost") {
      // Point to the RTDB emulator running on localhost.
      connectDatabaseEmulator(this.db, "localhost", 9000);
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
function connectDatabaseEmulator(db: Database, arg1: string, arg2: number) {
  throw new Error('Function not implemented.');
}

