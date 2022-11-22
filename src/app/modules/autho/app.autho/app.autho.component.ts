import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
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

  constructor(private service : InteractionRestaurantService, private ofApp: FirebaseApp) {   
      this.uid = "";
      this.proprietaire = "";
  }

  ngOnInit(): void {
    const auth = getAuth(this.ofApp);
    onAuthStateChanged(auth, (user) => {
      if(user){
        console.log("utilisateur inscrit");
        this.uid = user.uid;
        let restaurants = this.service.getRestaurantsProprietaireFromUser(this.uid);
        this.proprietaire = restaurants["proprietaire" as keyof typeof restaurants];
      }
      else{
        console.log("pas d'autentification");
        //renvoyer la personne vers la page d'authentification
      }   
    })
  }

}
