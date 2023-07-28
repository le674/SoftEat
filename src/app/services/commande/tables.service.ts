import { Injectable } from '@angular/core';
import { FirebaseApp } from "@angular/fire/app";
import { Unsubscribe } from 'firebase/auth';
import { child, connectDatabaseEmulator, Database, DatabaseReference, get, getDatabase, onValue, ref, remove, update } from 'firebase/database';
import { collection, connectFirestoreEmulator, Firestore, getDocs, getFirestore } from "firebase/firestore";
import { Subject } from 'rxjs';
import { CIngredient, TIngredientBase } from '../../../app/interfaces/ingredient';
import { Cpreparation } from '../../../app/interfaces/preparation';
import { FIREBASE_DATABASE_EMULATOR_HOST, FIREBASE_FIRESTORE_EMULATOR_HOST, FIREBASE_PROD } from '../../../environments/variables';

@Injectable({
  providedIn: 'root'
})

export class TablesService {

  private db: Database;
  private firestore: Firestore;

  constructor(private ofApp: FirebaseApp) {
    this.db = getDatabase(ofApp);
    this.firestore = getFirestore(ofApp);
    if ((location.hostname === "localhost") && (!FIREBASE_PROD)) {
      try {
        connectDatabaseEmulator(this.db, FIREBASE_DATABASE_EMULATOR_HOST.host, FIREBASE_DATABASE_EMULATOR_HOST.port);
      } catch (error) {
        
      }
      try {
        connectFirestoreEmulator(this.firestore, FIREBASE_FIRESTORE_EMULATOR_HOST.host, FIREBASE_FIRESTORE_EMULATOR_HOST.port);  
      }catch (error) {
        
      }
    } 
   }

    

}
