
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

  // Fonction appelée à la création de l'utilisateur Client.
  InscriptionClient(email: string, password: string, displayName: string) {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const usersCollection = this.firestore.collection('users');
        const userDocRef = usersCollection.doc(user.uid);
  
        // Création du document associé dans la collection 'users'
        userDocRef.set({
          email: user.email,
          role: 'client',
          fidelite: 0,
          uid: user.uid,
          displayName: displayName
        })
        // Les console.log peuvent être retiré, je les ai laissés au cas où
          .then(() => {
            console.log('Rôle "client" ajouté avec succès pour l\'utilisateur : ', user.uid);
            // Une fois que l'utilisateur est enregistré on le connecte
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

  // Fonction appelée pour la connexion restaurateur et client
  ConnexionUtilisateur(email:string,password:string){
    this.auth.updateCurrentUser;
    signInWithEmailAndPassword(this.auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      user.getIdTokenResult().then((idTokenResult) => {
        // On vient chercher l'id du user connecté, et on le compare à ceux
        // présents dans la collection 'users'
        const usersCollection = this.firestore.collection('users');
        const user_uid = idTokenResult?.claims?.['user_id'];
        const userDocRef = usersCollection.doc(user_uid);
        userDocRef.get().subscribe(snapshot => {
          // On stocke les données de l'utilisateur récupérées depuis Firestore
          // dans un UserData
          const userData = snapshot.data() as UserData;
        
          // On vérifie d'abord si le document existe
          if (snapshot.exists) {
            const role = userData.role;
        
            if (role === "client") {
              this.router.navigate(['client']);
            } else {
              // Le rôle n'est pas "client", on fait comme si c'était un restaurateur
              this.router.navigate(['autho']);
            }
          } else {
            // Le document n'existe pas dans la collection 'users' (ce sont tous les utilisateurs
            // créés différemment), on va à la page des restaurateurs
            this.router.navigate(['autho']);
          }
        });
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
