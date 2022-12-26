import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { child, get, getDatabase, push, ref, set, update } from 'firebase/database';
import { User } from '../interfaces/user';
import { FirebaseApp } from "@angular/fire/app";
import { Proprietaire } from '../interfaces/proprietaire';
import { Restaurant } from '../interfaces/restaurant';

@Injectable({
  providedIn: 'root'
})
export class UserInteractionService{
  private db: any;
  private uid: string;
  private proprietary: string;
  private prop_list: Proprietaire;
  private user: User;
  private count;

  constructor(private ofApp: FirebaseApp){
    this.prop_list = {
      proprietaire: "",
      employee : []
    }
    this.db = getDatabase(ofApp);
    this.user = new User();
    this.count = 0;
    this.proprietary = "";
    this.uid = ""

  }
  async getAllIdFromProp(prop:string){
    const ref_db = ref(this.db);
    await get(child(ref_db, `Users/${prop}/`)).then((users) => {
      this.prop_list.proprietaire = prop
      users.forEach((user) => {
          let add_user = new User();
          add_user.surname = user.val().surname;
          add_user.name = user.val().name;
          add_user.id = (user.key === null)? '' : user.key;
          add_user.email = user.val().email;
          add_user.numero = user.val().number;
          user.child('restaurant').forEach((restaurant: any) => {
            let tmp_restaurant = new Restaurant();
            tmp_restaurant.id = restaurant.val().id;
            add_user.restaurants.push(tmp_restaurant);
          })
          add_user.statut.alertes = user.child("statut/alertes").val();
          add_user.statut.analyse = user.child("statut/analyse").val();
          add_user.statut.budget = user.child("statut/budget").val();
          add_user.statut.facture = user.child("statut/facture").val();
          add_user.statut.stock = user.child("statut/stock").val();
          add_user.statut.planning = user.child("statut/planning").val();
          add_user.is_prop = user.child(`statut/is_prop`).val();
          add_user.to_roles();
          this.prop_list.employee.push(add_user);
        })
     })
     return(this.prop_list)  
  }

  async getProprietaireFromUsers(uid:string){
      const ref_db = ref(this.db);
      
      await get(child(ref_db, `Users/${uid}`)).then((user : any) => {
        if(user.exists()){
          this.user.proprietaire = user.val().proprietaire;
        }
        else{
          console.log("pas de proprietaire pour cette identifiant");
          
        }
      }).catch((error) => {
        console.log(error);  
      })
      return(this.user.proprietaire);
  }

  async getUserFromUid(uid:string, prop:string){
    this.user = new User()
    const ref_db = ref(this.db, `Users/${prop}/${uid}`);
    await get(ref_db).then((user : any) => {
      if(user.exists()){
        this.user.id = uid;
        this.user.email = user.val().email;
        this.user.numero = user.val().number;
        this.user.surname = user.val().surname;
        this.user.name = user.val().name;
        user.child('restaurant').forEach((restaurant: any) => {
            let tmp_restaurant = new Restaurant()
            tmp_restaurant.id = restaurant.val().id
            this.user.restaurants.push(tmp_restaurant)
          });
        // on supprime le premer utilisateur lié à la création de User
        this.user.restaurants.shift();
        
        this.user.statut.alertes = user.child("statut/alertes").val();
        this.user.statut.analyse = user.child("statut/analyse").val();
        this.user.statut.budget = user.child("statut/budget").val();
        this.user.statut.facture = user.child("statut/facture").val();
        this.user.statut.stock = user.child("statut/stock").val();
        this.user.statut.planning = user.child("statut/planning").val();
        this.user.is_prop = user.child(`statut/is_prop`).val();
        this.user.to_roles();
      }
    })
    return this.user
  }
  async setUser(prop:string, user:User){
    const ref_db = ref(this.db, `Users/${prop}/${user.id}`);
    await update(ref_db, {
      "/statut/": user.statut,
      "/restaurant/": user.restaurants
    })
  }
  async updateEmail(prop:string, user_uid:string, email:string){
    const ref_db = ref(this.db, `Users`);
    await update(ref_db, {
      [`/${prop}/${user_uid}/email/`]: email,
      [`/${user_uid}/email/`]: email
    })
  }

  async updateNumber(prop:string, user_uid:string, new_number:string){
    const ref_db = ref(this.db, `Users/${prop}/${user_uid}/number/`);
    await set(ref_db, new_number)
  }

}
