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

  select!: string[];
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

    this.fetchUser();
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

  addAllItems(
    items: any[],
    selectAllFlag: boolean,
    selectList: string[],
    selectionneProperty: string
  ) {
    if (selectAllFlag) {
      items.forEach((item) => {
        const index = selectList.indexOf(item.nom);
        if (index !== -1) {
          selectList.splice(index, 1);
          item[selectionneProperty] = !item[selectionneProperty];
        }
      });
    } else {
      items.forEach((item) => {
        if (!selectList.includes(item.nom)) {
          selectList.push(item.nom);
          item[selectionneProperty] = !item[selectionneProperty];
        }
      });
    }
    selectAllFlag = !selectAllFlag;
  }

  addAllServeurs() {
    this.addAllItems(
      this.Serveurs,
      this.selectAllServeurs,
      this.select,
      'selectionne'
    );
    this.selectAllServeurs = !this.selectAllServeurs;
  }

  addAllAutres() {
    this.addAllItems(
      this.Autres,
      this.selectAllAutres,
      this.select,
      'selectionne'
    );
    this.selectAllAutres = !this.selectAllAutres;
  }

  addAllRh() {
    this.addAllItems(this.Rh, this.selectAllRh, this.select, 'selectionne');
    this.selectAllRh = !this.selectAllRh;
  }

  addAllGerants() {
    this.addAllItems(
      this.Gerants,
      this.selectAllGerants,
      this.select,
      'selectionne'
    );
    this.selectAllGerants = !this.selectAllGerants;
  }

  fetchUser() {
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
