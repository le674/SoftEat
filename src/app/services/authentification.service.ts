
import { Injectable, NgZone, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, browserPopupRedirectResolver, createUserWithEmailAndPassword , getAuth, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, User } from 'firebase/auth';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { authState, user } from '@angular/fire/auth';



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
const app = initializeApp(firebaseConfig);

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  auth = getAuth(app);
  userData: any; // Save logged in user data
  
  constructor(public router: Router){
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


  ConnexionUtilisateur(email:string,password:string){
    this.auth.updateCurrentUser;

    signInWithEmailAndPassword(this.auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      this.userData = user;
      
      this.router.navigate(['dashboard']);
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
        user.reload();
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
        
      } else {
        // User is signed out
        // ...
        console.log("b");
      }
    });
    if(this.auth.currentUser){connecter=true;}
    console.log("."+connecter);

    return connecter;
  }
  
}

