
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword} from 'firebase/auth';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  public userData: any; // Save logged in user data
  private connecter:boolean;
  constructor(public router: Router,private auth:Auth){
    this.connecter=false;
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        this.userData = user;
       /* localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
        console.log("Connexion :"+this.auth.currentUser?.email);*/
        // ...
      } else {
        // User is signed out
        // ...
        /*localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);*/
      }
    });
  }
Inscription(email:string,password:string){
  createUserWithEmailAndPassword(this.auth, email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {

    const errorCode = error.code;
    const errorMessage = error.message;

    // ..
  });

  }

  miseAJourProfil(){


  }
  ConnexionUtilisateur(email:string,password:string){
    this.auth.updateCurrentUser;

    signInWithEmailAndPassword(this.auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      this.router.navigate(['autho']);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }

  ConnexionClient(email:string,password:string){
    this.auth.updateCurrentUser;

    signInWithEmailAndPassword(this.auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      this.router.navigate(['client']);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }

  /*evoieUser():User{

    return user;
  }*/
  getUser(){

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        alert("Utilisateur connecté");
        const uid = user.uid;
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }
  get estConnecter(): boolean {
   let connecter = false;
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
        this.connecter = true;
      } else {
        // User is signed out
        // ...
      }
    });
    if(this.auth.currentUser){connecter=true;}
    return connecter;
  }

}
