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

  updateSeparationDate(){
    this.separationDateB = !this.separationDateB;
  }

  getEmail() {
    this.email = localStorage.getItem("user_email") as string;
  }

  // fetchUserStatus() {
  //   const db = getDatabase(this.firebaseApp);

  //   const userStatusRef = ref(db, 'users/foodandboost_prop/' + this.userId + '/statut');

  //   onValue(userStatusRef, (snapshot) => {
  //     const statut = snapshot.val();
  //     // this.statut.alertes = statut.alertes;
  //     this.statut.analyse = statut.analyse;
  //     this.statut.budget = statut.budget;
  //     this.statut.facture = statut.facture;
  //     this.statut.planning = statut.planning;
  //     this.statut.stock = statut.stock;
  //   }, (error) => {
  //     console.log('Une erreur s\'est produite lors de la récupération des statuts :', error);
  //   });

    // this.text = localStorage.getItem("user_email") as string;
  // }

  //recuperation heure du serveur
  fetchTimeServer(){
    this.http.get('http://worldtimeapi.org/api/timezone/Europe/Paris').subscribe((data: any) => {
      const utcDateTime = data.utc_datetime.slice(11,16); //"utc_datetime": "2023-06-06T12:50:44.493419+00:00"
      const utcOffset = data.utc_offset; //"utc_offset": "+02:00"
      const offsetHours = parseInt(utcOffset.slice(1, 3), 10);
      const utcHourSplit = utcDateTime.split(':');
      
      const hoursInt = parseInt(utcHourSplit[0], 10);
      let hours = hoursInt + offsetHours;
      if (hours >= 24) {
        hours -= 24;
      };
      this.heure = hours.toString().padStart(2, '0') + ':' + utcHourSplit[1];

    });
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


