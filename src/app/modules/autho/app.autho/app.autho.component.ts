import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import {Router, UrlSerializer} from '@angular/router';
import {onAuthStateChanged } from 'firebase/auth';
import {UserInteractionService} from '../../../../app/services/user-interaction.service'
import { Restaurant} from '../../../../app/interfaces/restaurant';
import { AppModalComponent } from '../app.modals/app.modal/app.modal/app.modal.component';
import { AppFormComponent } from '../app.modals/app.form/app.form/app.form.component';
import { RestaurantService } from 'src/app/services/restaurant/restaurant.service';
import { Unsubscribe } from 'firebase/firestore';
import { User } from 'src/app/interfaces/user';
import { Employee } from 'src/app/interfaces/employee';
import { CommonCacheServices } from 'src/app/services/common/common.cache.services.service';
import { Subscription } from 'rxjs';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-app.autho',
  templateUrl: './app.autho.component.html',
  styleUrls: ['./app.autho.component.css']
})
export class AppAuthoComponent implements OnInit, OnDestroy {
  @ViewChild('widgetsContent') public widgetsContent!: ElementRef;

  private readonly screen_width: any;
  private uid: string;
  public user:User | null;
  public is_confique: boolean;
  public url:string;
  private employee_unsubscribe!:Unsubscribe;
  private _employee_subscription!:Subscription;
  private restaurant_unsubscribe!: Unsubscribe;
  private _restaurant_subscription!:Subscription;
  private user_unsubscribe!: Unsubscribe;
  private _user_subscription!:Subscription;

  constructor(private user_services : UserInteractionService, private auth: Auth,
     private router: Router, public dialog: MatDialog,
     private restaurant_service:RestaurantService, public cache_service:CommonCacheServices){   
      this.uid = "";
      this.screen_width = window.innerWidth;
      this.url = "";
      this.is_confique = false;
      this.user = null;
  }
  ngOnDestroy(): void {  
    if(this.restaurant_unsubscribe){
      this.restaurant_unsubscribe();
    }  
    if(this._restaurant_subscription){
      this._restaurant_subscription.unsubscribe();
    }
    if(this.user_unsubscribe){
      this.user_unsubscribe();
    }
    if(this._user_subscription.unsubscribe){
      this._user_subscription.unsubscribe();
    }
    if(this.employee_unsubscribe){
      this.employee_unsubscribe();
    }
    if(this._employee_subscription){
      this._employee_subscription.unsubscribe();
    }
  }
  ngOnInit(): void {
      onAuthStateChanged(this.auth, (user) => {
        console.log(user);
        if(user){
          this.uid = user.uid;
          this.user_unsubscribe = this.user_services.getUserFromUidBDD(this.uid);
          this._user_subscription = this.user_services.getUserFromUid().subscribe((user:User) => {
            this.user = user;
            if(this.user !== null){
              this.cache_service.setUser(user);
              this.employee_unsubscribe = this.user_services.getEmployeeBDD(this.user)
              this._employee_subscription = this.user_services.getEmployee().subscribe((employee:Employee) => {
                if(employee.roles?.includes("propriétaire")){
                  this.is_confique = true;
                }
              })
              this.restaurant_unsubscribe = this.restaurant_service.getAllRestaurantsBDD(this.user);
              this._restaurant_subscription = this.restaurant_service.getAllRestaurants().subscribe((restaurants:Array<Restaurant>) => {
                this.cache_service.setRestaurants(restaurants);
              })
            }
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
    this.auth.signOut(); 
    window.location.reload();
  }
  clicAcceuil(){
    this.router.navigate([''])
  }
  openDialog(restaurant:Restaurant, event:MouseEvent): void {
    const target = new ElementRef(event.currentTarget)
    const dialogRef = this.dialog.open(AppModalComponent, {
      width: '250px',
      data: {
        adresse: restaurant.address,
        id: restaurant.id,
        trigger: target
      }
    });
  }
  openFormular(event:MouseEvent): void{
    if((this.user !== null) && (this.user?.related_restaurants !== null)){
      const target= new ElementRef(event.currentTarget);
      this.dialog.open(AppFormComponent,{
        width: '400px',
        height: '290px',
        data: {
          prop: this.user.related_restaurants[0].proprietaire_id,
          uid: this.uid,
          trigger: target
        }
      });
    }
  }
  restaurantNavigate(restaurant:string, user:User | null){
    if((user !== null) && (user.related_restaurants !== null)){
      const proprietaire = user.related_restaurants[0].proprietaire_id  
      this.router.navigate(["/dashboard"],{ queryParams: {
        restaurant: restaurant,
        prop: proprietaire
      }})
    }
  }
  redirectConfigue() {
    this.router.navigate(["/autho/configuration"]);
  }
}

