import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Firestore } from '@angular/fire/firestore';
import { DocumentSnapshot, SnapshotOptions, collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import { FirebaseStorage, getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable} from "firebase/storage";
import { Facture } from 'src/app/interfaces/facture';


@Injectable({
  providedIn: 'root'
})
export class FactureInteractionService {
  private firestore: Firestore;
  private storage:FirebaseStorage;
  private facture_converter:any;
  constructor(private ofApp: FirebaseApp) { 
    this.firestore = getFirestore(ofApp);
    this.storage = getStorage(ofApp);
    this.facture_converter = {
      toFirestore: (consommable:Facture) => {
        return consommable;
      },
      fromFirestore: (snapshot:DocumentSnapshot<Facture>, options:SnapshotOptions) => {
        const data = snapshot.data(options);
        if(data !== undefined){
          let facture = new Facture(data?.date_reception, data?.is_read);
          facture.setData(data);
          return facture;
        }
        else{
          return null;
        }
      } 
    } 
  }

/**
 * Cette fonction permet d'ajouter la facture à Firestore
 * @param proprietaire_id identifiant de l'enseigne qui possède la facture
 * @param facture facture à ajouter dans firestore
 * @returns {Promise<Facture>} Une promesse qui est résolu une fois que la donnée a bien été ajouté dans la base de donnée et qui renvoie la facture qui vient d'être ajouté à la bdd
 */
  async setFactureFirestore(proprietaire_id:string, facture:Facture){
    const facture_ref = doc(
      collection(
        doc(
          collection(
            this.firestore, "proprietaires"
            ), proprietaire_id
          ), "factures"
      )).withConverter(this.facture_converter);
    facture.id = facture_ref.id;
    facture.creatPath(proprietaire_id);
    return setDoc(facture_ref, facture.getData()).then(() => {
      return facture;
    });
  }
 /**
  * Cette fonction permet d'ajouter la facture à Storage
  * @param url_blob url du blob que l'on veut ajouter dans la base de donnée
  * @param facture facture que l'on souhaite ajouter à Storage 
  */
  async setFactureStorage(blob:File, facture:Facture){
    if(facture.path !== null && facture.id !== null && facture.extension !== null){
      const path = facture.path + "/" + facture.id + "." + facture.extension;
      const ref_file = ref(this.storage, path);
      uploadBytes(ref_file, blob).then((result) => {
        console.log(result.metadata.fullPath);
      });
    }
  }
}
