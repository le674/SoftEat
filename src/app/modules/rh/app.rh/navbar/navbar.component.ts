import { Component, OnInit } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { getDatabase, ref, onValue, get } from 'firebase/database';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  Categories!: { nom: string; open: boolean; buttonname: String }[];
  Serveurs!: { nom: String; selectionne: boolean }[];
  Gerants!: { nom: String; selectionne: boolean }[];
  Rh!: { nom: String; selectionne: boolean }[];
  Autres!: { nom: String; selectionne: boolean }[];

  select!: String[];
  isChecked: any;
  selectAll: boolean = false;
  selectAllServeurs: boolean = false;
  selectAllGerants: boolean = false;
  selectAllRh: boolean = false;
  selectAllAutres: boolean = false;

  email!: string;
  role!: string;

  constructor() {}

  ngOnInit(): void {
    this.Categories = [
      { nom: 'Serveurs', open: false, buttonname: '▼' },
      { nom: 'Rh', open: false, buttonname: '▼' },
      { nom: 'Gérants', open: false, buttonname: '▼' },
      { nom: 'Autres', open: false, buttonname: '▼' },
    ];
    this.Serveurs = [];
    this.Gerants = [];
    this.Rh = [];
    this.Autres = [];

    this.select = [];

    this.fetchUserStatus();
  }

  openCategories(categories: any) {
    if (categories.buttonname == '▼') {
      categories.buttonname = '▲';
    } else {
      categories.buttonname = '▼';
    }
    categories.open = !categories.open;
  }

  selectEmployee(liste: any) {
    if (liste.selectionne) {
      const index = this.select.indexOf(liste.nom);
      if (index !== -1) {
        this.select.splice(index, 1);
      }
    } else {
      this.select.push(liste.nom);
    }

    liste.selectionne = !liste.selectionne;
  }

  addAllServeurs() {
    if (this.selectAllServeurs) {
      this.Serveurs.forEach((serveur) => {
        const index = this.select.indexOf(serveur.nom);
        if (index !== -1) {
          this.select.splice(index, 1);
          serveur.selectionne = !serveur.selectionne;
        }
      });
    } else {
      this.Serveurs.forEach((serveur) => {
        if (!this.select.includes(serveur.nom)) {
          this.select.push(serveur.nom);
          serveur.selectionne = !serveur.selectionne;
        }
      });
    }
    this.selectAllServeurs = !this.selectAllServeurs;
  }

  addAllAutres() {
    if (this.selectAllAutres) {
      this.Autres.forEach((autre) => {
        const index = this.select.indexOf(autre.nom);
        if (index !== -1) {
          this.select.splice(index, 1);
          autre.selectionne = !autre.selectionne;
        }
      });
    } else {
      this.Autres.forEach((autre) => {
        if (!this.select.includes(autre.nom)) {
          this.select.push(autre.nom);
          autre.selectionne = !autre.selectionne;
        }
      });
    }
    this.selectAllAutres = !this.selectAllAutres;
  }

  addAllRh() {
    if (this.selectAllRh) {
      this.Rh.forEach((rh) => {
        const index = this.select.indexOf(rh.nom);
        if (index !== -1) {
          this.select.splice(index, 1);
          rh.selectionne = !rh.selectionne;
        }
      });
    } else {
      this.Rh.forEach((rh) => {
        if (!this.select.includes(rh.nom)) {
          this.select.push(rh.nom);
          rh.selectionne = !rh.selectionne;
        }
      });
    }
    this.selectAllRh = !this.selectAllRh;
  }

  addAllGerants() {
    if (this.selectAllGerants) {
      this.Gerants.forEach((gerant) => {
        const index = this.select.indexOf(gerant.nom);
        if (index !== -1) {
          this.select.splice(index, 1);
          gerant.selectionne = !gerant.selectionne;
        }
      });
    } else {
      this.Gerants.forEach((gerant) => {
        if (!this.select.includes(gerant.nom)) {
          this.select.push(gerant.nom);
          gerant.selectionne = !gerant.selectionne;
        }
      });
    }
    this.selectAllGerants = !this.selectAllGerants;
  }

  fetchUserStatus() {
    const firebaseConfig = {
      apiKey: 'AIzaSyDPJyOCyUMDl70InJyJLwNLAwfiYnrtsDo',
      authDomain: 'psofteat-65478545498421319564.firebaseapp.com',
      databaseURL:
        'https://psofteat-65478545498421319564-default-rtdb.firebaseio.com',
      projectId: 'psofteat-65478545498421319564',
      storageBucket: 'psofteat-65478545498421319564.appspot.com',
      messagingSenderId: '135059251548',
      appId: '1:135059251548:web:fb05e45e1d1631953f6199',
      measurementId: 'G-5FBJE9WH0X',
    };
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getDatabase(firebaseApp);

    //Current user
    /*
    const auth = getAuth(firebaseApp);
    let user = auth.currentUser;
    console.log('Current user :');
    console.log(user);
    */

    //const userPath = 'restaurants/ping_11/telecom/employes/';
    const userPath = '/users/foodandboost_prop/';

    // Référence au chemin des utilisateurs
    const usersRef = ref(db, userPath);

    // Récupérer les données des utilisateurs
    get(usersRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const userIDs = Object.keys(usersData);
          console.log('User IDs:');
          console.log(userIDs);

          // A chaque utilisateurs dans le chemin
          userIDs.forEach((userID) => {
            const userEmailRef = ref(db, `${userPath}/${userID}/email`);
            const userRoleRef = ref(db, `${userPath}/${userID}/role`);

            // Récup l'email
            onValue(userEmailRef, (snapshot) => {
              this.email = snapshot.val();
            });

            // Récup le rôle et push dans les bonnes listes
            onValue(userRoleRef, (roleSnapshot) => {
              const role = roleSnapshot.val();
              if (role == 'gerant') {
                this.Gerants.push({ nom: this.email, selectionne: false });
                console.log(userID);
              } else if (role == 'rh') {
                this.Rh.push({ nom: this.email, selectionne: false });
              } else if (role == 'serveur') {
                this.Serveurs.push({ nom: this.email, selectionne: false });
              } else {
                this.Autres.push({ nom: this.email, selectionne: false });
              }
            });
          });
        } else {
          console.log('No user data found.');
        }
      })
      .catch((error) => {
        console.error('An error occurred while retrieving user data:', error);
      });
  }
}
