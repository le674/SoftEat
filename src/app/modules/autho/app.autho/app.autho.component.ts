import { transition } from '@angular/animations';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('widgetsContent') public widgetsContent!: ElementRef;

  private uid: string;
  private screen_width: any;
  public proprietaire: string;
  public restaurants: [{
        adresse: string;
        id: string;
    }];

  constructor(private service : InteractionRestaurantService, private ofApp: FirebaseApp, private router: Router){   
      this.uid = "";
      this.proprietaire = "";
      this.screen_width = window.innerWidth;
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

  scrollRight(){
    let nbr_restaurants = this.restaurants.length
    console.log("nombre de resto " + nbr_restaurants);
    console.log("taille de l'écran" + this.screen_width);
    console.log("le padding est de " + this.screen_width/nbr_restaurants);
    
    
    this.widgetsContent.nativeElement.scrollLeft += this.screen_width/nbr_restaurants;
    
    
  }

  scrollLeft(){
    let nbr_restaurants = this.restaurants.length
    this.widgetsContent.nativeElement.scrollLeft -= this.screen_width/nbr_restaurants;
  }
}

