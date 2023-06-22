import { Address } from "./address";
import { Restaurant } from "./restaurant";
import { Statut } from "./statut";

export class Employee {
    address:Address | null;
    current_restaurant:string | null;
    email:string;
    id:string | null;
    name:string | null;
    number:string | null;
    roles:Array<string> | null;
    service:{
        prise_service: null | number;
    }
    statut:Statut;
    surname:string | null;
    uid:string;

    constructor(email:string, statut:Statut, uid:string){
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
        this.id = null;
        this.address = null;
        this.current_restaurant = null;
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
              this.roles?.push("propriétaire");
            } 
            else{
              this.roles?.push("propriétaire");
            }
          }
          else{
            if(this.statut !== null){
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
              if(role === "stock" && typeof u_role != "boolean") this.statut.stock = u_role;
              if(role === "analyse" && typeof u_role != "boolean") this.statut.analyse = u_role;
              if(role === "budget" && typeof u_role != "boolean") this.statut.budget = u_role;
              if(role === "facture" && typeof u_role != "boolean") this.statut.facture = u_role;
              if(role === "planning" && typeof u_role != "boolean") this.statut.planning = u_role;
            }
          }
        })   
      }
    
      setStatusFromUser(user:Employee){
        this.statut = Object.assign({}, user.statut)
      }
    
    
      remove_null(){
        this.statut = {
          analyse: "",
          budget: "",
          facture: "",
          stock: "",
          planning: "",
          is_prop:false
        }
      }
    
    
      to_roles() {
        this.roles = []
        if(this.statut !== null){
          if(this.statut.is_prop) {
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
        }
        return null;
      }
}