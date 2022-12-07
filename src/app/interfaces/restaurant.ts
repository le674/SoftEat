export interface UserRestaurant {
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
}