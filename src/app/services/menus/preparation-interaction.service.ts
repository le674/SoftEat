import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Cetape } from '../../../app/interfaces/etape';
import {CIngredient, TIngredientBase } from '../../../app/interfaces/ingredient';
import { AfterPreparation, Cpreparation } from '../../../app/interfaces/preparation';
import { FIREBASE_DATABASE_EMULATOR_HOST, FIREBASE_PROD } from '../../../environments/variables';
import { CalculService } from './menu.calcul/menu.calcul.ingredients/calcul.service';
import { TConsoBase } from 'src/app/interfaces/consommable';
import { RowPreparation } from 'src/app/interfaces/inventaire';
import { collection, deleteDoc, doc, DocumentSnapshot, Firestore, getFirestore, setDoc, SnapshotOptions, updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class PreparationInteractionService {
  private firestore: Firestore;
  private preparations: Array<Cpreparation>;
  private preparation_converter:any;
  constructor(private ofApp: FirebaseApp, private calcul_service:CalculService) {
    this.firestore = getFirestore(ofApp);
    this.preparations = [];
    this.preparation_converter = {
      toFirestore: (preparation:Cpreparation) => {
        return preparation;
      },
      fromFirestore: (snapshot:DocumentSnapshot<Cpreparation>, options:SnapshotOptions) => {
        const data = snapshot.data(options);
        if(data !== undefined){
          let preparation = new Cpreparation(this.calcul_service);
          preparation.setData(data)
          return preparation;
        }
        else{
          return null;
        }
      } 
    } 
  }

  /**
   * Suppréssion de la préparation de la base de donnée 
   * @param preparation preparation que l'on supprime de la base de donnée
   * @param prop id de enseigne qui détient la préparation  
   * @param restaurant id du restaurant qui détient la préparation
   */
  async removePrepaInBdd(preparation: RowPreparation | Cpreparation, prop: string, restaurant: string) {  
    const preparation_ref = doc(collection(doc(
      collection(
        doc(
          collection(
            this.firestore, "proprietaires"
            ), prop
          ), "restaurants"
        ), restaurant
      ), "preparations"),
      preparation.id).withConverter(this.preparation_converter);
    await deleteDoc(preparation_ref);
  }
  /**
   * 
   * @param preparation preparation à ajoutrer à la base de donnnée
   * @param prop nom de l'ancienne qui détient la préparation 
   * @param restaurant nom du restaurant qui détient la préparation
   * @param base_ings_prepa ingrédients utilisés pour la préparation
   */
  async setPreparationInBdd(preparation: Cpreparation, prop: string, restaurant: string) {
    const preparation_ref =  doc(collection(doc(
      collection(
        doc(
          collection(
            this.firestore, "proprietaires"
            ), prop
          ), "restaurants"
        ), restaurant
      ), "preparations")).withConverter(this.preparation_converter);
      await setDoc(preparation_ref, preparation.getData(preparation_ref.id, prop))
  }
  /**
   * permet de modifier une préparation dans la base de donnée 
   * @param preparation préparation à modifier dans la base de donnée
   * @param prop id de l'ancienne qui possède la préparation
   * @param restaurant id du restaurant qui possède la préparation
   */
  async updatePreparationInBdd(preparation: Cpreparation, prop: string, restaurant: string){
    const ingredients_ref = doc(collection(doc(
      collection(
        doc(
          collection(
            this.firestore, "proprietaires"
            ), prop
          ), "restaurants"
        ), restaurant
      ), "preparations"),
      preparation.id).withConverter(this.preparation_converter);
      await updateDoc(ingredients_ref, preparation.getData(null,prop))
  }

  /**
   * 
   * @param restaurant identifiant du restaurant qui détient la préparation
   * @param prop identifiant de l'enseigne qui détient la préparation
   * @param preparation préparation à ajouter à l'inventaire
   */
  async setPreparation(preparation: Cpreparation, prop: string, restaurant: string) {
    if(preparation !== null){
      const preparation_ref = doc(collection(doc(
        collection(
          doc(
            collection(
              this.firestore, "proprietaires"
              ), prop
            ), "restaurants"
          ), restaurant
        ), "preparations")).withConverter(this.preparation_converter);
      await setDoc(preparation_ref, preparation.getData(preparation_ref.id, prop));
    }
  }

}


