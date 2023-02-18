import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ConnectionComponent } from '../connection/connection.component';
import { DOCUMENT } from '@angular/common'; 
import { AuthentificationService } from 'src/app/services/authentification.service';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Router } from '@angular/router';
const firebaseConfig = {
  apiKey: "AIzaSyDPJyOCyUMDl70InJyJLwNLAwfiYnrtsDo",
  authDomain: "psofteat-65478545498421319564.firebaseapp.com",
  databaseURL: "https://psofteat-65478545498421319564-default-rtdb.firebaseio.com",
  projectId: "psofteat-65478545498421319564",
  storageBucket: "psofteat-65478545498421319564.appspot.com",
  messagingSenderId: "135059251548",
  appId: "1:135059251548:web:fb05e45e1d1631953f6199",
  measurementId: "G-5FBJE9WH0X"
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
      auth.updateCurrentUser;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        user.reload();
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
   // The user object has basic properties such as display name, email, etc.
   displayName = user.displayName;
   email = user.email;
   const photoURL = user.photoURL;
   const emailVerified = user.emailVerified;
   this.boutonConnexion=1;

   // The user's ID, unique to the Firebase project. Do NOT use
   // this value to authenticate with your backend server, if
   // you have one. Use User.getToken() instead.
   const uid = user.uid;
        // ...
      } else {
        // User is signed out
        // ...
      }
    });

}
  getNom():string{
    if(email!=null){
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
  clicAutho(){
    
    this.router.navigate(['autho']);
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

