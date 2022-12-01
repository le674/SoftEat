import { Injectable } from '@angular/core';
import { FirebaseApp } from "@angular/fire/app";
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { child, get, getDatabase, ref } from 'firebase/database';
import { Restaurant } from './restaurant';


@Injectable({
  providedIn: 'root'
})
export class InteractionRestaurantService{

  private db: any;
  private uid: string;
  private user_auth: Restaurant
  private restaurant: Array<object>;
  private proprietary: string;

  constructor(private ofApp: FirebaseApp) { 
      this.uid = "";
      this.proprietary = "";
      this.user_auth = {   
      "proprietaire":"",
      "restaurants":[{
        "adresse": "",
        "id": ""
      }]
    };
      this.restaurant = [];
      const auth = getAuth(ofApp);
      this.db = getDatabase(ofApp);
  }

  //préférer utiliser cette requete si on veut récupérer les deux information car elle fait un seil appel au 
  //web service au lieu de deux
  
 async getRestaurantsProprietaireFromUser(uid:string){
    console.log(`récupération des donées vers 'Users/${uid}/'`);
    const ref_db = ref(this.db);
    await get(child(ref_db, `Users/${uid}`)).then((user) => {
      if(user.exists()){          
        this.user_auth.proprietaire = user.child("proprietaire").val();
        this.user_auth.restaurants = user.child("restaurant").val();
    }
      else{
        console.log("pas de restaurant obtenu");
        
      }
    }).catch((error) => {
      console.log(error);  
    })
    return(this.user_auth);
  }
  
  async getProprietaireFromUser(uid:string){ 
    console.log(`récupération des donées vers 'Users/${uid}/'`);
    const ref_db = ref(this.db);
    await get(child(ref_db, `Users/${uid}`)).then((user) => {
      if(user.exists()){ 
        user.val().proprietary;
      }
      else{
        console.log("pas de restaurant obtenu");
        
      }
    }) 
  }


  async getRestaurantFromUser(uid:string){ 
    console.log(`récupération des donées vers 'Users/${uid}/'`);
    const ref_db = ref(this.db);
    await get(child(ref_db, `Users/${uid}`)).then((user) => {
      if(user.exists()){ 
        user.val().restaurant.forEach((restaurant: object) => {
          this.restaurant.push(restaurant);
        })
      }
      else{
        console.log("pas de restaurant obtenu");
        
      }
    }) 
  }

}
