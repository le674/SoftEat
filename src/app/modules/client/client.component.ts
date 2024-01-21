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

  // Affiche les informations du User connecté
  ngOnInit(): void {
      onAuthStateChanged(this.auth, (user) => {
        console.log(user);
        if(user){
          // Récupère les informations du users depuis firestore
          const usersCollection = this.firestore.collection('users');
          this.uid = user.uid;
          const docRef = usersCollection.doc(this.uid);
          // Met à jour le nom et les points de l'utilisateur s'il existe dans la BDD
          // dans la collection 'users'
          docRef.get().subscribe((doc) => {
            if (doc.exists) {
              this.dataUser = doc.data() as UserData; // Interface contenant les informations des utilisateurs
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
           //renvoie la personne vers la page d'authentification
          this.router.navigate(["./accueil"])
        } 
      })
  }
  // Déconnexion
  clicdeConnexion(){
    this.auth.signOut(); 
    this.router.navigate([''])
  }

  // Retour à l'accueil
  clicAcceuil(){
    this.router.navigate(["../accueil"])
  }

  // Accès à la liste des restaurants, où sera implémentée la carte en 
  // OpenStreetMap
  toRestaurants(){
    this.router.navigate(["../restaurants"]);
  }
}

