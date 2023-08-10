import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Cconsommable } from 'src/app/interfaces/consommable';
import { Subject } from 'rxjs';
import { DocumentSnapshot, SnapshotOptions, Unsubscribe, deleteDoc, setDoc, updateDoc } from 'firebase/firestore';
import { collection, doc, Firestore, getFirestore, onSnapshot } from '@angular/fire/firestore';
import { RowConsommable } from 'src/app/interfaces/inventaire';
import { CalculService } from './menu.calcul/menu.calcul.ingredients/calcul.service';

@Injectable({
  providedIn: 'root'
})
export class ConsommableInteractionService {
  private firestore: Firestore;
  private consommable_converter:any;
  private _consommables: Array<Cconsommable>;
  private consommables = new Subject<Array<Cconsommable>>();
  private sub_consommables!:Unsubscribe;
  constructor(private ofApp: FirebaseApp, private service:CalculService){
    this.firestore = getFirestore(ofApp);
    this.consommable_converter = {
      toFirestore: (consommable:Cconsommable) => {
        return consommable;
      },
      fromFirestore: (snapshot:DocumentSnapshot<Cconsommable>, options:SnapshotOptions) => {
        const data = snapshot.data(options);
        let consommable = new Cconsommable(this.service);
        if(data !== undefined){
          consommable.setData(data);
          return consommable;
        }
        else{
          return null;
        }
      } 
    } 
    this._consommables = [];
  }
  /**
   * Cette fonction permet de récupérer l'ensemble des consommable de la base de donnée
   * @param proprietaire_id identifiant de l'enseigne qui possède les consommables
   * @param restaurant_id identifiant du restaurant qui possède les consommables
   * @returns {Unsubscribe} fonction de désabonnement à la récupération des consommables
   */
  getConsommablesFromRestaurantsBDD(proprietaire_id:string, restaurant_id:string){
    const consommables_ref = collection(doc(
      collection(
        doc(
          collection(
            this.firestore, "proprietaires"
            ), proprietaire_id
          ), "restaurants"
        ), restaurant_id
      ), "consommables").withConverter(this.consommable_converter);
    this.sub_consommables = onSnapshot(consommables_ref, (consommables) => {
      this._consommables = [];
      consommables.forEach((consommable) => {
          if(consommable.exists()){
            this._consommables.push(consommable.data() as Cconsommable)
          }
      })
      this.consommables.next(this._consommables);
    })
    return this.sub_consommables;
  }
  async getConsommablesFromBaseConso(){
  }
  /**
   * ajout d'un consommable à la base de donnée
   * @param consommable consommable à ajouter dans l'inventaire
   * @param prop nom de l'enseigne qui contient le consommable
   * @param restaurant nom du restaurant qui contient le consommable
   */
  async setConsoInBdd(consommable: Cconsommable, prop:string, restaurant:string){
    const consommable_ref = doc(collection(doc(
      collection(
        doc(
          collection(
            this.firestore, "proprietaires"
            ), prop
          ), "restaurants"
        ), restaurant
      ), "consommables")).withConverter(this.consommable_converter);
    await setDoc(consommable_ref, consommable.getData(consommable_ref.id, prop))
  }
  /**
   * 
   * @param consommable consommable à modifier de l'inventaire 
   * @param prop nom de l'enseigne qui contient le consommable
   * @param restaurant nom du restaurant qui contient le consommable
   */
  async updateConsoInBdd(consommable: Cconsommable, prop: string, restaurant: string) {
    const consommable_ref = doc(collection(doc(
      collection(
        doc(
          collection(
            this.firestore, "proprietaires"
            ), prop
          ), "restaurants"
        ), restaurant
      ), "consommables"),
      consommable.id).withConverter(this.consommable_converter);
      await updateDoc(consommable_ref, consommable.getData(null, prop))
  }

  /**
   * Permet de supprimer un consommable dans la base de donnée
   * @param consommable  consommable à supprimer depuis la base de donnée 
   * @param prop identifiant de l'enseigne qui possède le consommable
   * @param restaurant  identifiant du restaurant qui possède le consommable
   */
  async removeConsoInBdd(consommable: RowConsommable, prop:string, restaurant:string){
    const consommables_ref = doc(collection(doc(
      collection(
        doc(
          collection(
            this.firestore, "proprietaires"
            ), prop
          ), "restaurants"
        ), restaurant
      ), "consommables"),
      consommable.id).withConverter(this.consommable_converter);
    await deleteDoc(consommables_ref); 
  }
  getConsommablesFromRestaurants(){
    return this.consommables.asObservable();
  }
}
