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
  private user_auth: object;
  private restaurant: string[];
  private proprietary: string;

  constructor(private ofApp: FirebaseApp) { 
      this.uid = "";
      this.proprietary = "";
      this.user_auth = {};
      this.restaurant = [];
      const auth = getAuth(ofApp);
      this.db = getDatabase(ofApp);
  }

  //préférer utiliser cette requete si on veut récupérer les deux information car elle fait un seil appel au 
  //web service au lieu de deux
  getRestaurantsProprietaireFromUser(uid:string){
    console.log(`récupération des donées vers 'Users/${uid}/'`);
    const ref_db = ref(this.db);
    get(child(ref_db, `Users/${uid}`)).then((user) => {
      if(user.exists()){ 
      user.forEach((user_info) => {
        if(user_info.key == "proprietaire"){
          Object.assign(this.user_auth, {[user_info.key] : user_info.val()})
        }
        if(user_info.key == "restaurant"){
          Object.assign(this.user_auth, {[user_info.key]: user_info.val()})
        }
      })
    }
      else{
        console.log("pas de restaurant obtenu");
        
      }
    }) 
    return this.user_auth;
  }
  
  getProprietaireFromUser(uid:string){ 
    console.log(`récupération des donées vers 'Users/${uid}/'`);
    const ref_db = ref(this.db);
    get(child(ref_db, `Users/${uid}`)).then((user) => {
      if(user.exists()){ 
        user.val().proprietary;
      }
      else{
        console.log("pas de restaurant obtenu");
        
      }
    }) 
  }


  getRestaurantFromUser(uid:string){ 
    console.log(`récupération des donées vers 'Users/${uid}/'`);
    const ref_db = ref(this.db);
    get(child(ref_db, `Users/${uid}`)).then((user) => {
      if(user.exists()){ 
        user.val().restaurant.forEach((restaurant: string) => {
          this.restaurant.push(restaurant);
        })
      }
      else{
        console.log("pas de restaurant obtenu");
        
      }
    }) 
  }

}
