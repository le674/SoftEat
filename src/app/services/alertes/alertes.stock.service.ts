import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Database, getDatabase } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class AlertesStockService {
  private db: Database;

  constructor(private ofApp: FirebaseApp){
    this.db = getDatabase(ofApp);
  }

  async setStockAlertes(message:string){

  }

  async setResponseAlertes(message:string, id_alerte:string, from:string, to:string){

  }

}
