
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile} from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { UserData } from '../interfaces/userdata';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  public userData: any; // Save logged in user data
  private connecter:boolean;
  constructor(public router: Router,private auth:Auth, private firestore : AngularFirestore){
    this.connecter=false;
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        user.reload();
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

    console.error('Erreur lors de la création de l\'utilisateur : ', errorCode, errorMessage);
  });

  }

  InscriptionClient(email: string, password: string, displayName: string) {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        /*console.log('Utilisateur créé avec succès, UID : ', user.uid);
        updateProfile(user, {
          displayName: displayName,
          photoURL: "client",
        })*/
        const usersCollection = this.firestore.collection('users');
        const userDocRef = usersCollection.doc(user.uid);
  
        // Création du document dans la collection 'users'
        userDocRef.set({
          email: user.email,
          role: 'client',
          fidelite: 0,
          uid: user.uid,
          displayName: displayName
        })
          .then(() => {
            console.log('Rôle "client" ajouté avec succès pour l\'utilisateur : ', user.uid);
            this.ConnexionUtilisateur(email, password);
          })
          .catch((error) => {
            console.error('Erreur lors de l\'ajout du rôle "client" : ', error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Erreur lors de la création de l\'utilisateur : ', errorCode, errorMessage);
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
      user.getIdTokenResult().then((idTokenResult) => {
        console.log(idTokenResult)
        const usersCollection = this.firestore.collection('users');
        const user_uid = idTokenResult?.claims?.['user_id'];
        const userDocRef = usersCollection.doc(user_uid);
        console.log('user_uid : ', user_uid);
        userDocRef.get().subscribe(snapshot => {
          const userData = snapshot.data() as UserData;
        
          // Vérifiez d'abord si le document existe
          if (snapshot.exists) {
            const role = userData.role;
        
            if (role === "client") {
              // Faites quelque chose ici
              this.router.navigate(['client']);
            } else {
              // Le rôle n'est pas "client"
              this.router.navigate(['autho']);
            }
          } else {
            // Le document n'existe pas
            this.router.navigate(['autho']);
          }
        });
      /*
      localStorage.setItem("user_name", user.displayName as string);
      localStorage.setItem("user_role", user.photoURL as string);*/
      //});
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  })}

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
