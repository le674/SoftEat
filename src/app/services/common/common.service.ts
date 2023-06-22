import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Firestore, connectFirestoreEmulator} from '@angular/fire/firestore';
import { FIREBASE_DATABASE_EMULATOR_HOST, FIREBASE_PROD } from 'src/environments/variables';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private read_count:number;
  constructor() { 
    this.read_count = 0;
  }

  // l'argument type dépend du tbaleau que l'on souhaite transformer 
  getMobileBreakpoint(type:string):boolean{
    if((type === "acceuil") && (window.innerWidth < 780)){
      return true;
    }
    if((type === "ing") && (window.innerWidth < 876)){
      return true;
    }
    if((type === "prepa") && (window.innerWidth < 876)){
      return true;
    }
    if((type === "conso") && (window.innerWidth < 876)){
      return true;
    }
    if((type === "mobile") && (window.innerWidth < 1040)){
      return true;
    }
    return false;
  }
  accordeonMaxWidth(): any {
    if((window.innerWidth < 768) && (window.innerWidth > 600)) {
      return 500; // Largeur maximale pour les écrans plus petits que 768px
    } 
    if((window.innerWidth < 600) && (window.innerWidth > 480)){
      return 380;
    }
    if((window.innerWidth < 480) && (window.innerWidth > 414)){
      return 314;
    }
    if((window.innerWidth < 414) && (window.innerWidth > 375)){
      return 275;
    }
    if((window.innerWidth < 375) && (window.innerWidth > 320)){
      return 220;
    }
    return window.innerWidth - 100;
  }
  incCounter():any{
    this.read_count = this.read_count + 1;
  }
  decCounter():any{
    this.read_count = this.read_count - 1;
  }
  getCounter():number{
    return this.read_count;
  }
  initializeBdd(app:FirebaseApp, firestore:Firestore):Firestore{
    if ((location.hostname === "localhost") && (!FIREBASE_PROD)) {
      try {
          connectFirestoreEmulator(firestore, FIREBASE_DATABASE_EMULATOR_HOST.host, FIREBASE_DATABASE_EMULATOR_HOST.port);
      } catch (error) {
          console.log(error);
          
      }  
    } 
    return firestore;
  }
}
