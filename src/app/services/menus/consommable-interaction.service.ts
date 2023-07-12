import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { child, connectDatabaseEmulator, Database, DatabaseReference, get, getDatabase, ref, remove, update } from 'firebase/database';
import { FIREBASE_DATABASE_EMULATOR_HOST, FIREBASE_PROD } from '../../../environments/variables';
import { Cconsommable } from 'src/app/interfaces/consommable';
import { Subject } from 'rxjs';
import { DocumentSnapshot, SnapshotOptions, Unsubscribe } from 'firebase/firestore';
import { collection, doc, Firestore, getFirestore, onSnapshot } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ConsommableInteractionService {

  private firestore: Firestore;
  private consommable_converter:any;
  private _consommables: Array<Cconsommable>;
  private consommables = new Subject<Array<Cconsommable>>();
  private sub_consommables!:Unsubscribe;
  constructor(private ofApp: FirebaseApp){
    this.firestore = getFirestore(ofApp);
    this.consommable_converter = {
      toFirestore: (consommable:Cconsommable) => {
        return consommable;
      },
      fromFirestore: (snapshot:DocumentSnapshot<Cconsommable>, options:SnapshotOptions) => {
        const data = snapshot.data(options);
        if(data !== undefined){
          return data as Cconsommable;
        }
        else{
          return null;
        }
      } 
    } 
    this._consommables = [];
  }
  getConsommablesFromRestaurantsBDD(restaurant_id:string, proprietaire_id:string){
    const consommables_ref = collection(doc(
      collection(
        doc(
          collection(
            this.firestore, "proprietaires"
            ), proprietaire_id
          ), "restaurants"
        ), restaurant_id
      ), "ingredients").withConverter(this.consommable_converter);
    this.sub_consommables = onSnapshot(consommables_ref, (consommables) => {
      this._consommables = [];
      consommables.forEach((consommable) => {
          if(consommable.exists()){
            this._consommables.push(consommable.data() as Cconsommable)
          }
      })
      this.consommables.next(this._consommables);
    })
    return this.sub_consommables;
  }
  async getConsommablesFromBaseConso(){
  }
  async setConsoInBdd(consommable: Cconsommable, prop:string, restaurant:string){
  }

  async removeConsoInBdd(name_conso: string, prop:string, restaurant:string){
  }
  getConsommablesFromRestaurants(){
    return this.consommables.asObservable();
  }
}
