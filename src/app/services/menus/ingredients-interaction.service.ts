import { Injectable } from '@angular/core';
import { FirebaseApp } from "@angular/fire/app";
import { Database, getDatabase } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class IngredientsInteractionService {
  db: Database;

  constructor(private ofApp: FirebaseApp) { 
    this.db = getDatabase(ofApp);
  }
}
