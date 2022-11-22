import { Injectable } from '@angular/core';
import { FirebaseApp } from "@angular/fire/app";
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { child, get, getDatabase, ref } from 'firebase/database';



@Injectable({
  providedIn: 'root'
})
export class InteractionRestaurantService {

  private db: any;
  private uid: string;

  constructor(private ofApp: FirebaseApp) { 
      this.uid = "";
      const auth = getAuth(ofApp);
      this.db = getDatabase(ofApp);
      onAuthStateChanged(auth, (user) => {
        if(user){
          console.log("utilisateur inscrit");
          this.uid = user.uid;
        }
        console.log(this.uid);    
      })
  }

  getRestaurants(){
    const ref_db = ref(this.db);
    get(child(ref_db, 'Users/Restaurant'))
  }


}
