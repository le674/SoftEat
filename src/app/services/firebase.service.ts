import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import {ref, onValue, get } from 'firebase/database';
import { Statut } from '../interfaces/statut';
import { Unsubscribe } from 'firebase/auth';
import { CollectionReference, DocumentData, DocumentReference, DocumentSnapshot, Firestore, SnapshotOptions, collection, updateDoc, deleteDoc, doc, onSnapshot, setDoc, getDocs } from '@angular/fire/firestore';
import { CalculService } from './menus/menu.calcul/menu.calcul.ingredients/calcul.service';
import { Condition, InteractionBddFirestore } from '../interfaces/interaction_bdd';
import { Subject, throwError } from 'rxjs';
import { Conversation } from '../interfaces/conversation';
import { Query, query, where } from 'firebase/firestore';
import { Employee } from '../interfaces/employee';
import { CommonService } from './common/common.service';

type Class<T> = new (...args: any[]) => T;

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    private firebaseApp!: FirebaseApp;
    private db: any;
    private interaction_data = new Subject<Array<InteractionBddFirestore>>();
    private changed_interaction_data = new Subject<InteractionBddFirestore>();
    private ref!:Query<DocumentData>;
    statut!: Statut;
    private sub_function!: Unsubscribe;
    private data_array: Array<InteractionBddFirestore>;
    constructor(private ofApp: FirebaseApp, private firestore:Firestore,private service: CalculService, private common_service:CommonService) {
        this.data_array = [];
    }
    /**
     * récupération de l'ensemble des objet qui pointe vers le chemin pour l'accès en base de donnée
     * @param paths chemins qui permettent d'accéder au noeud de la base de donnée pour récupérer l'information 
     * sous la forme d'une liste [proprietaire, prop_id, restaurants, ...], ou d'un chemin proprietaire/WXPIOOJJ89/restaurants
     * @param class_instance instance de la classe de l'objet à récupérer dans la base de donnée
     * @param conditions filtre sur les données récupérés depuis firestore
    * @returns 
    */
    public getFromFirestoreBDD(paths: Array<string> | string, class_instance: Class<InteractionBddFirestore>, conditions:Array<Condition> | null) {
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
        this.ref = this.concatPathCollectionWithWhere(_paths, converter_firestore, conditions);
        this.sub_function = onSnapshot(this.ref, (firestore_datas) => {
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
     * Permet d'écouter uniquement les données chager dans firestore pour un chemin 
     * @param paths chemins qui permettent d'accéder au noeud de la base de donnée pour récupérer l'information 
     * sous la forme d'une liste [proprietaire, prop_id, restaurants, ...], ou d'un chemin proprietaire/WXPIOOJJ89/restaurants
     * @param class_instance instance de la classe de l'objet à récupérer dans la base de donnée
     * @param conditions filtre sur les données récupérés depuis firestore
     */
    getFromFirestoreChangeDataBDD(paths: Array<string> | string, class_instance: Class<InteractionBddFirestore>, conditions:Array<Condition> | null){
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
        this.ref = this.concatPathCollectionWithWhere(_paths, converter_firestore, conditions);
        this.sub_function = onSnapshot(this.ref, (firestore_datas) => {
            this.data_array = [];
            firestore_datas.docChanges().forEach((data) => {
                if(data.type === "added" || data.type === "modified"){
                    this.changed_interaction_data.next(data.doc.data() as InteractionBddFirestore);
                }
            })
        })
        return this.sub_function
    }
    /**
     * Cette fonction permet de récupérer l'ensemble des données situé vers le paths, avec une promesse
     * @param paths chemin vers l'ensemble des ingrédients dans la base de donnée
     * @param class_instance Class des donnée récupérer dans la base de donnée 
     */
    public async getFromFirestoreProm(paths:Array<string>, class_instance: Class<InteractionBddFirestore>, conditions:Array<Condition> | null){
        let datas:Array<InteractionBddFirestore> = [];
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
        let ref = this.concatPathCollectionWithWhere(_paths, converter_firestore, conditions);
        const documents_data = await getDocs(ref);
        documents_data.forEach((doc) => {
            datas.push(doc.data() as InteractionBddFirestore);
        })
        return datas;
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
        return await setDoc(ref, data_to_set.getData(ref.id)).then(async () => ref.id);
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
        if(Class.name === "Employee"){
            const statut = new Statut(this.common_service);
            return new Class("", statut, "", this.common_service);
        }
        return new Class();
    }
    private getPath(paths: string | Array<string>): Array<string> {

        let _paths: Array<string> =     [];
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
     * @param filtres  liste des filtres que nous souhaitons appliquer pour la récupération des éléments
     * @returns {CollectionReference<DocumentData>} référence vers la collection dont nous souhaitons l'accès
     */
    private concatPathCollectionWithWhere(_paths: Array<string>, converter: any | null, conditions:Array<Condition> | null):Query<DocumentData>{
        let ref = collection(this.firestore, _paths[0]);
        _paths.forEach((path, index) => {
            if ((index < _paths.length - 1) && ((index % 2) === 0)) {
                ref = collection(doc(ref, _paths[index + 1]), _paths[index + 2]);
            }
        });
        if(conditions !== null){
            const condition_lst = conditions.map((condition) => where(condition.attribut, condition.condition, condition.value))
            const reference = query(ref, ...condition_lst).withConverter(converter);
            return reference;
        }        
        return ref.withConverter(converter);
    }
       /**
     * Cette fonction permet de construire la référence vers la collection firestore auquel nous souhaitons accéder afin de récupérer ou écrire des données
     * @param _paths chemin d'accès au noeud
     * @param converter objet qui permet la convertion du JSON en un objet de class, null si aucune conversion
     * @returns {CollectionReference<DocumentData>} référence vers la collection dont nous souhaitons l'accès
     */
       private concatPathCollection(_paths: Array<string>, converter: any | null): CollectionReference<DocumentData>{
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
    public getFromFirestore() {
        return this.interaction_data.asObservable();
    }
    public getFromFirestoreChangeData() {
        return this.changed_interaction_data.asObservable();
    }
}


