import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { child, get, ref } from 'firebase/database';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserInteractionService {
  private db: any;
  private uid!: string;
  private proprietary!: string;
  private user!: {
    email: string;
    proprietaire: string;
  };
  private prop:string

  constructor(){
    this.prop = "";
  }

  async getProprietaireFromUsers(uid:string){
      console.log("récupération d tout les utilisateurs");
      console.log(`récupération des donées vers 'Users/foodandboost_prop/${uid}/'`);
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
