import { map } from "@firebase/util";
import { Restaurant } from "./restaurant";
import { Statut } from "./statut";

export class User {
  public "name": string;
  public "surname": string;
  public "email":string;
  public "id":string;
  public "proprietaire": string;
  public "restaurants": Array<Restaurant>;
  public "statut": {
    alertes?:string,
    stock?:string,
    analyse?:string,
    budget?:string,
    facture?:string,
    planning?:string
  };
  public "is_prop": boolean;
  public "roles": Array<string>;
  public "prev_aliments": string;
  public "time_work": string;
  public "numero": string;

  constructor(){
    this.name = ""
    this.email = ""
    this.surname = ""
    this.id = ""
    this.proprietaire = ""
    this.restaurants = []
    this.roles = []
    this.prev_aliments = "",
    this.time_work = "",
    this.numero = ""
    this.is_prop = false
    this.statut = Object.assign({"alertes": ""},{"stock": ""},
     {"analyse": ""}, {"budget": ""},{ "facture": ""}, {"planning": ""})
  }

  getStatus(right:string):string[]{
    let status = []
    let roles = ["proprietaire", "stock", "alertes", "analyse", "budget", "facture", "planning"];
    for(let key in this.statut){
      if(key === "is_prop"){
        status.push('proprietaire')
      } 
      else{
         const role = this.statut[key as keyof typeof this.statut] as string
          if(typeof role === "string"){
            if(role.includes(right)) status.push(key) 
          }  
        }
      }
      return status
    }

  setStatus(status:string[], right:string){
    let roles = ["proprietaire", "stock", "alertes", "analyse", "budget", "facture", "planning"];

    roles.forEach((role) => {
      if(role === 'proprietaire'){
        if(status.includes('proprietaire')){
          this.is_prop = true;
        } 
        else{
          this.is_prop = false;
        }
      }
      else{
        let u_role = (this.statut[role as keyof typeof this.statut] == undefined) ? "" : this.statut[role as keyof typeof this.statut]
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
        this.statut[role as keyof typeof this.statut] = u_role
      }
    })   
  }

  setStatusFromUser(user:User){
    for(let key in this.statut){
      this.statut[key as keyof typeof this.statut] = user.statut[key as keyof typeof this.statut]
    }
  }


  remove_null(){
    this.is_prop = false
    this.statut = {
      analyse: "",
      budget: "",
      facture: "",
      stock: "",
      planning: "",
      alertes: ""
    }
  }


  to_roles() {
    this.roles = []
    if(this.is_prop) {
      this.roles.push("proprietaire");
      return null;
    }
  
    if (this.statut.stock?.includes("r")) {
      if (this.statut.stock?.includes("w")) {
        this.roles.push("cuisinié");
      }
      else {
        this.roles.push("serveur");
      }
    }

    if (this.statut.analyse?.includes("r")) {
      if (this.statut.analyse?.includes("w")) {
        this.roles.push("prévisionniste");
      }
      else {
        this.roles.push("analyste");
      }
    }

    if (this.statut.budget?.includes("r")) {
      if (this.statut.budget?.includes("w")) {
        this.roles.push("economiste")
      }
      else {
        this.roles.push("economiste")
      }
    }

    if (this.statut.facture?.includes("r")) {
      if (this.statut.facture?.includes("w")) {
        this.roles.push("comptable +");
      }
      else {
        this.roles.push("comptable");
      }
    }

    if (this.statut.planning?.includes("w")) {
      this.roles.push("RH");
    }

    if(this.statut.stock?.includes("w") && this.statut.planning?.includes("w") &&
    this.statut.facture?.includes("w") && this.statut.analyse?.includes("w") &&
    this.statut.budget?.includes("w")) {
      this.roles = ["gérant"];
    }

    return null;
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