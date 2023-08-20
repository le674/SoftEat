import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ConversationInteractionService {
  private firebaseApp!: FirebaseApp;
  constructor(private ofApp: FirebaseApp, private firestore: Firestore, ) { }
  getConversationBDD(prop:string, restaurant:string){
    
  }
}
