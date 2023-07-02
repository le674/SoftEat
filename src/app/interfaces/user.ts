import { Employee } from "./employee";
import { Restaurant } from "./restaurant";

export class User {
  public "email":string;
  public "id":string | null;
  public "proprietary_id":string | null
  public "related_restaurants": Array<{
      proprietaire_id:string,
      restaurant_id:string
    
  }> | null;
  public "uid":string;
  public "id_employee":string | null;

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
    let restau = restaurants.map((restaurant) => restaurant.name)
    this.restaurants = restau.toString()
  }

  restToList(){
    return this.restaurants.split(',')
  }

  rolesToString(roles:string[]){
    this.row_roles= roles.toString()
  }
  rolesToList(){
    return this.roles.split(',');
  }
  setRowUser(employee:Employee, roles:(string | string[])[], restaurants:Array<Restaurant>){
    if(employee.id !== null) this.id = employee.id;
    this.email = employee.email;
    this.row_roles = roles.toString();
    this.restToString(restaurants);
  }
}