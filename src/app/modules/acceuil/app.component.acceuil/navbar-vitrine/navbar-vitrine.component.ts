import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ConnectionComponent } from '../connection/connection.component';
import { DOCUMENT } from '@angular/common'; 
import { AuthentificationService } from 'src/app/services/authentification.service';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { idToken, reload } from '@angular/fire/auth';
import { iif } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { Router } from '@angular/router';
const firebaseConfig = {
    apiKey: "AIzaSyDGbo4CzfBKbtL-hUaAK8N-0k-O4tAuXc8",
    authDomain: "project-firebase-44cfe.firebaseapp.com",
    databaseURL: "https://project-firebase-44cfe-default-rtdb.firebaseio.com",
    projectId: "project-firebase-44cfe",
    storageBucket: "project-firebase-44cfe.appspot.com",
    messagingSenderId: "673925066278",
    appId: "1:673925066278:web:d4db735057922d05e1c0e7",
    measurementId: "G-ZNLSYK4LNG"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let user = auth.currentUser;
let email: string | null = null;
let displayName: string | null = null;
@Component({
  selector: 'app-navbar-vitrine',
  templateUrl: './navbar-vitrine.component.html',
  styleUrls: ['./navbar-vitrine.component.css']
})

export class NavbarVitrineComponent implements OnInit {
  @Output() public numPanel = new EventEmitter(); 
   boutonConnexion= 0;
  
  constructor(public authService: AuthentificationService, public router: Router
    ){
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
   // The user object has basic properties such as display name, email, etc.
   displayName = user.displayName;
   email = user.email;
   const photoURL = user.photoURL;
   const emailVerified = user.emailVerified;
 
   // The user's ID, unique to the Firebase project. Do NOT use
   // this value to authenticate with your backend server, if
   // you have one. Use User.getToken() instead.
   const uid = user.uid;
   console.log("Utilisateur - "+displayName+", "+authService.estConnecter);
        // ...
      } else {
        // User is signed out
        // ...
      }
    });

}
  getNom():string{
    if(email!=null){
      this.boutonConnexion=1;
    return email;
    }else{
      return "Se connecter"
    }
  }
  ngOnInit(): void {
  }
  
 
  

  clicConnexion(){
  this.numPanel.emit(1);  
  
  }
  clicDashboard(){
    
    this.router.navigate(['dashboard']);
  }
  clicdeConnexion(){
    auth.signOut();
    
    window.location.reload();
  }
  clicHome(){
    this.numPanel.emit(2);  
    window.scrollTo({top:0, behavior: 'smooth'});
  }
  clicTarif(){
    this.numPanel.emit(2);  

    var element = document.querySelector("#divPrix");
    element?.scrollIntoView();
  }
  clicPropos(){
    this.numPanel.emit(2);  

    var element = document.querySelector("#propos");
    element?.scrollIntoView();
  }
  clicFonctionnalite(){
    var element = document.querySelector("#divMobile");

    this.numPanel.emit(2)  
    element?.scrollIntoView();
  }
}

