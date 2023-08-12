import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from '@angular/fire/app';
import { getDatabase, ref, onValue, get, DatabaseReference } from 'firebase/database';
import { Statut } from '../interfaces/statut';
import { Unsubscribe } from 'firebase/auth';
import { CollectionReference, DocumentData, DocumentReference, DocumentSnapshot, Firestore, SnapshotOptions, collection, updateDoc, deleteDoc, doc, getFirestore, onSnapshot, setDoc } from '@angular/fire/firestore';
import { CalculService } from './menus/menu.calcul/menu.calcul.ingredients/calcul.service';
import { InteractionBddFirestore } from '../interfaces/interaction_bdd';
import { Subject } from 'rxjs';

type Class<T> = new (...args: any[]) => T;

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    private firebaseApp!: FirebaseApp;
    private firestore: Firestore;
    private db: any;
    private interaction_data = new Subject<Array<InteractionBddFirestore>>();
    statut!: Statut;
    private sub_function!: Unsubscribe;
    private data_array: Array<InteractionBddFirestore>;
    constructor(private ofApp: FirebaseApp, private service: CalculService) {
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
    public getFromFirestoreBDD(paths: Array<string> | string, class_instance: Class<InteractionBddFirestore>) {
        this.interaction_data = new Subject<Array<InteractionBddFirestore>>();
        let _paths: Array<string> = this.getPath(paths);
        let converter_firestore: any = {
            toFirestore: (ingredient: InteractionBddFirestore) => {
                return ingredient;
            },
            fromFirestore: (snapshot: DocumentSnapshot<InteractionBddFirestore>, options: SnapshotOptions) => {
                const data = snapshot.data(options);
                if (data !== undefined) {
                    let instance: InteractionBddFirestore;
                    instance = this.constructInstance(class_instance).getInstance();
                    instance.setData(data);
                    return instance;
                }
                else {
                    return null;
                }
            }
        }
        let ref = this.concatPathCollection(_paths, converter_firestore);
        this.sub_function = onSnapshot(ref, (firestore_datas) => {
            this.data_array = [];
            firestore_datas.forEach((_data) => {
                if (_data.exists()) {
                    this.data_array.push(_data.data() as InteractionBddFirestore);
                }
            });
            this.interaction_data.next(this.data_array)
        })
        return this.sub_function;
    }
    /**
     * Suppréssion de l'ingrédient ddans la base de donnée 
     * @param ingredient ingrédient que l'on supprime de la base de donnée 
     * @param prop enseigne qui possède l'ingrédient
     * @param restaurant restaurant qui possède l'ingrédient
    */
    public async removeFirestoreBDD(removed_id: string, paths: Array<string> | string) {
        let _paths: Array<string> = this.getPath(paths);
        let ref = this.concatPathDoc(removed_id,_paths, null);
        await deleteDoc(ref);
    }
    /**
     * Cette fonction permet d'ajouter dans firestore des données 
     * @param data_to_set donnée à ajouter à la base de donnée Firestore
     * @param prop enseigne pour lequel nous souhaitons ajouter les donnée
     * @param restaurant 
     */
    public async setFirestoreData(data_to_set: InteractionBddFirestore, paths: Array<string> | string, class_instance: Class<InteractionBddFirestore>){
        let _paths: Array<string> = this.getPath(paths);
        let converter_firestore: any = {
            toFirestore: (ingredient: InteractionBddFirestore) => {
                return ingredient;
            },
            fromFirestore: (snapshot: DocumentSnapshot<InteractionBddFirestore>, options: SnapshotOptions) => {
                const data = snapshot.data(options);
                if (data !== undefined) {
                    let instance: InteractionBddFirestore;
                    instance = this.constructInstance(class_instance).getInstance();
                    instance.setData(data);
                    return instance;
                }
                else {
                    return null;
                }
            }
        }
        let ref = doc(this.concatPathCollection(_paths, converter_firestore));
        await setDoc(ref, data_to_set.getData(ref.id))
    }
    /**
     * Cette fonction permet de modifier dans firestore des données 
     * @param data_to_set donnée à ajouter à la base de donnée Firestore
     * @param prop enseigne pour lequel nous souhaitons ajouter les donnée
     * @param restaurant 
     */
    public async updateFirestoreData(id:string,data_to_set: InteractionBddFirestore, paths: Array<string> | string, class_instance: Class<InteractionBddFirestore>){
            let _paths: Array<string> = this.getPath(paths);
            let converter_firestore: any = {
                toFirestore: (ingredient: InteractionBddFirestore) => {
                    return ingredient;
                },
                fromFirestore: (snapshot: DocumentSnapshot<InteractionBddFirestore>, options: SnapshotOptions) => {
                    const data = snapshot.data(options);
                    if (data !== undefined) {
                        let instance: InteractionBddFirestore;
                        instance = this.constructInstance(class_instance).getInstance();
                        instance.setData(data);
                        return instance;
                    }
                    else {
                        return null;
                    }
                }
            }
            let ref = this.concatPathDoc(id,_paths, converter_firestore);
            await updateDoc(ref, data_to_set.getData(null));
    }
    /**
     * Cette fonction permet depuis le local storage de récupérer le mail d'un employée
     * @returns {string} chaîne de caractère représentant l'email de l'utilisateur
     */
    public getEmailLocalStorage() {
        const email = localStorage.getItem("user_email") as string;
        return email;
    }
    /**
     * Permet de récupérer les status présent dans le local storage de l'utilisateur
     * @param email identifiant email de l'utilisateur
     * @returns les status de l'utilisateur
     */
    public async getUserStatutsLocalStorage(email: string): Promise<Statut> {
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
    /**
     * Permet de récupérer la référence de l'utilisateur dans la base de donnée
     * @param user_email email de l'utilisateur
     * @returns reférence de la position de l'user si celui dans la base de donnée et le même que celui passé en paramètre
     */
    public async getUserDataReference(user_email: string): Promise<DatabaseReference> { // | null
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
    /**
     * Récupération depuis la base de donnée d'une liste d'utilisateurs
     * @returns la liste d'utilisateurs dans le noeud users/foodandboost_prop
     */
    public async fetchConvListUsers(): Promise<{ [conv: string]: string[] }> { // Promise<any>
        const usersRef = ref(this.db, 'users/foodandboost_prop');
        const usersSnapShot = await get(usersRef); // Ici : Erreur permission dinied
        const convListUsers = { 'ana': [''], 'com': [''], 'fac': [''], 'inv': [''], 'rec': [''], 'plan': [''], 'rh': [''] };

        return new Promise<{ [conv: string]: string[] }>((resolve) => {
            if (usersSnapShot.exists()) {
                usersSnapShot.forEach((userSnapShot) => {
                    const user = userSnapShot.val();
                    const userStatuts = user.statut;
                    const user_email = user.email;
                    //
                    if (userStatuts.stock === 'wr' || userStatuts.stock === 'rw' || userStatuts.stock === 'r') { //userStatuts.stock.includes('w') || userStatuts.stock.includes('r')
                        convListUsers['inv'].push(user_email);
                        convListUsers['rec'].push(user_email);
                    }
                    if (userStatuts.analyse === 'wr' || userStatuts.analyse === 'rw' || userStatuts.analyse === 'r') convListUsers['ana'].push(user_email);
                    if (userStatuts.budget === 'wr' || userStatuts.budget === 'rw' || userStatuts.budget === 'r') convListUsers['com'].push(user_email);
                    if (userStatuts.facture === 'wr' || userStatuts.facture === 'rw' || userStatuts.facture === 'r') convListUsers['fac'].push(user_email);
                    if (userStatuts.planning === 'wr' || userStatuts.planning === 'rw' || userStatuts.planning === 'r') convListUsers['plan'].push(user_email);

                });
                resolve(convListUsers);
            }
        });
    }
    public getFromFirestore() {
        return this.interaction_data.asObservable();
    }
    /**
     * permet de construire une instance en fonction du constructeur de la class,
     * cette fonction est uniquement utilisé dans getFromFirestoreBDD
     * @param Class class dont nous voulons retourner une instance
     */
    private constructInstance(Class: Class<InteractionBddFirestore>, ...args: any[]) {
        if (Class.name === "CIngredient") {
            return new Class(this.service);
        }
        if (Class.name === "Cpreparation") {
            return new Class(this.service);
        }
        if (Class.name === "Cconsommable") {
            return new Class(this.service);
        }
        return new Class();
    }
    private getPath(paths: string | Array<string>): Array<string> {
        let _paths: Array<string> = [];
        if (typeof paths === "string") {
            _paths = paths.split("/");
        }
        else {
            _paths = paths;
        }
        return _paths
    }
    /**
     * Cette fonction permet de construire la référence vers la collection firestore auquel nous souhaitons accéder afin de récupérer ou écrire des données
     * @param _paths chemin d'accès au noeud
     * @param converter objet qui permet la convertion du JSON en un objet de class, null si aucune conversion
     * @returns {CollectionReference<DocumentData>} référence vers la collection dont nous souhaitons l'accès
     */
    private concatPathCollection(_paths: Array<string>, converter: any | null): CollectionReference<DocumentData> {
        let ref = collection(this.firestore, _paths[0]);
        _paths.forEach((path, index) => {
            if ((index < _paths.length - 1) && ((index % 2) === 0)) {
                ref = collection(doc(ref, _paths[index + 1]), _paths[index + 2]);
            }
        });
        if (converter !== null) ref = ref.withConverter(converter);
        return ref;
    }
    /**
     * Cette fonction permet de construire la référence vers un docuement firestore auquel nous souhaitons accéder afin de récupérer ou écrire des données
     * @param doc_id identifiant du document dont nous souhaitons l'accès
     * @param _paths chemin d'accès au noeud
     * @param converter objet qui permet la convertion du JSON en un objet de class, null si aucune conversion
     * @returns {CollectionReference<DocumentData>} référence vers la collection dont nous souhaitons l'accès
    */
    private concatPathDoc(doc_id:string, _paths: Array<string>, converter: any | null):DocumentReference<DocumentData> {
        let ref = collection(this.firestore, _paths[0]);
        _paths.forEach((path, index) => {
            if ((index < _paths.length - 2) && ((index % 2) === 0)) {
                ref = collection(doc(ref, _paths[index + 1]), _paths[index + 2]);
            }
        });
        let doc_ref = doc(ref, doc_id);
        if (converter !== null) doc_ref = doc_ref.withConverter(converter);
        return doc_ref;
    }
}


