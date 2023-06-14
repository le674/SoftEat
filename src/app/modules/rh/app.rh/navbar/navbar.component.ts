import { Component, OnInit, Input } from '@angular/core';
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
  Serveurs!: { nom: String; selectionne: boolean; mail : String }[];
  Gerants!: { nom: String; selectionne: boolean; mail : String }[];
  Rh!: { nom: String; selectionne: boolean; mail : String }[];
  Autres!: { nom: String; selectionne: boolean; mail : string }[];

  select!: string[];
  selectMail!:string[];
  isChecked: any;
  selectAll: boolean = false;
  selectAllServeurs: boolean = false;
  selectAllGerants: boolean = false;
  selectAllRh: boolean = false;
  selectAllAutres: boolean = false;
  new_users !: string;
  @Input() userMail!:string;
  @Input() userNomComplet!:string;

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
    this.selectMail = [];
    this.new_users = "";

    this.fetchUser();
    this.selectUser();
  }

  selectUser(){
    this.select.push(this.userNomComplet);
    console.log(this.userNomComplet);
    this.selectMail.push(this.userMail);
    this.new_users = this.selectMail.join(",");
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
      const indexMail = this.selectMail.indexOf(liste.mail)
      if (index !== -1 && indexMail!== -1) {
        this.select.splice(index, 1);
        this.selectMail.splice(indexMail,1);
        this.new_users = this.selectMail.join(",");
        console.log(this.new_users)
        this.calendarService.changeUsers(this.new_users);
      }
    } else {
      this.select.push(liste.nom);
      this.selectMail.push(liste.mail)
      this.new_users = this.selectMail.join(",");
      console.log(this.new_users)
      this.calendarService.changeUsers(this.new_users);
    }

    liste.selectionne = !liste.selectionne;
  }

  addAllItems(
    items: any[],
    selectAllFlag: boolean,
    selectList: string[],
    selectMailList : string [],
    selectionneProperty: string
  ) {
    if (selectAllFlag) {
      items.forEach((item) => {
        const index = selectList.indexOf(item.nom);
        const indexMail = selectMailList.indexOf(item.mail)
        if (index !== -1 && indexMail!==-1) {
          selectList.splice(index, 1);
          selectMailList.splice(indexMail,1);
          item[selectionneProperty] = !item[selectionneProperty];
        }
      });
    } else {
      items.forEach((item) => {
        if (!selectList.includes(item.nom) && !selectMailList.includes(item.mail)) {
          selectList.push(item.nom);
          selectMailList.push(item.mail);
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
      this.selectMail,
      'selectionne'
    );
    this.selectAllServeurs = !this.selectAllServeurs;
    this.new_users = this.selectMail.join(",");
      console.log(this.new_users)
      this.calendarService.changeUsers(this.new_users);
  }

  addAllAutres() {
    this.addAllItems(
      this.Autres,
      this.selectAllAutres,
      this.select,
      this.selectMail,
      'selectionne'
    );
    this.selectAllAutres = !this.selectAllAutres;
    this.new_users = this.selectMail.join(",");
      console.log(this.new_users)
      this.calendarService.changeUsers(this.new_users);
  }

  addAllRh() {
    this.addAllItems(this.Rh, this.selectAllRh, this.select, this.selectMail, 'selectionne');
    this.selectAllRh = !this.selectAllRh;
    this.new_users = this.selectMail.join(",");
      console.log(this.new_users)
      this.calendarService.changeUsers(this.new_users);
  }

  addAllGerants() {
    this.addAllItems(
      this.Gerants,
      this.selectAllGerants,
      this.select,
      this.selectMail,
      'selectionne'
    );
    this.selectAllGerants = !this.selectAllGerants;
    this.new_users = this.selectMail.join(",");
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
          const userRoleRef = ref(db, `${userPath}/${userID}/role`);
          const userPrenomRef = ref(db, `${userPath}/${userID}/prenom`);
          const userNomRef = ref(db, `${userPath}/${userID}/nom`);
          const userMailRef = ref(db, `${userPath}/${userID}/email`);
          
          const prenomSnapshot = await get(userPrenomRef);
          const nomSnapshot = await get(userNomRef);
          const nomComplet = prenomSnapshot.val() + " " + nomSnapshot.val();
  
          const roleSnapshot = await get(userRoleRef);
          const role = roleSnapshot.val();
          
          const mailSnapshot = await get(userMailRef);
          const user_mail = mailSnapshot.val();

          if (nomComplet) {
            if (user_mail === this.userMail){
              if (role == 'gerant') {
                this.Gerants.push({ nom: nomComplet, selectionne: true, mail : user_mail });
              } else if (role == 'rh') {
                this.Rh.push({ nom: nomComplet, selectionne: true, mail : user_mail });
              } else if (role == 'serveur') {
                this.Serveurs.push({ nom: nomComplet, selectionne: true, mail : user_mail });
              } else {
                this.Autres.push({ nom: nomComplet, selectionne: true, mail : user_mail });
              }
            } else {
              if (role == 'gerant') {
                this.Gerants.push({ nom: nomComplet, selectionne: false, mail : user_mail });
              } else if (role == 'rh') {
                this.Rh.push({ nom: nomComplet, selectionne: false, mail : user_mail });
              } else if (role == 'serveur') {
                this.Serveurs.push({ nom: nomComplet, selectionne: false, mail : user_mail });
              } else {
                this.Autres.push({ nom: nomComplet, selectionne: false, mail : user_mail });
              }
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