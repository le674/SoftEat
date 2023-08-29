import { Employee } from "./employee";
import { InteractionBddFirestore } from "./interaction_bdd";
import { Restaurant } from "./restaurant";

export class User implements InteractionBddFirestore {
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
  /**
     * chemin vers l'ensemble des utilisateurs de l'application
  */
  public static getPathsToFirestore(): string[] {
      return ["clients"]
  }
  /**
   * Cette fonction permet de copier un json de la base de donnée à une instance actueld de user
   * @param user user récupéré depuis la bdd à ajouter à l'instance actuel
   */
  public setData(user:User) {
    this.email = user.email;
    this.id = user.id;
    this.id_employee = user.id_employee;
    this.proprietary_id = user.proprietary_id;
    this.related_restaurants = user.related_restaurants;
    this.uid = user.uid;
  }
  public getData(id: string | null) {
    if(id){
      this.id = id;
    }
   return {
    email: this.email,
    id: this.id,
    proprietary_id: this.proprietary_id,
    related_restaurants: this.related_restaurants,
    uid: this.uid,
    id_employee: this.id_employee
   };
  }
  getInstance(): InteractionBddFirestore {
    return new User();
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
