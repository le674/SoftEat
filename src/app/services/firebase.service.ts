import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from '@angular/fire/app';
import { getDatabase, ref, onValue, get, DatabaseReference } from 'firebase/database';
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
      
    getEmailLocalStorage() {
        const email = localStorage.getItem("user_email") as string;
        return email;
    }
      

      
    async getUserStatutsLocalStorage(email: string): Promise<Statut> { 
        const usersRef = ref(this.db, 'users/foodandboost_prop');
        const usersSnapShot = await get(usersRef); // Ici : Erreur permission dinied

        return new Promise<Statut>((resolve, reject) => {
            if (usersSnapShot.exists()) {
                usersSnapShot.forEach((userSnapShot) => {
                    const user = userSnapShot.val();
                    if (user.email == email) {
                        onValue(userSnapShot.ref, (snapshot) => {
                            const userContent = snapshot.val();
                            const userStatut = userContent.statut;
                            resolve(userStatut);
                        }, (error) => {
                            reject(error);
                        });
                    }
                });
            }
        });
    }


    async getUserDataReference(user_email: string): Promise<DatabaseReference> { // | null
        const usersRef = ref(this.db, 'users/foodandboost_prop');
        const usersSnapShot = await get(usersRef); // Ici : Erreur permission dinied
      
        return new Promise<DatabaseReference>((resolve, reject) => { // | null
            if (usersSnapShot.exists()) {
                usersSnapShot.forEach((userSnapShot) => {
                    const user = userSnapShot.val();
                    if (user.email == user_email) {
                        resolve(userSnapShot.ref);
                    }
                });
            }
            // resolve(null); // Si aucun utilisateur ne correspond à l'email fourni
        });
    }

    async fetchConvListUsers(): Promise<{ [conv: string]: string[] }> { // Promise<any>
        const usersRef = ref(this.db, 'users/foodandboost_prop');
        const usersSnapShot = await get(usersRef); // Ici : Erreur permission dinied
        const convListUsers = { 'ana': [''], 'com': [''], 'fac': [''], 'inv': [''], 'rec': [''], 'plan': [''], 'rh': ['']};

        return new Promise<{ [conv: string]: string[] }>((resolve, reject) => {
            if (usersSnapShot.exists()) {
                usersSnapShot.forEach((userSnapShot) => {
                    const user = userSnapShot.val() ;
                    const userStatuts = user.statut;
                    const user_email = user.email;
                    //
                    if(userStatuts.stock === 'wr' || userStatuts.stock === 'rw' || userStatuts.stock === 'r') { //userStatuts.stock.includes('w') || userStatuts.stock.includes('r')
                        convListUsers['inv'].push(user_email);
                        convListUsers['rec'].push(user_email);
                    };
                    if(userStatuts.analyse === 'wr' || userStatuts.analyse === 'rw' || userStatuts.analyse === 'r' ) convListUsers['ana'].push(user_email);
                    if(userStatuts.budget === 'wr' || userStatuts.budget === 'rw' || userStatuts.budget === 'r' ) convListUsers['com'].push(user_email);
                    if(userStatuts.facture === 'wr' || userStatuts.facture === 'rw' || userStatuts.facture === 'r' ) convListUsers['fac'].push(user_email);;
                    if(userStatuts.planning === 'wr' || userStatuts.planning === 'rw' || userStatuts.planning === 'r' ) convListUsers['plan'].push(user_email);
                    
                });
                resolve(convListUsers);
            }
        });
    }
    
    
}


  