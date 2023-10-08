import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Messaging, getMessaging, getToken } from "firebase/messaging";
import { FirebaseService } from './firebase.service';
import { Condition } from '../interfaces/interaction_bdd';
import { Employee } from '../interfaces/employee';

@Injectable({
  providedIn: 'root'
})
export class FcmService{
  private messaging:Messaging;
  private bdd:FirebaseService;
  constructor(private ofApp: FirebaseApp, private bdd_service:FirebaseService) {
    this.messaging = getMessaging(this.ofApp);
    this.bdd = this.bdd_service;
  }
  public async registerToken(employee:Employee, prop:string){
    return getToken(this.messaging,{
      vapidKey: 'BKkzHouxb3PhobBsmgfttRTyaeoTdSw-0oqNuvAD-MQRG6YJNlE1c32qktLVCrAo9fuXMCSAiUdQ59k_WkOqVw0'
    }).then((currentToken) => {
      const path_employee = Employee.getPathsToFirestore(prop);
      if(currentToken){
        const condition:Array<Condition> = [{
          attribut:"uid",
          condition:"==",
          value:employee.uid
        }];
        employee.registre_notif = currentToken;
        return this.bdd_service.updateFirestoreData(employee.id,employee, path_employee, Employee).then(() => {
          console.log("token registred to the bdd");
          return currentToken;
        }).catch((err) => {
          return new Error(err);
        })
      }
      else{
        return new Error("token not found");
      }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        return new Error(err)
    });
  }
}
