import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ConnectionComponent } from '../connection/connection.component';
import { DOCUMENT } from '@angular/common'; 
import { AuthentificationService } from 'src/app/services/authentification.service';
import { connectAuthEmulator, getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Router } from '@angular/router';
import { FIREBASE_AUTH_EMULATOR_HOST, FIREBASE_PROD } from 'src/environments/variables';
import { MatDialog } from '@angular/material/dialog';
import { ContactComponent } from '../contact/contact.component';
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

  if((location.hostname === "localhost") && (!FIREBASE_PROD)) {
    try {
        // Point to the RTDB emulator running on localhost.
        connectAuthEmulator(auth, FIREBASE_AUTH_EMULATOR_HOST);  
    } catch (error) {
      console.log(error);
      
    }
  } 


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
  
  constructor(public authService: AuthentificationService, public router: Router, public dialog: MatDialog){
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
  clicContact(toogler: HTMLButtonElement) {
    const dialogRef = this.dialog.open(ContactComponent, {
      width: '350px',
      height: '370px'
    });
    if(window.matchMedia("(max-width: 990px)").matches){
      toogler.click();
    }
  }
  clicConnexion(toogler: HTMLButtonElement){
    this.numPanel.emit(1);  
    
    if(window.matchMedia("(max-width: 990px)").matches){
      toogler.click();
    }
  }
  clicAutho(){
    
    this.router.navigate(['autho']);
  }
  clicdeConnexion(){
    auth.signOut();
    
    window.location.reload();
  }
  clicHome(toogler: HTMLButtonElement){
    this.numPanel.emit(2);  
    window.scrollTo({top:0, behavior: 'smooth'});
    if(window.matchMedia("(max-width: 990px)").matches){
      toogler.click();
    }
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
  clicFonctionnalite(toogler: HTMLButtonElement){
    var element = document.querySelector("#divMobile");
    this.numPanel.emit(2)  
    element?.scrollIntoView();
    if(window.matchMedia("(max-width: 990px)").matches){
      toogler.click();
    }
  }
  hideImage(image: HTMLImageElement) { 
    console.log("test");
    if(window.matchMedia("(max-width: 990px)").matches){
      image.remove() 
    }
  }
}

