import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Restaurant, UserRestaurant } from 'src/app/interfaces/restaurant';
import { addDoc, collection, doc, DocumentSnapshot, Firestore, onSnapshot, query, SnapshotOptions, Unsubscribe, where } from '@angular/fire/firestore';
import { CommonService } from '../common/common.service';
import { Subject } from 'rxjs/internal/Subject';
import { User } from 'src/app/interfaces/user';
import { Address } from 'src/app/interfaces/address';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private db: Firestore;
  private proprietary_converter:any;
  private restaurants_converter:any;
  private sub_restaurants!:Unsubscribe;
  private sub_all_restaurants!:Unsubscribe;
  private users = new Subject<UserRestaurant>();
  private restaurants = new Subject<Array<Restaurant>>();
  private _restaurants: Array<Restaurant>;
  constructor(private ofApp: FirebaseApp, private firestore:Firestore ,private common:CommonService) { 
    this._restaurants = [];
    // Firestore data converter
    this.proprietary_converter = {
         toFirestore: (user:UserRestaurant) => {
              return {
                  prop: user.proprietaire,
                  restaurants: user.restaurants
              };
         },
         fromFirestore: (snapshot:DocumentSnapshot<{
          proprietaire:string,
          restaurants:Array<string>
         }>, options:SnapshotOptions) => {
              const data = snapshot.data(options);
              if(data !== undefined){
                return new UserRestaurant(data.proprietaire, data.restaurants);
              }
              else{
                return null;
              }
          }
    };
    this.restaurants_converter = {
      toFirestore: (restaurant:Restaurant) => {
        return restaurant;
      },
      fromFirestore: (snapshot:DocumentSnapshot<Restaurant>, options:SnapshotOptions) => {
        const data = snapshot.data(options);
        if(data !== undefined){
          console.log("here we log data : ");
          console.log(data);
          
          let restaurant = new Restaurant(null);
          restaurant.setRestaurant(data);
          console.log("restaurant log data : ");
          
          console.log(restaurant);
          
          return restaurant;
        }
        else{
          return null;
        }
       }
    }
    this.db = common.initializeBdd(ofApp, firestore);
  }
/**
 * @description permet de récupérer tout les restaurants depuis la base de donnée pour une enseigne
 * @param restaurants_ids identifiants des restaurants 
 * @returns {Unsubscribe}
 */
getAllRestaurantsBDD(user:User){
  if(user.related_restaurants !== null){
    const prop = user.related_restaurants[0].proprietaire_id;
    const restaurants = user.related_restaurants.filter((prop_rest) => prop_rest.proprietaire_id === prop)
                                                .map((prop_rest) => prop_rest.restaurant_id);  
    console.log("proprietaires" + prop + "restaurants", restaurants);
 
    let docRef = query(collection(doc(collection(this.db, "proprietaires"), prop), "restaurants"), where('id', 'in', restaurants))
                 .withConverter(this.restaurants_converter);
    this.sub_all_restaurants = onSnapshot(docRef, (restaurants) => {
      restaurants.forEach((restaurant) => {
        if(restaurant.exists()){
          this._restaurants.push(restaurant.data() as Restaurant);
          this.restaurants.next(this._restaurants);
        }
      })
    })
    this.common.incCounter();
  }
  return this.sub_all_restaurants;
  }
/**
  * @description récupération de l'observable qui contient les donnés écoutés sur le noeud proprietaire/restaurants
  * @returns {Observable}
*/
getAllRestaurants(){
  return this.restaurants.asObservable();
}
/**
 * @param prop identifiant de l'enseigne du restaurant 
 * @description ajout d'un restaurant à la base de donnée
 * @returns {void}
*/
async setRestaurant(prop:string,restaurant:Restaurant){
  let doc_rest = collection(this.db, prop, 'restaurants').withConverter(this.restaurants_converter);
  await addDoc(doc_rest, restaurant);
 }
}