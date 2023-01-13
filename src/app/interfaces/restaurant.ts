import { Menu } from "./menu";

export interface UserRestaurant {
    "proprietaire": string;
    "restaurants": Array<Restaurant>;
}


export interface UserRestaurantRole {
  "proprietaire": string;
  "restaurants": Array<Restaurant>;
}

export class Restaurant {
    "id": string;
    "adresse": string
    "menus": Array<Menu>

    constructor(){
      this.adresse = ""
      this.id = ""
      this.menus = []
    }

    getId(){
      return this.id
    }

    setId(id:string){
      this.id = id;
    }

    setAdress(adresse:string){
      this.adresse = adresse
    }

    getAdress(){  
      return this.adresse
    }
}