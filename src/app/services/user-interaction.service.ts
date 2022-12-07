import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { child, get, getDatabase, ref } from 'firebase/database';
import { User } from '../interfaces/user';
import { FirebaseApp } from "@angular/fire/app";
import { Proprietaire } from '../interfaces/proprietaire';

@Injectable({
  providedIn: 'root'
})
export class UserInteractionService{
  private db: any;
  private uid!: string;
  private proprietary!: string;
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
  }
  async getAllIdFromProp(prop:string){
    const ref_db = ref(this.db);
    await get(child(ref_db, `Users/${prop}/`)).then((users) => {
      this.prop_list.proprietaire = prop
      users.forEach((user) => {
          let add_user = new User()
          add_user.id = (user.key === null)? '' : user.key
          add_user.email = user.val().email
          add_user.restaurants = user.child('restaurant').val()
          add_user.alertes = user.child('statut/alertes').val()
          add_user.analyse = user.child('statut/analyse').val()
          add_user.budget = user.child('statut/budget').val()
          add_user.facture = user.child('statut/factures').val()
          add_user.is_prop = user.child('statut/is_prop').val()
          add_user.planning = user.child('statut/rh').val()
          add_user.stock = user.child('statut/stock').val()
          add_user.remove_null()
          add_user.to_roles()
          this.prop_list.employee.push(add_user)
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
}
