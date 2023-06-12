import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from '@angular/fire/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Statut } from '../interfaces/statut';


@Injectable({
    providedIn: 'root'
})


export class FirebaseService {
    private firebaseApp!: FirebaseApp;
    private db: any;
    statut!: Statut;

    constructor() {
        const firebaseConfig = {
            apiKey: "AIzaSyDPJyOCyUMDl70InJyJLwNLAwfiYnrtsDo",
            authDomain: "psofteat-65478545498421319564.firebaseapp.com",
            databaseURL: "https://psofteat-65478545498421319564-default-rtdb.firebaseio.com",
            projectId: "psofteat-65478545498421319564",
            storageBucket: "psofteat-65478545498421319564.appspot.com",
            messagingSenderId: "135059251548",
            appId: "1:135059251548:web:fb05e45e1d1631953f6199",
            measurementId: "G-5FBJE9WH0X"
          };
        this.firebaseApp = initializeApp(firebaseConfig);
        this.db = getDatabase(this.firebaseApp);
    }

    getDatabaseInstance(): any {
        return this.db;
    }
      
    // getUserEmailRef(userId: string): any {
    //     return ref(this.db, `users/foodandboost_prop/${userId}/email`);
    // }
      
    getUserStatusRef(userId: string): any {
        return ref(this.db, `users/foodandboost_prop/${userId}/statut`);
    }
      
    // fetchUserEmail(userId: string): Promise<string> {
    //     const userEmailRef = this.getUserEmailRef(userId);
      
    //     return new Promise<string>((resolve, reject) => {
    //         onValue(userEmailRef, (snapshot) => {
    //         const email = snapshot.val();
    //         resolve(email);
    //     }, (error) => {
    //         reject(error);
    //     });
    //     });
    // }
      
    fetchUserStatus(userId: string): Promise<Statut> { 
        const userStatusRef = this.getUserStatusRef(userId);

        return new Promise<Statut>((resolve, reject) => {
            onValue(userStatusRef, (snapshot) => {
                const statut = snapshot.val();
                resolve(statut);
            }, (error) => {
                reject(error);
            });
            //     this.statut = {is_prop:false,
            //         stock:"",
            //         alertes:"",
            //         analyse:"",
            //         budget:"",
            //         facture:"",
            //         planning:""};
            //     this.statut.analyse = statut.analyse;
            //     this.statut.budget = statut.budget;
            //     this.statut.facture = statut.facture;
            //     this.statut.planning = statut.planning;
            //     this.statut.stock = statut.stock;
            // });
            // return this.statut;
        });
        
    }
    
    
}


  