import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { FirebaseApp } from "@angular/fire/app";
import { Proprietaire } from '../interfaces/proprietaire';
import { FIREBASE_DATABASE_EMULATOR_HOST, FIREBASE_PROD } from '../../environments/variables';
import { Firestore, DocumentSnapshot, SnapshotOptions, Unsubscribe, addDoc, collection, connectFirestoreEmulator, onSnapshot, query, where } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { CommonService } from './common/common.service';
import { Employee } from '../interfaces/employee';

@Injectable({
  providedIn: 'root'
})
export class UserInteractionService {
  private uid: string;
  private proprietary: string;
  private prop_list: Proprietaire;
  private user = new Subject<User>();
  private employees = new Subject<Employee>();
  private count;
  public is_prop;
  private user_converter:any;
  private employee_converter:any;
  private sub_user!:Unsubscribe;
  private sub_employee!:Unsubscribe;

  constructor(private ofApp: FirebaseApp, private firestore:Firestore ,private common_service:CommonService) {
    this.prop_list = {
      proprietaire: "",
      employee: []
    }
    this.user_converter = {
      toFirestore: (user:User) => { 
           return user
      },
      fromFirestore: (snapshot:DocumentSnapshot<{user:User}>, options:SnapshotOptions) => {
           const data = snapshot.data(options);
           if(data !== undefined){
             return data;
           }
           else{
             return null;
           }
       }
    };
    this.employee_converter = {
      toFirestore: (employee:Employee) => {
        return employee;
      },
      fromFirestore: (snapshot:DocumentSnapshot<{user:User}>, options:SnapshotOptions) => {
        const data = snapshot.data(options);
        if(data !== undefined){
          return data;
        }
        else{
          return null;
        }
      }
    }
    if ((location.hostname === "localhost") && (!FIREBASE_PROD)) {
      try {
        // Point to the RTDB emulator running on localhost.
        connectFirestoreEmulator(firestore, FIREBASE_DATABASE_EMULATOR_HOST.host, FIREBASE_DATABASE_EMULATOR_HOST.port);
      } catch (error) {
        console.log(error);

      }
    }
    this.firestore = common_service.initializeBdd(ofApp, firestore);
    this.count = 0;
    this.proprietary = "";
    this.uid = "";
    this.is_prop = false;

  }
/**
 * @description attache un écouteur au noeud clients/uid/ récupération de l'utilisateur associé à l'uid
 * @param uid identifiant unique de la personne dont nous souhaitons récupérer les informations
 * @returns {Unsubscribe} une fonction qui permet de se désabonner de l'écouteur attaché au noeud clients/uid/
*/
getUserFromUidBDD(uid: string) {
  let client_ref =  query(collection(this.firestore, "clients"), where("uid", "==", uid)).withConverter(this.user_converter);
  this.sub_user = onSnapshot(client_ref, (users) => {
    users.forEach((user) => {
      if(user.exists()){
        this.user.next(user.data() as User);
      }
    })
    const source = users.metadata.fromCache ? "cache local" : "serveur";
    this.common_service.incCounter();
    console.log(`les données proviennent du ${source}`);
  })
  return this.sub_user;
  }
 /**
   * @description attache un écouteur dans le noeud employees afin de récupérer les infos sur l'utilisateur 
   * @param uid  identifiant unique de la personne dont nous souhaitons récupérer les informations
   * @param restaurant identifiant du restaurant pour lequel nous voulons récupérer les informations
   * @param prop identifiant du proprietaire pour lequel ont souhaitent récupérer les informations
   * @returns {Unsubscribe} une fonction qui permet de se désabonner de l'écouteur attaché au noeud proprietaires/<id_prop>/restaurants/<id_restau>/employees/<id_employee>
 */
 getEmployeeBDD(user:User){
  if(user.related_restaurants !== null){
     const uid = user.uid;
     const prop = user.related_restaurants[0].proprietaire_id;
     const restaurant = user.related_restaurants[0].restaurant_id;
     let employee_ref = query(collection(this.firestore, "proprietaire", prop, "restaurants", restaurant, "employees"), where("uid", "==", uid))
                     .withConverter(this.employee_converter);
     this.sub_employee = onSnapshot(employee_ref, (employees) => {
      employees.forEach((employee) => {
        if(employee.exists()){
          this.employees.next(employee.data() as Employee);
        }
      })
      this.common_service.incCounter();
    }) 
  }
  return this.sub_employee;
 }
  /**
   * @description permet de modifier un utilisateur dans la base de donnée
   * @returns {void}
   */
  async setUserBDD(user:User){
    const user_ref = collection(this.firestore, "clients").withConverter(this.user_converter);
    await addDoc(user_ref, user)
  }
  /**
   * @description récupération de l'observable qui contient les donnés écoutés sur le noeud clients/uid/
   * @returns {Observable}
   */
   getUserFromUid(){
      return this.user.asObservable();
   }
   /**
    * @description permet de récupérer un employé depuis la base de donnée dans prop/restaurant/employees
    * @returns {void}
    */
   getEmployee(){
    return this.employees.asObservable();
   }
  /* async setUser(prop: string, user: User) {  
    let data_to_add = {};
    const ref_db = ref(this.db);
    const path_prop = `users/${prop}/${user.id}`
    const path_dico = `users/${user.id}`
    let restaurants: Array<{id:string, adresse:string}> = [];
    restaurants = user.restaurants.filter((restaurant) => (restaurant !== null) && (restaurant !== undefined))
      .map((restaurant) => {
        return {id:restaurant.id, adresse: restaurant.adresse};
      });
    Object.assign(data_to_add, {
      [path_dico]: {
        email: user.email,
        proprietaire:prop
      },
      [path_prop]: {
        email: user.email,
        statut: user.statut,
        restaurant: restaurants
      }
    })
    for (let restaurant of restaurants.map((restaurant) => restaurant.id)) {
      Object.assign(data_to_add, {
        [`resto_auth/${prop}/${restaurant}/${user.id}`]: user.email
      })
    }
    await update(ref_db, data_to_add)
  }
  async updateEmail(prop: string, restaurant: string, user_uid: string, email: string) {
    const ref_db = ref(this.db);
    await update(ref_db, {
      [`users/${prop}/${user_uid}/email/`]: email,
      [`users/${user_uid}/email/`]: email,
      [`user_${prop}/${prop}/${restaurant}/${user_uid}/email/`]: email
    })
  }
  async updateNumber(prop: string, restaurant: string, user_uid: string, new_number: string) {
    const ref_db = ref(this.db, `user_${prop}/${prop}/${restaurant}/${user_uid}/number/`);
    await set(ref_db, new_number)
  } */
}
