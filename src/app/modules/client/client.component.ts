import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
import {onAuthStateChanged } from 'firebase/auth';
import { User } from 'src/app/interfaces/user';
import { Auth } from '@angular/fire/auth';
import { UserData } from 'src/app/interfaces/userdata';
import { RestaurantData } from 'src/app/interfaces/restaurantdata';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit, OnDestroy {
  @ViewChild('widgetsContent') public widgetsContent!: ElementRef;

  private readonly screen_width: any;
  private uid: string;
  public user:User | null;
  public url:string;
  public displayName:string;
  public dinerText : string;
  public dataUser!: UserData;
  public fidelite : Number;

  constructor(private auth: Auth, private router: Router, private firestore : AngularFirestore){   
      this.uid = "";
      this.screen_width = window.innerWidth;
      this.url = "";
      this.user = null;
      this.displayName = "";
      this.dinerText = "UN DINER";
      this.fidelite = 0
  }
  ngOnDestroy(): void {
  }
  ngOnInit(): void {
      onAuthStateChanged(this.auth, (user) => {
        console.log(user);
        if(user){
          const usersCollection = this.firestore.collection('users');
          this.uid = user.uid;
          const docRef = usersCollection.doc(this.uid);
          
          docRef.get().subscribe((doc) => {
            if (doc.exists) {
              this.dataUser = doc.data() as UserData;
              console.log(this.dataUser)
              this.displayName = this.dataUser.displayName;
              this.fidelite = this.dataUser.fidelite;
            } else {
              console.log("Erreur l'utilisateur n'existe pas")
            }
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
    this.auth.signOut(); 
    this.router.navigate([''])
  }
  clicAcceuil(){
    this.router.navigate(["../accueil"])
  }

  toRestaurants(){
    this.router.navigate(["../restaurants"]);
    const restaurantsCollection = this.firestore.collection('restaurants');
    restaurantsCollection.get().subscribe((snapshot) => {
      snapshot.forEach((doc) => {
        const restaurantData = doc.data() as RestaurantData;
        
        // Vous pouvez maintenant accéder aux champs du document
        console.log('Nom du restaurant:', restaurantData.name);
        console.log('Adresse du restaurant:', restaurantData.address);
        // Ajoutez d'autres champs selon votre structure de document
      });
    });
  }
}

