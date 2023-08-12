import { Address } from "./address";
import { Cconsommable } from "./consommable";
import { CIngredient } from "./ingredient";
import { Menu } from "./menu";

export class UserRestaurant {
    "proprietaire": string;
    "restaurants": Array<string>;
    constructor(prop:string, restaurants:Array<string>){
      this.proprietaire = prop;
      this.restaurants = restaurants;
    }
}


export interface UserRestaurantRole {
  "proprietaire": string;
  "restaurants": Array<Restaurant>;
}

export class Restaurant {
    "name":string | null;
    "id": string;
    "address": Address | null;
    "menus": Array<Menu> | null;
    "ingredients":Array<CIngredient> | null;
    "consommables":Array<Cconsommable> | null;

    constructor(address:Address | null){
      this.address = address;
      this.id = ""
      this.menus = []
    }

    getId(){
      return this.id
    }

    setId(id:string){
      this.id = id;
    }
    setRestaurant(data: Restaurant) {
      this.name = data.name;
      this.id = data.id;
      if(data.address !== null){
        this.address = new Address(data.address.postal_code, data.address.street_number, data.address.city, data.address.street); 
      }
      this.menus = data.menus;
      this.ingredients = data.ingredients;
      this.consommables = data.consommables;
    }
}