import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { child, connectDatabaseEmulator, Database, get, getDatabase, ref, remove, update } from 'firebase/database';
import { Cetape } from '../../../app/interfaces/etape';
import {TIngredientBase } from '../../../app/interfaces/ingredient';
import { Cplat, Plat } from '../../../app/interfaces/plat';
import { Cpreparation} from '../../../app/interfaces/preparation';
import { FIREBASE_DATABASE_EMULATOR_HOST, FIREBASE_PROD } from '../../../environments/variables';
import { IngredientsInteractionService } from './ingredients-interaction.service';
import { Cconsommable } from 'src/app/interfaces/consommable';
import { Subject } from 'rxjs';
import { collection, doc, DocumentSnapshot, Firestore, getFirestore, onSnapshot, setDoc, SnapshotOptions, Unsubscribe } from 'firebase/firestore';
import { CalculService } from './menu.calcul/menu.calcul.ingredients/calcul.service';

@Injectable({
  providedIn: 'root'
})
export class PlatsInteractionService {
  private firestore: Firestore;
  private _plats: Array<Cplat>;
  private plats = new Subject<Array<Cplat>>();
  private consommables: Array<Cconsommable>;
  private ingredients: Array<TIngredientBase>;
  private ingredients_minimal: {name:string, quantity:number, unity:string}[];
  private preparation: Array<Cpreparation>;
  private etapes: Array<Cetape>;
  private plat_converter:any;
  private sub_plats!:Unsubscribe;
  constructor(private ofApp: FirebaseApp, private calcul_service:CalculService) {
    this.firestore = getFirestore(ofApp);
    this._plats = [];
    this.plat_converter = {
      toFirestore: (plat:Cplat) => {
        return plat;
      },
      fromFirestore: (snapshot:DocumentSnapshot<Cplat>, options:SnapshotOptions) => {
        const data = snapshot.data(options);
        if(data !== undefined){
          let plat = new Cplat();
          plat.setData(data)
          return plat;
        }
        else{
          return null;
        }
      } 
    }  
    this.consommables = [];
    this.ingredients = [];
    this.etapes = [];
    this.preparation = [];
    this.ingredients_minimal = [];
  }

  /**
   * Récupération de l'ensemble des plats depuis la base de donnée
   * @param prop identifiant de l'enseigne qui détient le plat
   * @returns {Unsubscribe} fonction de désinscription de l'obsservable onSnapshot
   */
  getPlatFromRestaurantBDD(prop: string) {
    const plats_ref = 
      collection(
        doc(
          collection(
            this.firestore, "proprietaires"
            ), prop
          ), "plats"
        ).withConverter(this.plat_converter);
    this.sub_plats = onSnapshot(plats_ref, (plats) => {
      this._plats = [];
      plats.forEach((plat) => {
          if(plat.exists()){
            this._plats.push(plat.data() as Cplat)
          }
      })
      this.plats.next(this._plats);
    })
    return this.sub_plats;
  }

  getPlatFromRestaurant() {
    return this.plats.asObservable();;
  }
  async removePlatInBdd(prop: string, restaurant: string, plat_id: string) {
    
  }
  /**
   * permet d'ajouter un plat à la bdd
   * @param prop identifiant de l'enseigne qui possède le plat
   * @param plat plat que l'ont veut ajouter à la bdd
   */
  async setPlat(prop: string, plat: Cplat) {
    console.log("setPLat");
    console.log(plat);
    const plats_ref = 
      doc(collection(
        doc(
          collection(
            this.firestore, "proprietaires"
            ), prop
          ), "plats"
        )).withConverter(this.plat_converter);
    await setDoc(plats_ref, plat.getData(plats_ref.id, prop))
  }
    /**
   * permet de modifier un plat dans la bdd
   * @param prop identifiant de l'enseigne qui possède le plat
   * @param plat plat que l'ont veut modifier dans la bdd
   */
  async updatePlat(prop: string, plat: Cplat) {
    console.log(plat);
    const plats_ref = 
      doc(collection(
        doc(
          collection(
            this.firestore, "proprietaires"
            ), prop
          ), "plats"
        ), plat.id).withConverter(this.plat_converter);
    await setDoc(plats_ref, plat.getData(null, prop))
  }
}
