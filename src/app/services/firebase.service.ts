import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from '@angular/fire/app';
import { getDatabase, ref, onValue, get, DatabaseReference } from 'firebase/database';
import { Statut } from '../interfaces/statut';
import { Unsubscribe } from 'firebase/auth';
import { DocumentSnapshot, Firestore, SnapshotOptions, collection, doc, getFirestore, onSnapshot } from '@angular/fire/firestore';
import { CIngredient } from '../interfaces/ingredient';
import { Cpreparation } from '../interfaces/preparation';
import { CalculService } from './menus/menu.calcul/menu.calcul.ingredients/calcul.service';
import { InteractionBddFirestore } from '../interfaces/interaction_bdd';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    private firebaseApp!: FirebaseApp;
    private firestore: Firestore;
    private db: any;
    private interaction_data = new Subject<Array<InteractionBddFirestore>>();
    statut!: Statut;
    private sub_function!:Unsubscribe;
    private data_array:Array<InteractionBddFirestore>;
    constructor(private ofApp: FirebaseApp,private service: CalculService) {
        this.firestore = getFirestore(ofApp);
        this.data_array = [];
    }
    /**
     * récupération de l'ensemble des objet qui pointe vers le chemin pour l'accès en base de donnée
     * @param paths chemins qui permettent d'accéder au noeud de la base de donnée pour récupérer l'information 
     * sous la forme d'une liste [proprietaire, prop_id, restaurants, ...], ou d'un chemin proprietaire/WXPIOOJJ89/restaurants
     * @param class_instance instance de la classe de l'objet à récupérer dans la base de donnée
     * @returns 
    */
    getFromFirestoreBDD(paths:Array<string> | string, class_instance:InteractionBddFirestore){
        let _paths:Array<string> = [];
        if(typeof paths === "string"){
            _paths = paths.split("/");
        }
        else{
            _paths = paths;
        }
        let converter_firestore:any = {
            toFirestore: (ingredient:InteractionBddFirestore) => {
                return ingredient;
            },
            fromFirestore: (snapshot: DocumentSnapshot<InteractionBddFirestore>, options: SnapshotOptions) => {
                const data = snapshot.data(options);
                if (data !== undefined) {
                    let instance = class_instance.getInstance();
                    instance.setData(data);
                    return instance;
                }
                else {
                    return null;
                }
            }
        }
        let ref = collection(this.firestore, paths[0]);
        _paths.forEach((path, index) => {
            if((index < paths.length - 1) && ((index % 2) === 0)){
                ref = collection(doc(ref, paths[index + 1]), paths[index + 2]);
            }
        });
        ref = ref.withConverter(converter_firestore);
        this.sub_function = onSnapshot(ref, (firestore_datas) => {
            this.data_array = [];
            firestore_datas.forEach((_data) => {
                if(_data.exists()){
                    this.data_array.push(_data.data() as InteractionBddFirestore);
                }
            });
            this.interaction_data.next(this.data_array)
        })
        return this.sub_function;
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
      
        return new Promise<DatabaseReference>((resolve) => { // | null
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

        return new Promise<{ [conv: string]: string[] }>((resolve) => {
            if (usersSnapShot.exists()) {
                usersSnapShot.forEach((userSnapShot) => {
                    const user = userSnapShot.val() ;
                    const userStatuts = user.statut;
                    const user_email = user.email;
                    //
                    if(userStatuts.stock === 'wr' || userStatuts.stock === 'rw' || userStatuts.stock === 'r') { //userStatuts.stock.includes('w') || userStatuts.stock.includes('r')
                        convListUsers['inv'].push(user_email);
                        convListUsers['rec'].push(user_email);
                    }
                    if(userStatuts.analyse === 'wr' || userStatuts.analyse === 'rw' || userStatuts.analyse === 'r' ) convListUsers['ana'].push(user_email);
                    if(userStatuts.budget === 'wr' || userStatuts.budget === 'rw' || userStatuts.budget === 'r' ) convListUsers['com'].push(user_email);
                    if(userStatuts.facture === 'wr' || userStatuts.facture === 'rw' || userStatuts.facture === 'r' ) convListUsers['fac'].push(user_email);
                    if(userStatuts.planning === 'wr' || userStatuts.planning === 'rw' || userStatuts.planning === 'r' ) convListUsers['plan'].push(user_email);
                    
                });
                resolve(convListUsers);
            }
        });
    } 
    getFromFirestore(){
        return this.interaction_data.asObservable();
    } 
}


  