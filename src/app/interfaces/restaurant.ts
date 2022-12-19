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

    constructor(){
      this.adresse = ""
      this.id = ""
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