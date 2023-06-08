
import { Injectable, NgZone, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, browserPopupRedirectResolver, connectAuthEmulator, createUserWithEmailAndPassword , getAuth, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, User } from 'firebase/auth';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { authState, user } from '@angular/fire/auth';
import { FIREBASE_AUTH_EMULATOR_HOST, FIREBASE_PROD } from 'src/environments/variables';



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
const app = initializeApp(firebaseConfig);

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  auth = getAuth(app);
  public userData: any; // Save logged in user data
  private connecter:boolean;
  constructor(public router: Router){
    if((location.hostname === "localhost") && (!FIREBASE_PROD)) {
      try {
         // Point to the RTDB emulator running on localhost.
         connectAuthEmulator(this.auth, FIREBASE_AUTH_EMULATOR_HOST);
      } catch (error) {
        console.log(error);
        
      }
    } 
  
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
