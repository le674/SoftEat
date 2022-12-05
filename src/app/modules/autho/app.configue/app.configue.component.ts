import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FirebaseApp } from '@angular/fire/app';
import {Router} from '@angular/router';
import { User } from 'src/app/interfaces/user';
import {MatTableDataSource} from '@angular/material/table';
import { InteractionRestaurantService } from '../app.autho/interaction-restaurant.service';
import { UserInteractionService } from 'src/app/services/user-interaction.service';
import { Proprietaire } from 'src/app/interfaces/proprietaire';


@Component({
  selector: 'app-app.configue',
  templateUrl: './app.configue.component.html',
  styleUrls: ['./app.configue.component.css']
})
export class AppConfigueComponent implements OnInit {
  public users: Array<Proprietaire>;
  private uid: string;
  public display_columns: string[] = ["email", "restaurants","statut", "analyse", "budget", "facture", "stock", "planning"];


  public visibles: {
    index_1:boolean,
    index_2:boolean,
    index_3:boolean,
    index_4:boolean,
    index_5:boolean,
    index_6:boolean,
    index_7:boolean
  };
  constructor(private service : InteractionRestaurantService,private user_services : UserInteractionService,
    private ofApp: FirebaseApp,private router: Router) { 
    this.visibles = {index_1: true, index_2: true, index_3: true, index_4:true, index_5:true, index_6:true, index_7:true};
    this.users = [];
    this.uid = "";
  }

  ngOnInit(): void {
    const auth = getAuth(this.ofApp);
    onAuthStateChanged(auth, (user) =>{
      if(user){
        this.user_services.getAllIdFromProp().then((props) => {
          this.user_services.getProprietaireFromUsers(user.uid).then((name:string) => {
            this.users = props.filter(proprio => (proprio.proprietaire === name))
          })
        })
      }
    })
  }
  
  clicdeConnexion(){
    const auth = getAuth(this.ofApp);
    auth.signOut(); 
    window.location.reload();
  }

  clicAcceuil(){
    this.router.navigate(['']);
  }

  changeArrow(arrow_index:number){
    if((this.visibles.index_1 === true) && (arrow_index === 1)){
      this.visibles.index_1 = false;
    }
    else{
      this.visibles.index_1 = true;
    }
    
    if(this.visibles.index_2 === true && (arrow_index === 2)){
      this.visibles.index_2 = false;
    }
    else{
      this.visibles.index_2 = true;
    }

    if(this.visibles.index_3 === true && (arrow_index === 3)){
      this.visibles.index_3 = false;
    }
    else{
      this.visibles.index_3 = true;
    }

    if(this.visibles.index_4 === true && (arrow_index === 4)){
      this.visibles.index_4 = false;
    }
    else{
      this.visibles.index_4 = true;
    }

    if(this.visibles.index_5 === true && (arrow_index === 5)){
      this.visibles.index_5 = false;
    }
    else{
      this.visibles.index_5 = true;
    }

    if(this.visibles.index_6 === true && (arrow_index === 6)){
      this.visibles.index_6 = false;
    }
    else{
      this.visibles.index_6 = true;
    }

    if(this.visibles.index_7 === true && (arrow_index === 7)){
      this.visibles.index_7 = false;
    }
    else{
      this.visibles.index_7 = true;
    }
    console.log("test");
  }
}
function getProprietaireFromUsers(uid: string) {
  throw new Error('Function not implemented.');
}

