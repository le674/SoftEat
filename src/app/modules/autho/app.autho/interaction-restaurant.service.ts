import { Injectable } from '@angular/core';
import { FirebaseApp } from "@angular/fire/app";
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { child, get, getDatabase, ref } from 'firebase/database';
import { Restaurant, UserRestaurant } from 'src/app/interfaces/restaurant';



@Injectable({
  providedIn: 'root'
})
export class InteractionRestaurantService{
  [x: string]: any;

  private db: any;
  private uid: string;
  private user_auth: UserRestaurant
  private restaurant: Array<Restaurant>;
  private proprietary: string;

  constructor(private ofApp: FirebaseApp) { 
      this.uid = "";
      this.proprietary = "";
      this.user_auth = {   
      "proprietaire":"",
      "restaurants":[new Restaurant()]
    };
      this.restaurant = [];
      const auth = getAuth(ofApp);
      this.db = getDatabase(ofApp);
  }

  //préférer utiliser cette requete si on veut récupérer les deux information car elle fait un seil appel au 
  //web service au lieu de deux
  
 async getRestaurantsProprietaireFromUser(uid:string, prop_to_get:string){
    const ref_db = ref(this.db);
    await get(child(ref_db, `Users/foodandboost_prop/${uid}`)).then((user) => {
      this.restaurant = []
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
    const ref_db = ref(this.db);
    console.log(`Users/${prop_to_get}/${uid}/restaurant/`);
    await get(child(ref_db, `Users/${prop_to_get}/${uid}/restaurant/`)).then((user_restaurant) => {
      this.restaurant = []
      if(user_restaurant.exists()){ 
        if(user_restaurant.child('id').exists()){
          console.log('il n y a qu un restaurant');
          let restau = new Restaurant()
          restau.id = user_restaurant.val().id
          restau.adresse = user_restaurant.val().adresse
          console.log(`le restaurant de ${uid} est ${restau.id}`);
          this.restaurant.push(restau)
        }
        else{
          user_restaurant.forEach((restaurant) => {
            let restau = new Restaurant()
            restau.id = restaurant.val().id
            restau.adresse = restaurant.val().adresse
            console.log(`le restaurant de ${uid} est ${restau.id}`);
            this.restaurant.push(restau)
          })
        }
      }
    })
    return(this.restaurant) 
  }


async getAllRestaurants(prop:string){
  const ref_db = ref(this.db);
  await get(child(ref_db, `restaurants/${prop}/`)).then((restaurants) => {
    this.restaurant = []
    if(restaurants.exists()){
      restaurants.forEach((restaurant) => {
        let new_restaurant = new Restaurant();
        new_restaurant.id = (restaurant.key === null) ? "" : restaurant.key
        new_restaurant.adresse =  restaurant.val().adress
        this.restaurant.push(new_restaurant)
        
      })
    }
    else{
      console.log("pas de restaurants actuellement");
    }
  })
  return(this.restaurant)  
}

}
