import { CommonService } from "../services/common/common.service";
import { Address } from "./address";
import { Restaurant } from "./restaurant";
import { Statut } from "./statut";
import { User } from "./user";
export class Employee {
    address:Address | null;
    current_restaurant:string | null;
    email:string;
    id:string;
    name:string | null;
    number:string | null;
    roles:Array<string> | null;
    service:{
        prise_service: null | number;
    }
    statut:Statut;
    surname:string | null;
    uid:string;
    user_id:string;
    [index:string]:any;

    constructor(email:string, statut:Statut, uid:string, private common_service: CommonService){
        this.user_id = "";
        this.email = email;
        this.statut = statut;
        this.uid = uid;
        this.surname = null;
        this.service = {
            prise_service: null
        };
        this.number = null;
        this.roles = null;
        this.name = null;
        this.id = "";
        this.address = null;
        this.current_restaurant = null;
    }
    /**
     * permet de récupérer les statut qui sont autoriser pour le droit
     * @param right droit qui peut être w (écriture) ou r(lecture) pour lequel nous voulons récupérer les statuts
     * @returns liste de statuts 
    */
    getStatus(right:string):string[]{
        let status = []
        for(let key in this.statut){
          const role = this.statut[key as keyof typeof this.statut] as string
            if(typeof role === "string"){
              if(role.includes(right)) status.push(key) 
            } 
          }
          return status
      }
    /**
     * Cette fonction permet d'attribuer un droit à un ensemble de status
     * @param status liste des statut auxquels nous souhaitons attribuer un droit
     * @param right droit à attribuer pour cette ensemble de statut
     */
    setStatus(status:string[], right:string){
        let roles = this.common_service.getStatut();
        roles.forEach((role) => {
          if(role === 'propriétaire'){
            if(status.includes('propriétaire')){
              this.roles?.push("propriétaire");
            } 
            else{
              this.roles?.push("propriétaire");
            }
          }
          else{
            if(this.statut !== null){
              let u_role = this.statut[role];
              if(status.includes(role)){
                if(typeof u_role === 'string'){
                  if(!u_role.includes('r')){
                    if(right === 'r') u_role = u_role + 'r'
                  }
                  if(!u_role.includes('w')){
                    if(right === 'w') u_role = u_role + 'w'
                  }
                }
              }
              else{
                if(typeof u_role === 'string'){
                  if(u_role.includes('r')){
                    if(right === 'r') u_role = u_role.replace('r', '')
                  }
                  if(u_role.includes('w')){
                    if(right === 'w') u_role = u_role.replace('w', '')
                  }
                }
              }
              this.statut[role] = u_role;
            }
          }
        })   
    }
    /**
     * permet de récupérer les status d'un employée et de les ajouter à cette instance d'employee
     * @param user employee d'un restaurant
     */
    setStatusFromUser(user:Employee){
        this.statut = Object.assign({}, user.statut)
    }
    
    /**
     * Supprime les status null et les remplaces par une chaine de caractère vide
     */
    remove_null(){
        for(let status of this.common_service.getStatut()){
          this.statut[status] = "";
        }
    }
    /**
     * Permet de récupérer une instance d'employé sous la forme d'un JSON
     * @returns un JSON qui représente l'employée
     */
    getData(): any {

       let address = null;
       if(this.address !== null){
        address = {
          postal_code: this.address.postal_code,
          street_number: this.address.street_number,
          city: this.address.city,
          street: this.address.street
        }
       }
       return {
          current_restaurant: this.current_restaurant,
          email: this.email,
          name: this.name,
          number: this.number,
          roles: this.roles,
          service: this.service,
          surname: this.surname,
          uid: this.uid,
          user_id: this.user_id
         }
    }
    /**
      * permet de copier un JSON employee dans une instance de la classe employée
      * @param employee employée à copier dans une instance de la classe
    */
    setData(employee: Employee) {
        let statut = new Statut(this.common_service);
        statut.setData(employee.statut);
        let address = null;
        new Statut(this.common_service);
        if(employee.address !== null){
          address =  new Address(
            employee.address.postal_code,
            employee.address.street_number,
            employee.address.city,
            employee.address.street);
        }
        this.email = employee.email;
        this.id = employee.id;
        this.current_restaurant = employee.current_restaurant;
        this.name = employee.name;
        this.number = employee.number;
        this.roles = employee.roles;
        this.surname = employee.surname;
        this.uid = employee.uid;
        this.user_id = employee.user_id;
        this.address = address;  
        this.statut = statut
    }
    to_roles() {
      let statut = new Statut(this.common_service);
      statut.setData(this.statut);
      if(this.roles !== null && this.roles !== undefined){
        this.roles = statut.getRoles(this.roles.includes("propriétaire"));
      }
      else{
        this.roles = statut.getRoles(false);
      }
  }
}
export class EmployeeFull extends Employee{
  proprietaire:string = "";
  restaurants: Array<Restaurant> = [];
  /**
   * Permet de filtrer à partir d'une liste d'identifiant des restaurants de
   * l'employé parmit tout les restaurants uniquement les restauarants dont
   * l'utilisateur à les droits d'accès 
   * @param user eployée ou client de l'enseigne
   * @param restaurants etout les restaurants de l'enseigne
   */
  getAllRestaurant(user:User, restaurants:Array<Restaurant>){
    this.restaurants = [];
    if(user.related_restaurants !== null){
     const restaurants_ids =  user.related_restaurants.map((restaurant) => restaurant.restaurant_id);
     this.restaurants = restaurants.filter((restaurant) => restaurants_ids.includes(restaurant.id))
    }
  }
  /**
   * permet d'initialiser la classe employée dont hérite la classe employee full
   * @param employee employé du restaurant
   */
  setEmployee(employee:Employee){
    super.address = employee.address;
    super.current_restaurant = employee.current_restaurant;
    super.id = employee.id;
    super.name = employee.name;
    super.number = employee.number;
    super.roles = employee.roles;
    super.statut = employee.statut;
    super.service = employee.service;
    super.surname = employee.surname;
    super.user_id = employee.user_id;
  }
  /**
   * permet de récupérer l'ensemble des identifiants des restaurants auxquel appartient l'employé 
   * @returns {Array<Restaurant>} liste de restaurants
   */
  getRestaurantsIds(){
    return this.restaurants.map((restaurant) => restaurant.id);
  }
  /**
   * permet de récupérer une liste d'objets contenant l'identifiant du propriétaire et du restaurant
   * @returns {Array<{proprietaire_id:string, restaurant_id:string}>} liste d'objets
   */
  getRestaurantsProp(){
    return this.restaurants.map((restaurant) => {
      return {
        proprietaire_id: this.proprietaire,
        restaurant_id: restaurant.id
      }
    })
  }
}