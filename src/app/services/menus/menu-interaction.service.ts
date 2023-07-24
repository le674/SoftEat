import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { child, connectDatabaseEmulator, Database, get, getDatabase, ref, remove, update } from 'firebase/database';
import { TIngredientBase } from '../../../app/interfaces/ingredient';
import { Cmenu } from '../../../app/interfaces/menu';
import { Cplat } from '../../../app/interfaces/plat';
import { FIREBASE_DATABASE_EMULATOR_HOST, FIREBASE_PROD } from '../../../environments/variables';
import { ConsommableInteractionService } from './consommable-interaction.service';
import { IngredientsInteractionService } from './ingredients-interaction.service';
import { PlatsInteractionService } from './plats-interaction.service';
import { Cconsommable } from 'src/app/interfaces/consommable';
import { Subject } from 'rxjs';
import { collection, deleteDoc, doc, DocumentSnapshot, Firestore, getFirestore, onSnapshot, SnapshotOptions, Unsubscribe } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class MenuInteractionService {
  private firestore: Firestore;
  private _menus: Array<Cmenu>
  private menus = new Subject<Array<Cmenu>>();
  private menu_converter: any;
  private sub_menus!: Unsubscribe;

  constructor(private ofApp: FirebaseApp, private ingredient_service: IngredientsInteractionService,
    private conso_service: ConsommableInteractionService, private plat_service: PlatsInteractionService) {
    this.firestore = getFirestore(ofApp);
    this._menus = [];
    this.menu_converter = {
      toFirestore: (menu: Cmenu) => {
        return menu;
      },
      fromFirestore: (snapshot: DocumentSnapshot<Cmenu>, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        if (data !== undefined) {
          let menu = new Cmenu();
          menu.setData(data)
          return menu;
        }
        else {
          return null;
        }
      }
    };
  }
  /**
   * permet de récupérer un menu depuis la base de donnée 
   * @param prop identifiant du propriétaire qui possède le menu
   */
  getMenuFromRestaurantBDD(prop: string) {
    const menus_ref =
      collection(
        doc(
          collection(
            this.firestore, "proprietaires"
          ), prop
        ), "menus"
      ).withConverter(this.menu_converter);
    this.sub_menus = onSnapshot(menus_ref, (menus) => {
      this._menus = [];
      menus.forEach((menu) => {
        if (menu.exists()) {
          this._menus.push(menu.data() as Cmenu)
        }
      })
      this.menus.next(this._menus);
    })
    return this.sub_menus;
  }
  /**
   * cette fonction permet de supprimer un menu dans la base de donnée
   * @param prop enseigne qui détient le menu
   * @param menu menu à supprimer de la base de donnée
   */
  async removeMenuFromBDD(prop:string,menu:Cmenu){
    const menus_ref =
    doc(collection(
      doc(
        collection(
          this.firestore, "proprietaires"
        ), prop
      ), "menus"
    ),menu.id).withConverter(this.menu_converter)
    await deleteDoc(menus_ref);
  }

  /**
   * cette fonction permet d'ajouter un menu à la base de donnée
   * @param prop enseigne qui possède le menu
   * @param restaurant restaurant qui possède le menu
   * @param menu menu à ajouter dans la base de donnée
   */
  async setMenu(prop: string, restaurant: string, menu: Cmenu) {
    throw new Error('Method not implemented.');
  }
  getMenuFromRestaurant() {
    return this.menus.asObservable();
  }
}
