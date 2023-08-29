import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthentificationService } from '../../../../../app/services/authentification.service';
import { connectAuthEmulator, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Router } from '@angular/router';
import { FIREBASE_AUTH_EMULATOR_HOST, FIREBASE_PROD } from '../../../../../environments/variables';
import { MatDialog } from '@angular/material/dialog';
import { ContactComponent } from '../contact/contact.component';
import { Auth } from '@angular/fire/auth';
@Component({
  selector: 'app-navbar-vitrine',
  templateUrl: './navbar-vitrine.component.html',
  styleUrls: ['./navbar-vitrine.component.css']
})

export class NavbarVitrineComponent implements OnInit {
  private user;
  private email: string | null = null;
  private displayName: string | null = null;
  @Output() public numPanel = new EventEmitter(); 
   boutonConnexion= 0;
  
  constructor(public authService: AuthentificationService, public router: Router, public dialog: MatDialog, private auth:Auth){
    this.user = this.auth.currentUser;
    auth.updateCurrentUser;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        user.reload();
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
   // The user object has basic properties such as display name, email, etc.
        localStorage.setItem("user_email", user.email as string);
   this.displayName = user.displayName;
   this.email = user.email;
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
    if(this.email!=null){
    return this.email;
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
    this.auth.signOut();
    
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
    if(window.matchMedia("(max-width: 990px)").matches){
      image.remove() 
    }
  }
}

