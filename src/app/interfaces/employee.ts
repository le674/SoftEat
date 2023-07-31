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
    user_uid:string;
    [index:string]:any;

    constructor(email:string, statut:Statut, uid:string, private common_service: CommonService){
        this.user_uid = "";
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
    getStatus(right:string):string[]{
        let status = []
        let roles = ["stock", "analyse", "budget", "facture", "planning"];
        for(let key in this.statut){
          const role = this.statut[key as keyof typeof this.statut] as string
          if(typeof role === "string"){
            if(role.includes(right)) status.push(key) 
          } 
          }
          return status
      }
    
      setStatus(status:string[], right:string){
        let roles = this.common_service.getStatut();
        let _roles =  new Array();
        _roles.push(this.statut.analyse);
        _roles.push(this.statut.budget);
        _roles.push(this.statut.facture);
        _roles.push(this.statut.planning);
        _roles.push(this.statut.stock);
        
        roles.forEach((role, index) => {
          if(role === 'proprietaire'){
            if(status.includes('proprietaire')){
              this.roles?.push("propriétaire");
            } 
            else{
              this.roles?.push("propriétaire");
            }
          }
          else{
            if(this.statut !== null){
              let u_role = _roles[index];
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
              if(role === "analyse") this.statut.analyse = u_role;
              if(role === "budget") this.statut.budget = u_role;
              if(role === "facture") this.statut.facture = u_role;
              if(role === "planning") this.statut.planning = u_role;
              if(role === "stock") this.statut.stock = u_role;
            }
          }
        })   
      }
    
      setStatusFromUser(user:Employee){
        this.statut = Object.assign({}, user.statut)
      }
    
    
      remove_null(){
        this.statut.analyse = "";
        this.statut.budget = "";
        this.statut.facture = "";
        this.statut.stock = "";
        this.statut.planning = "";
      }
    
    
      to_roles() {
        let statut = new Statut(this.common_service);
        statut.setStatut(this.statut);
        this.roles = statut.getRoles();
      }
      
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
          user_uid: this.user_uid
         }
      }
      /**
       * permet de copier un JSON employee dans une instance de la classe employée
       * @param employee employée à copier dans une instance de la classe
       */
      setData(employee: Employee) {
        let statut = new Statut(this.common_service);
        statut.setStatut(employee.statut);
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
        this.user_uid = employee.user_uid;
        this.address = address;  
        this.statut = statut
      }
}

export class EmployeeFull extends Employee{
  proprietaire:string = "";
  restaurants: Array<Restaurant> = [];
  getAllRestaurant(user:User, restaurants:Array<Restaurant>){
    this.restaurants = [];
    if(user.related_restaurants !== null){
     const restaurants_ids =  user.related_restaurants.map((restaurant) => restaurant.restaurant_id);
     this.restaurants = restaurants.filter((restaurant) => restaurants_ids.includes(restaurant.id))
    }
  }
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
    super.user_uid = employee.user_uid;
  }
  getRestaurantsIds(){
    return this.restaurants.map((restaurant) => restaurant.id);
  }
  getRestaurantsProp(){
    return this.restaurants.map((restaurant) => {
      return {
        proprietaire_id: this.proprietaire,
        restaurant_id: restaurant.id
      }
    })
  }
}