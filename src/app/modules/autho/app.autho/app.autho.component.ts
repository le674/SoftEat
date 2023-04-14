import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { MatDialog} from '@angular/material/dialog';
import {Router, UrlSerializer} from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { InteractionRestaurantService } from './interaction-restaurant.service';
import {UserInteractionService} from 'src/app/services/user-interaction.service'
import { Restaurant } from 'src/app/interfaces/restaurant';
import { AppModalComponent } from '../app.modals/app.modal/app.modal/app.modal.component';
import { AppFormComponent } from '../app.modals/app.form/app.form/app.form.component';
import { Serializer } from '@angular/compiler';

@Component({
  selector: 'app-app.autho',
  templateUrl: './app.autho.component.html',
  styleUrls: ['./app.autho.component.css']
})
export class AppAuthoComponent implements OnInit {
  @ViewChild('widgetsContent') public widgetsContent!: ElementRef;

  private readonly screen_width: any;
  private uid: string;
  public is_confique: boolean;
  public proprietaire: string;
  public restaurants_only: Array<Restaurant>;
  public url:string;

  constructor(private service : InteractionRestaurantService,private user_services : UserInteractionService, private ofApp: FirebaseApp,
     private router: Router, public dialog: MatDialog, private tst_dialog:MatDialog, private serealizer: UrlSerializer){   
      this.uid = "";
      this.proprietaire = "";
      this.screen_width = window.innerWidth;
      this.restaurants_only = [
        new Restaurant()
      ];
      this.url = "";
      this.is_confique = false;
  }

  ngOnInit(): void {
    const auth = getAuth(this.ofApp);
      onAuthStateChanged(auth, (user) => {
        if(user){
          this.uid = user.uid;
          const my_prop = this.user_services.getProprietaireFromUsers(this.uid)
          my_prop.then((prop) => {
            this.proprietaire = prop
            this.user_services.getUserFromUid(user.uid, prop).then((user) => {
              this.restaurants_only = user.restaurants   
              if(user.roles.includes("gérant") || user.roles.includes("proprietaire")){
                this.is_confique = true
              }
            })
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

  openFormular(event:MouseEvent): void{
    
    const target= new ElementRef(event.currentTarget);
    
    this.dialog.open(AppFormComponent,{
      width: '400px',
      height: '290px',
      data: {
        prop: this.proprietaire,
        uid: this.uid,
        trigger: target
      }
    });
  }
  restaurantNavigate(restaurant:string, proprietaire:string){
    const dashboard = this.router.createUrlTree(["/dashboard"],{ queryParams: { restaurant: restaurant, prop: proprietaire}})
    this.url =  this.serealizer.serialize(dashboard)
    window.location.href = this.url
  }
  
}

