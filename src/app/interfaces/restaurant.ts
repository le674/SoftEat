import { Address } from "./address";
import { CIngredient, Cconsommable } from "./ingredient";
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
}