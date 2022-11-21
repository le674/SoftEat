import { Injectable } from '@angular/core';
import { FirebaseApp } from "@angular/fire/app";
import { getAuth, User } from 'firebase/auth';
import { child, get, getDatabase, ref } from 'firebase/database';



@Injectable({
  providedIn: 'root'
})
export class InteractionRestaurantService {

  private db: any;
  private uid: User;

  constructor(private ofApp: FirebaseApp) { 
      const auth = getAuth(ofApp);
      this.db = getDatabase(ofApp);
      if(auth.currentUser !== null ){
        this.uid = auth.currentUser;
      } else {

      }
  }

  getRestaurants(){
    const ref_db = ref(this.db);
    get(child(ref_db, 'Users/Restaurant'))
  }


}
