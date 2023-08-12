import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Cmenu } from '../../../app/interfaces/menu';
import { ConsommableInteractionService } from './consommable-interaction.service';
import { IngredientsInteractionService } from './ingredients-interaction.service';
import { PlatsInteractionService } from './plats-interaction.service';
import { Subject } from 'rxjs';
import { collection, deleteDoc, doc, DocumentSnapshot, Firestore, getFirestore, onSnapshot, setDoc, SnapshotOptions, Unsubscribe, updateDoc } from 'firebase/firestore';

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
    ),menu.id).withConverter(this.menu_converter);
    await deleteDoc(menus_ref);
  }

  /**
   * cette fonction permet d'ajouter un menu à la base de donnée
   * @param prop enseigne qui possède le menu
   * @param restaurant restaurant qui possède le menu
   * @param menu menu à ajouter dans la base de donnée
   */
  async setMenu(prop: string,  menu: Cmenu) {
    const menus_ref = 
    doc(collection(
      doc(
        collection(
          this.firestore, "proprietaires"
        ), prop
      ), "menus"
    )).withConverter(this.menu_converter);
    await setDoc(menus_ref, menu.getData(menus_ref.id))
  }

  /**
   * fonction qui permet de modifier un menu dans la base de donnée 
   * @param prop identifiant du proprietaire qui possède le menu
   * @param menu menu que nous souhaitons modifier dans la base de donnée
   */
  async updateMenu(prop:string, menu:Cmenu){
    const menu_ref = 
    doc(collection(
      doc(
        collection(
          this.firestore, "proprietaires"
        ), prop
      ), "menus"
    ), menu.id).withConverter(this.menu_converter);
    await updateDoc(menu_ref, menu.getData(null));
  }

  getMenuFromRestaurant() {
    return this.menus.asObservable();
  }
}
