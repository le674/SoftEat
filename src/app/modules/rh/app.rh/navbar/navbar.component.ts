import { Component, OnInit } from '@angular/core';
import { getDatabase, ref, onValue, get } from 'firebase/database';
import { FirebaseService } from '../../../../services/firebase.service';
import { FirebaseApp, initializeApp } from "@angular/fire/app";
import { CalendarService } from '../calendar-view/calendar-data.service';

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
  new_users !: string;

  firebaseApp: FirebaseApp | undefined;

  constructor(firebaseApp: FirebaseApp, private calendarService : CalendarService) {}

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
    this.new_users = "";

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
        this.new_users = this.select.join(",");
        console.log(this.new_users)
        this.calendarService.changeUsers(this.new_users);
      }
    } else {
      this.select.push(liste.nom);
      this.new_users = this.select.join(",");
      console.log(this.new_users)
      this.calendarService.changeUsers(this.new_users);
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
  }

  addAllServeurs() {
    this.addAllItems(
      this.Serveurs,
      this.selectAllServeurs,
      this.select,
      'selectionne'
    );
    this.selectAllServeurs = !this.selectAllServeurs;
    this.new_users = this.select.join(",");
      console.log(this.new_users)
      this.calendarService.changeUsers(this.new_users);
  }

  addAllAutres() {
    this.addAllItems(
      this.Autres,
      this.selectAllAutres,
      this.select,
      'selectionne'
    );
    this.selectAllAutres = !this.selectAllAutres;
    this.new_users = this.select.join(",");
      console.log(this.new_users)
      this.calendarService.changeUsers(this.new_users);
  }

  addAllRh() {
    this.addAllItems(this.Rh, this.selectAllRh, this.select, 'selectionne');
    this.selectAllRh = !this.selectAllRh;
    this.new_users = this.select.join(",");
      console.log(this.new_users)
      this.calendarService.changeUsers(this.new_users);
  }

  addAllGerants() {
    this.addAllItems(
      this.Gerants,
      this.selectAllGerants,
      this.select,
      'selectionne'
    );
    this.selectAllGerants = !this.selectAllGerants;
    this.new_users = this.select.join(",");
      console.log(this.new_users)
      this.calendarService.changeUsers(this.new_users);
  }

  async fetchUser() {
    const db = getDatabase(this.firebaseApp);
  
    const userPath = '/users/foodandboost_prop/';
    const usersRef = ref(db, userPath);
  
    try {
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const userIDs = Object.keys(usersData);
  
        for (const userID of userIDs) {
          const userEmailRef = ref(db, `${userPath}/${userID}/email`);
          const userRoleRef = ref(db, `${userPath}/${userID}/role`);
  
          const emailSnapshot = await get(userEmailRef);
          const email = emailSnapshot.val();
  
          const roleSnapshot = await get(userRoleRef);
          const role = roleSnapshot.val();
  
          if (email) {
            if (role == 'gerant') {
              this.Gerants.push({ nom: email, selectionne: false });
            } else if (role == 'rh') {
              this.Rh.push({ nom: email, selectionne: false });
            } else if (role == 'serveur') {
              this.Serveurs.push({ nom: email, selectionne: false });
            } else {
              this.Autres.push({ nom: email, selectionne: false });
            }
          }
        }
      } else {
        console.log('No user data found.');
      }
    } catch (error) {
      console.error('An error occurred while retrieving user data:', error);
    }
  }
  
}
