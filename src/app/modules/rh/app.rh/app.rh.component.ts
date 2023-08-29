import { Component, OnInit } from '@angular/core';
import { FirebaseApp, initializeApp } from '@angular/fire/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import {onAuthStateChanged } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-rh',
  templateUrl: './app.rh.component.html',
  styleUrls: ['./app.rh.component.css'],
})
export class AppRhComponent implements OnInit {
  currentUserRole!: string;
  currentUserMail!: string;
  currentUserPrenom!: string;
  currentUserNom!: string;
  currentUserConges!: string;
  currentUserNomComplet!: string;

  constructor(private auth:Auth, private firebaseApp:FirebaseApp) {}

  ngOnInit(): void {
    // Récupérer base de données
    const db = getDatabase(this.firebaseApp);

    const userPath = '/users/foodandboost_prop/';

    // Récupérer les infos de l'utilisateur connecté
    onAuthStateChanged(this.auth, (currentUser) => {
      const user = currentUser;
      const userdat = user?.uid;
      const role = ref(db, `${userPath}/${userdat}/role`);
      const mail = ref(db, `${userPath}/${userdat}/email`);
      const prenom = ref(db, `${userPath}/${userdat}/prenom`);
      const nom = ref(db, `${userPath}/${userdat}/nom`);
      const conges = ref(db, `${userPath}/${userdat}/conges`);
      onValue(role, (roleSnapshot) => {
        this.currentUserRole = roleSnapshot.val();
      });
      onValue(mail, (mailSnapshot) => {
        this.currentUserMail = mailSnapshot.val();
      });
      onValue(prenom, (prenomSnapshot) => {
        this.currentUserPrenom = prenomSnapshot.val();
      });
      onValue(nom, (nomSnapshot) => {
        this.currentUserNom = nomSnapshot.val();
      });
      onValue(conges, (congesSnapshot) => {
        this.currentUserConges = congesSnapshot.val();
      });
      this.currentUserNomComplet = this.currentUserPrenom + ' ' + this.currentUserNom;
      localStorage.setItem('currentUserNomComplet', this.currentUserNomComplet);
    });
  }

  // Récupérer le rôle de l'utilisateur courant
  getUserRole(): string {
    return this.currentUserRole;
  }

  // Récupérer le mail de l'utilisateur courant
  getUserMail(): string {
    return this.currentUserMail;
  }

  // Récupérer les jours de congés restants de l'utilisateur courant
  async getUserConges(): Promise<string> {
    while (this.currentUserConges === undefined) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return this.currentUserConges;
  }
}
