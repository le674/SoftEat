import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import {Router} from '@angular/router';
import { stringLength } from '@firebase/util';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { InteractionRestaurantService } from './interaction-restaurant.service';


@Component({
  selector: 'app-app.autho',
  templateUrl: './app.autho.component.html',
  styleUrls: ['./app.autho.component.css']
})
export class AppAuthoComponent implements OnInit {

  private uid: string;
  public proprietaire: string;
  public restaurants: [{
        adresse: string;
        id: string;
    }];

  constructor(private service : InteractionRestaurantService, private ofApp: FirebaseApp, private router: Router) {   
      this.uid = "";
      this.proprietaire = "";
      this.restaurants = [{
        "adresse": "",
        "id": ""
      }];
  }

  ngOnInit(): void {
    const auth = getAuth(this.ofApp);
      onAuthStateChanged(auth, (user) => {
        if(user){
          console.log("utilisateur inscrit");
          this.uid = user.uid;
          this.service.getRestaurantsProprietaireFromUser(this.uid).then((restaurant) => {
            this.proprietaire =  restaurant.proprietaire;
            this.restaurants = restaurant.restaurant;
            console.log(restaurant.restaurant.forEach((resto) => {
              console.log(resto.adresse);  
            }));
            
          });
        }
        else{
          console.log("pas d'autentification");
           //renvoyer la personne vers la page d'authentification
          this.router.navigate(["./accueil"])
        }   
      })
  }

  clicdeConnexion(){
    const auth = getAuth(this.ofApp);
    auth.signOut(); 
    window.location.reload();
  }
}

