import { map } from "@firebase/util";
import { Restaurant } from "./restaurant";

export class User {
  public "name": string;
  public "email":string;
  public "id":string;
  public "proprietaire": string;
  public "restaurants": Array<Restaurant>;
  public "roles": Array<string>;
  public "is_prop": boolean;
  public "alertes": string;
  public "analyse": string;
  public "budget": string;
  public "facture": string;
  public "stock": string;
  public "planning": string;
  public "prev_aliments": string;
  public "time_work": string;

  constructor(){
    this.name = ""
    this.email = ""
    this.id = ""
    this.proprietaire = ""
    this. restaurants = [{
      adresse: "",
      id:""
    }]
    this.roles = []
    this.is_prop = false,
    this. alertes = "",
    this.analyse = "",
    this.budget = "",
    this.facture = "",
    this.stock = "",
    this.planning = "",
    this.prev_aliments = "",
    this.time_work = ""
  }

  remove_null(){
    this.alertes = (this.alertes === null) ? "" : this.alertes
    this.analyse = (this.analyse === null) ? "" : this.analyse
    this.budget = (this.budget === null) ? "" : this.budget
    this.planning = (this.planning === null) ? "" : this.planning
    this.stock = (this.stock === null) ? "" : this.stock
    this.facture = (this.facture === null) ? "" : this.facture
    this.email = (this.email === null) ? "" : this.email
    this.id = (this.id === null) ? "" : this.id
    this.name = (this.name === null) ? "" : this.name
    this.is_prop = (this.is_prop === null) ? false : this.is_prop
  }

  to_roles() {
    this.roles = []
    if (this.is_prop) {
      this.roles.push("proprietaire");
      return null;
    }
    if (this.stock.includes("r")) {
      if (this.stock.includes("w")) {
        this.roles.push("cuisinié");
      }
      else {
        this.roles.push("serveur");
      }
    }

    if (this.analyse.includes("r")) {
      if (this.analyse.includes("w")) {
        this.roles.push("prévisionniste");
      }
      else {
        this.roles.push("analyste");
      }
    }

    if (this.budget.includes("r")) {
      if (this.budget.includes("w")) {
        this.roles.push("economiste")
      }
      else {
        this.roles.push("economiste")
      }
    }

    if (this.facture.includes("r")) {
      if (this.facture.includes("w")) {
        this.roles.push("comptable +");
      }
      else {
        this.roles.push("comptable");
      }
    }

    if (this.planning.includes("w")) {
      this.roles.push("RH");
    }

    if(this.stock.includes("w") && this.planning.includes("w") &&
     this.facture.includes("w") && this.analyse.includes("w") &&
      this.budget.includes("w")) {
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
  public "is_prop": boolean;
  public "alertes": string;
  public "analyse": string;
  public "budget": string;
  public "facture": string;
  public "stock": string;
  public "planning": string;
  public "prev_aliments": string;
  public "time_work": string;

  restToString(restaurants: Array<Restaurant>){
    let restau = restaurants.map((restaurant) => restaurant.id)
    this.restaurants = restau.toString()
  }

  restToList(restaurants:string){
    return(restaurants.split(','))
  }
}