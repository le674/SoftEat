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
  private prop_list: Array<Proprietaire>;
  private user: User;


  constructor(private ofApp: FirebaseApp){
    this.prop_list = []
    this.db = getDatabase(ofApp);
    this.user = new User();
  }
  async getAllIdFromProp(){
    const ref_db = ref(this.db);
    await get(child(ref_db, `Users/`)).then((users) => {
      let count = 0
      users.forEach((user) => {
        this.prop_list.forEach((prop) => {
          if(prop.proprietaire === user.val().proprietaire){
            let new_user = new User()
            new_user.email = user.val().email
            new_user.name = ''
            new_user.id = (user.key === null) ? "" : user.key
          }
          else{
            count = count++
          }
        })
        if(count == (this.prop_list.length + 1)){
          let new_user = new User()
          new_user.id = (user.key === null) ? "" : user.key 
          new_user.email = user.val().email
          let prop:Proprietaire = {
            proprietaire: user.val().proprietaire,
            employee: [new_user]
          };   
          this.prop_list.push(prop)
        }
      })
    })
    return(this.prop_list)
  }

  async getProprietaireFromUsers(uid:string){
      const ref_db = ref(this.db);
      await get(child(ref_db, `Users/${uid}`)).then((user : any) => {
        if(user.exists()){
          this.user.proprietaire = user.proprietaire;
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
