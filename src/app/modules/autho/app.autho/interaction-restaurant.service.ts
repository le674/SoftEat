import { Injectable } from '@angular/core';
import { FirebaseApp } from "@angular/fire/app";
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { child, get, getDatabase, ref } from 'firebase/database';
import { Restaurant } from 'src/app/interfaces/restaurant';



@Injectable({
  providedIn: 'root'
})
export class InteractionRestaurantService{
  [x: string]: any;

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
  
 async getRestaurantsProprietaireFromUser(uid:string, prop_to_get:string){
    console.log(prop_to_get);
    console.log(`récupération des donées vers 'Users/${prop_to_get}/${uid}/'`);
    const ref_db = ref(this.db);
    await get(child(ref_db, `Users/foodandboost_prop/${uid}`)).then((user) => {
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


  async getRestaurantFromUser(uid:string, prop_to_get:string){ 
    console.log(`récupération des donées vers 'Users/${prop_to_get}/${uid}/'`);
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
