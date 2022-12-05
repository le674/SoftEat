import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AppModalComponent } from '../app.configue/app.modal/app.modal.component';
import { InteractionRestaurantService } from './interaction-restaurant.service';
import {UserInteractionService} from 'src/app/services/user-interaction.service'

@Component({
  selector: 'app-app.autho',
  templateUrl: './app.autho.component.html',
  styleUrls: ['./app.autho.component.css']
})
export class AppAuthoComponent implements OnInit {
  @ViewChild('widgetsContent') public widgetsContent!: ElementRef;

  private readonly screen_width: any;
  private uid: string;
  public proprietaire: string;
  public restaurants_only: [{
        adresse: string,
        id: string
    }];

  constructor(private service : InteractionRestaurantService,private user_services : UserInteractionService, private ofApp: FirebaseApp,
     private router: Router, public dialog: MatDialog, private tst_dialog:MatDialog){   
      this.uid = "";
      this.proprietaire = "";
      this.screen_width = window.innerWidth;
      this.restaurants_only = [{
        "adresse": "",
        "id": ""
      }];
  }

  ngOnInit(): void {
    const auth = getAuth(this.ofApp);
      onAuthStateChanged(auth, (user) => {
        if(user){
          let prop_to_get:string;
          console.log("utilisateur inscrit");
          this.uid = user.uid;
          this.user_services.getProprietaireFromUsers(this.uid).then((prop:string) => {
            this.service.getRestaurantsProprietaireFromUser(this.uid, prop).then((restaurant) => {
              this.proprietaire =  restaurant.proprietaire;
              this.restaurants_only= restaurant.restaurants;
            });
          })
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

  clicAcceuil(){
    this.router.navigate([''])
  }

  openDialog(restaurant:{ adresse: string, id: string}, event:MouseEvent): void {
    const target = new ElementRef(event.currentTarget)

    const dialogRef = this.dialog.open(AppModalComponent, {
      width: '250px',
      data: {
        adresse: restaurant.adresse,
        id: restaurant.id,
        trigger: target
      }
    });

  }

  scrollRight(){
    let nbr_restaurants = this.restaurants_only.length
    console.log("nombre de resto " + nbr_restaurants);
    console.log("taille de l'écran" + this.screen_width);
    console.log("le padding est de " + this.screen_width/nbr_restaurants);

    this.widgetsContent.nativeElement.scrollLeft += this.screen_width/nbr_restaurants;
    
  }

  scrollLeft(){
    let nbr_restaurants = this.restaurants_only.length
    this.widgetsContent.nativeElement.scrollLeft -= this.screen_width/nbr_restaurants;
  }
}

