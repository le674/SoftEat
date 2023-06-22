import { Restaurant } from "./restaurant";

export class User {
  public "email":string;
  public "id":string | null;
  public "related_restaurants": Array<{
      proprietaire_id:string,
      restaurant_id:string
    
  }> | null;
  public "uid":string;
  public "is_employee":boolean;

  constructor(){
  }
}

export class ShortUser {
  public "name": string;
  public "email":string;
  public "id":string;
  public "proprietaire": string;
  public "restaurants": string;
  public "roles": string;
  public "row_roles":string;
  public "is_prop": boolean;
  public "alertes": string;
  public "analyse": string;
  public "budget": string;
  public "facture": string;
  public "stock": string;
  public "planning": string;
  public "prev_aliments": string;
  public "time_work": string;
  public "numero": string

  restToString(restaurants: Array<Restaurant>){
    let restau = restaurants.map((restaurant) => restaurant.id)
    this.restaurants = restau.toString()
  }

  restToList(restaurants:string){
    return restaurants.split(',')
  }

  rolesToString(roles:string[]){
    this.row_roles= roles.toString()
  }

}