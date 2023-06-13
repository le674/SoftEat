import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FirebaseApp } from "@angular/fire/app";
import { getDatabase, ref, onValue, get} from 'firebase/database';
import { Statut } from '../../../interfaces/statut';
import { MessageModel } from '../messages_models/model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'message-template',
  templateUrl: './app.message.template.component.html',
  styleUrls: ['./app.message.template.component.css']
})

export class AppMessageTemplateComponent implements OnInit {

  @Input() listeMessages!: MessageModel;


  message!: string;
  statut!: Statut;
  email!: any;
  userId = '0uNzmnBI0jYYspF4wNXdRd2xw9Q2';
  // private http!: HttpClient; // Dois être défini dans le constructeur
  heure!: string;
  firebaseApp: FirebaseApp | undefined;
  name!: string;
  surname!: string;


  constructor(private http: HttpClient, firebaseApp: FirebaseApp, private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.message = "received";
    this.statut = {is_prop:false, stock:"", alertes:"", analyse:"", budget:"", facture:"", planning:""};
    this.fetchTimeServer();
    this.email = this.firebaseService.getEmailLocalStorage();
    this.getName();
  }

  fetchUserStatus() {
    const db = getDatabase(this.firebaseApp);

    const userStatusRef = ref(db, 'users/foodandboost_prop/' + this.userId + '/statut');

    onValue(userStatusRef, (snapshot) => {
      const statut = snapshot.val();
      // this.statut.alertes = statut.alertes;
      this.statut.analyse = statut.analyse;
      this.statut.budget = statut.budget;
      this.statut.facture = statut.facture;
      this.statut.planning = statut.planning;
      this.statut.stock = statut.stock;
    }, (error) => {
      console.log('Une erreur s\'est produite lors de la récupération des statuts :', error);
    });

  }

  getEmail() {
    this.email = localStorage.getItem("user_email") as string;
  }

  async getName(): Promise<void> { //: Promise<string>
    const db = getDatabase(this.firebaseApp);
    const usersRef = ref(db, 'users/foodandboost_prop');
    const usersSnapShot = await get(usersRef);

    if (usersSnapShot.exists()) {

      usersSnapShot.forEach((userSnapShot) => {
        const user = userSnapShot.val();
        if (user.email == this.email) {
          this.name = user.nom;
          this.surname = user.prenom;
        }
      });
    }
  }
}


