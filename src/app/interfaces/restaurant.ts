import { Address } from "./address";
import { Cconsommable } from "./consommable";
import { CIngredient } from "./ingredient";
import { InteractionBddFirestore } from "./interaction_bdd";
import { Cmenu } from "./menu";

export class UserRestaurant {
  "proprietaire": string;
  "restaurants": Array<string>;
  constructor(prop: string, restaurants: Array<string>) {
    this.proprietaire = prop;
    this.restaurants = restaurants;
  }
}


export interface UserRestaurantRole {
  "proprietaire": string;
  "restaurants": Array<Restaurant>;
}

export class Restaurant implements InteractionBddFirestore {
  "name": string | null;
  "id": string;
  "address": Address | null;
  "proprietary_id": string;
  [index:string]:any;

  constructor(address: Address | null) {
    this.address = address;
    this.id = ""
    this.proprietary_id = "";
  }
  /**
   * Permet de copier un restaurant dans cet instance de restaurant
   * @param restaurant données du restaurant à copier dans cett instance de restaurant 
   */
  setData(restaurant: Restaurant) {
    let address = null;
    if (restaurant.address !== null) {
      address = new Address(restaurant.address.postal_code, restaurant.address.street_number, restaurant.address.city, restaurant.address.street);
    }
    this.id = restaurant.id;
    this.name = restaurant.name;
    this.address = address;
    this.proprietary_id = restaurant.proprietary_id;
  }
  /**
   * Récupération d'un objet restaurant
   * @returns {Object} objet restaurant
   */
  getData(id: string | null, attrs: Array<string> | null, ...args: any[]) {
    let address = null;
    let _attrs = Object.keys(this);
    let object: { [index: string]: any } = {};
    if (this.address !== null) {
      address = this.address.getData(null, null);
    }
    if (id) {
      this.id = id;
    }
    if (attrs) {
      _attrs = attrs
    }
    for (let attr of _attrs) {
      if(attr !== "address"){
        object[attr] = this[attr];
      }
      else{
        object[attr] = address;
      }
    }
    return object;
  }
  /**
   * Cette fonction permet de retourner une nouvelle instance de restaurant copie de celle-ci
   * @returns permet de retourner une instance de restaurant
   */
  getInstance(): InteractionBddFirestore {
    return new Restaurant(this.address);
  }
  public static getPathsToFirestore(proprietary_id: string): string[] {
    return ["proprietaires", proprietary_id, "restaurants"]
  }
}