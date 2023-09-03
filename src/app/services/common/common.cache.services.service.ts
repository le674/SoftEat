import { Injectable } from '@angular/core';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { User } from 'src/app/interfaces/user';
import { FirebaseService } from '../firebase.service';
import { Condition, InteractionBddFirestore } from 'src/app/interfaces/interaction_bdd';
import { Subject } from 'rxjs';
type Class<T> = new (...args: any[]) => T;
@Injectable({
  providedIn: 'root'
})
export class CommonCacheServices {
  private user: User | null
  private restaurants: Array<Restaurant> | null;
  private proprietary_id: string | null;
  constructor(private service: FirebaseService) {
    this.restaurants = null;
    this.proprietary_id = null;
    this.user = null;
  }
  getRestaurants() {
    return this.restaurants;
  }
  setRestaurants(restaurants: Array<Restaurant>) {
    this.restaurants = restaurants;
  }
  getProprietary() {
    return this.proprietary_id;
  }
  setProprietary(proprietary_id: string) {
    this.proprietary_id = proprietary_id;
  }
  getUser() {
    return this.user;
  }
  setUser(user: User) {
    this.user = user;
  }
/**
 * récupération de l'ensemble des objet qui pointe vers le chemin pour l'accès en base de donnée ou dans le local storage si la donnée est présente dedans
 * nous récupérons avec cette fonciton soit un objet InteractionBddFirestore ou une liste d'objet InteractionBddFirestore
 * @param class_instance instance de la classe de l'objet à récupérer dans la base de donnée
 * @param key clef de l'objet dans le local storage
* @returns 
*/
public async getFromFirestoreLocalStorage(class_instance: Class<InteractionBddFirestore>,key: string) {
    let subject = new Subject<InteractionBddFirestore[]>();
    let array_object: Array<InteractionBddFirestore> = [];
    let object = null;
    const str_object = localStorage.getItem(key);
    //on regarde si l'objet existe dans le local storage
    if (str_object) {
      //nous essayons de voir si l'objet est une chaine de caractère/numérique ou bien un json/liste de json 
      object = JSON.parse(str_object);
      if (object.length > 0) {
        // si c'est une liste de json nous incrémentons et retournons la liste sous forme de liste d'objet
        let objects = object as Array<InteractionBddFirestore>;
        objects.forEach((_object) => {
          let instance = this.service.constructInstance(class_instance).setData(_object) as InteractionBddFirestore;
          array_object.push(instance);
        })
        subject.next(array_object);
      }
      else {
        //sinon nous retournons le json sous form d'objet
        let instance = this.service.constructInstance(class_instance).setData(object) as InteractionBddFirestore;
        array_object.push(instance);
      }
      return  array_object;
    }
    return null
  }
  /**
   * Ajout dans le local storage de donnée
   * @param bdd_obj liste d'objet à ajouter au local storage
   * @param key clef de la liste d'objet ajouté dans le local storage
   */
  public async setToLocalStorage(bdd_obj:Array<InteractionBddFirestore>, key:string){
    let all_objects:Array<any> = [];
    bdd_obj.forEach((obj) => {
      let _object = obj.getData(null);
      all_objects.push(_object);
    });
    localStorage.setItem(key,JSON.stringify(all_objects)) 
  }
}