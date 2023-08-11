import { Component, OnInit, Input } from '@angular/core';
import { getDatabase, ref, get } from 'firebase/database';
import { FirebaseApp } from '@angular/fire/app';
import { CalendarService } from '../calendar-view/calendar-data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  Categories!: { nom: string; open: boolean; buttonname: string }[]; // Définition d'un tableau de catégories avec leurs propriétés
  Serveurs!: { nom: string; selectionne: boolean; mail: string }[]; // Définition d'un tableau de serveurs avec leurs propriétés
  Gerants!: { nom: string; selectionne: boolean; mail: string }[]; // Définition d'un tableau de gérants avec leurs propriétés
  Rh!: { nom: string; selectionne: boolean; mail: string }[]; // Définition d'un tableau de ressources humaines avec leurs propriétés
  Autres!: { nom: string; selectionne: boolean; mail: string }[]; // Définition d'un tableau d'autres employés avec leurs propriétés

  select!: string[]; // Tableau des employés sélectionnés
  selectMail!: string[]; // Tableau des adresses e-mail des employés sélectionnés
  isChecked: any; // Variable pour stocker la valeur de la case à cocher
  selectAll: boolean = false; // Variable pour indiquer si tous les employés sont sélectionnés
  selectAllServeurs: boolean = false; // Variable pour indiquer si tous les serveurs sont sélectionnés
  selectAllGerants: boolean = false; // Variable pour indiquer si tous les gérants sont sélectionnés
  selectAllRh: boolean = false; // Variable pour indiquer si toutes les ressources humaines sont sélectionnées
  selectAllAutres: boolean = false; // Variable pour indiquer si tous les autres employés sont sélectionnés
  new_users!: string; // Chaîne de caractères représentant les adresses e-mail des employés sélectionnés
  @Input() userMail!: string; // Adresse e-mail de l'utilisateur
  @Input() userNomComplet!: string; // Nom complet de l'utilisateur

  firebaseApp: FirebaseApp | undefined; // Instance de l'application Firebase

  constructor(private calendarService: CalendarService) {}

  ngOnInit(): void {
    // Catégories d'employés
    this.Categories = [
      { nom: 'Serveurs', open: false, buttonname: '▼' },
      { nom: 'Rh', open: false, buttonname: '▼' },
      { nom: 'Gérants', open: false, buttonname: '▼' },
      { nom: 'Autres', open: false, buttonname: '▼' },
    ];

    // Liste d'employés
    this.Serveurs = [];
    this.Gerants = [];
    this.Rh = [];
    this.Autres = [];

    this.select = []; // Employés sélectionnés
    this.selectMail = [];
    this.new_users = '';

    this.fetchUser();
    this.selectUser();
  }

  // Sélectionner l'utilisateur actuel
  selectUser() {
    this.select.push(this.userNomComplet);
    console.log(this.userNomComplet);
    this.selectMail.push(this.userMail);
    this.new_users = this.selectMail.join(',');
  }

  // Ouvrir ou fermer les catégories d'employés
  openCategories(categories: any) {
    if (categories.buttonname == '▼') {
      categories.buttonname = '▲';
    } else {
      categories.buttonname = '▼';
    }
    categories.open = !categories.open;
  }

  // Sélectionner un employé individuel
  selectEmployee(liste: any) {
    if (liste.selectionne) {
      const index = this.select.indexOf(liste.nom);
      const indexMail = this.selectMail.indexOf(liste.mail);
      if (index !== -1 && indexMail !== -1) {
        this.select.splice(index, 1);
        this.selectMail.splice(indexMail, 1);
        this.new_users = this.selectMail.join(',');
        console.log(this.new_users);
        this.calendarService.changeUsers(this.new_users); 
      }
    } else {
      this.select.push(liste.nom);
      this.selectMail.push(liste.mail);
      this.new_users = this.selectMail.join(',');
      console.log(this.new_users);
      this.calendarService.changeUsers(this.new_users); 
    }

    liste.selectionne = !liste.selectionne;
  }

  // Ajouter ou supprimer tous les éléments d'une catégorie
  addAllItems(
    items: any[],
    selectAllFlag: boolean,
    selectList: string[],
    selectMailList: string[],
    selectionneProperty: string
  ) {
    if (selectAllFlag) {
      items.forEach((item) => {
        const index = selectList.indexOf(item.nom);
        const indexMail = selectMailList.indexOf(item.mail);
        if (index !== -1 && indexMail !== -1) {
          selectList.splice(index, 1);
          selectMailList.splice(indexMail, 1);
          item[selectionneProperty] = !item[selectionneProperty];
        }
      });
    } else {
      items.forEach((item) => {
        if (
          !selectList.includes(item.nom) &&
          !selectMailList.includes(item.mail)
        ) {
          selectList.push(item.nom);
          selectMailList.push(item.mail);
          item[selectionneProperty] = !item[selectionneProperty];
        }
      });
    }
  }

  // Ajouter ou supprimer tous les serveurs
  addAllServeurs() {
  this.addAllItems(
      this.Serveurs,
      this.selectAllServeurs,
      this.select,
      this.selectMail,
      'selectionne'
    );
    this.selectAllServeurs = !this.selectAllServeurs;
    this.new_users = this.selectMail.join(',');
    console.log(this.new_users);
    this.calendarService.changeUsers(this.new_users); 
  }

  // Ajouter ou supprimer tous les autres employés
  addAllAutres() {
     this.addAllItems(
      this.Autres,
      this.selectAllAutres,
      this.select,
      this.selectMail,
      'selectionne'
    );
    this.selectAllAutres = !this.selectAllAutres;
    this.new_users = this.selectMail.join(',');
    console.log(this.new_users);
    this.calendarService.changeUsers(this.new_users); 
  }

  // Ajouter ou supprimer toutes les ressources humaines
  addAllRh() {
    this.addAllItems(
      this.Rh,
      this.selectAllRh,
      this.select,
      this.selectMail,
      'selectionne'
    );
    this.selectAllRh = !this.selectAllRh;
    this.new_users = this.selectMail.join(',');
    console.log(this.new_users);
    this.calendarService.changeUsers(this.new_users); 
  }

  // Ajouter ou supprimer tous les gérants
  addAllGerants() {
    this.addAllItems(
      this.Gerants,
      this.selectAllGerants,
      this.select,
      this.selectMail,
      'selectionne'
    );
    this.selectAllGerants = !this.selectAllGerants;
    this.new_users = this.selectMail.join(',');
    console.log(this.new_users);
    this.calendarService.changeUsers(this.new_users); 
  }

  // Récupérer les données utilisateur depuis la base de données
  async fetchUser() {
    const db = getDatabase(this.firebaseApp); // Récupération de la base de données

    const userPath = '/users/foodandboost_prop/';
    const usersRef = ref(db, userPath);

    try {
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const userIDs = Object.keys(usersData);

        for (const userID of userIDs) {
          // Parcours tous les utilisateurs dans la base de données
          const userRoleRef = ref(db, `${userPath}/${userID}/role`);
          const userPrenomRef = ref(db, `${userPath}/${userID}/prenom`);
          const userNomRef = ref(db, `${userPath}/${userID}/nom`);
          const userMailRef = ref(db, `${userPath}/${userID}/email`);

          const prenomSnapshot = await get(userPrenomRef);
          const nomSnapshot = await get(userNomRef);
          const nomComplet = prenomSnapshot.val() + ' ' + nomSnapshot.val();

          const roleSnapshot = await get(userRoleRef);
          const role = roleSnapshot.val();

          const mailSnapshot = await get(userMailRef);
          const user_mail = mailSnapshot.val();

          if (nomComplet) {
            if (user_mail === this.userMail) {
              if (role == 'gerant') {
                this.Gerants.push({
                  // Ajout de l'utilisateur dans la liste
                  nom: nomComplet,
                  selectionne: true,
                  mail: user_mail,
                });
              } else if (role == 'rh') {
                this.Rh.push({
                  nom: nomComplet,
                  selectionne: true,
                  mail: user_mail,
                });
              } else if (role == 'serveur') {
                this.Serveurs.push({
                  nom: nomComplet,
                  selectionne: true,
                  mail: user_mail,
                });
              } else {
                this.Autres.push({
                  nom: nomComplet,
                  selectionne: true,
                  mail: user_mail,
                });
              }
            } else {
              if (role == 'gerant') {
                this.Gerants.push({
                  nom: nomComplet,
                  selectionne: false,
                  mail: user_mail,
                });
              } else if (role == 'rh') {
                this.Rh.push({
                  nom: nomComplet,
                  selectionne: false,
                  mail: user_mail,
                });
              } else if (role == 'serveur') {
                this.Serveurs.push({
                  nom: nomComplet,
                  selectionne: false,
                  mail: user_mail,
                });
              } else {
                this.Autres.push({
                  nom: nomComplet,
                  selectionne: false,
                  mail: user_mail,
                });
              }
            }
          }
        }
      } else {
        console.log('Aucune donnée utilisateur trouvée.');
      }
      localStorage.setItem('Gérants', JSON.stringify(this.Gerants)); // Mettre les listes dans le local storage pour les récupérer dans les autres fichiers
      localStorage.setItem('Autres', JSON.stringify(this.Autres));
      localStorage.setItem('Rh', JSON.stringify(this.Rh));
      localStorage.setItem('Serveurs', JSON.stringify(this.Serveurs));
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données utilisateur : ",
        error
      );
    }
  }
}
