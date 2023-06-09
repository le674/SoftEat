import { Component, OnInit } from '@angular/core';
import { FirebaseApp, initializeApp } from "@angular/fire/app";
import { getDatabase, ref, onValue} from 'firebase/database';
import { Statut } from '../../../interfaces/statut';
import { HttpClient } from '@angular/common/http';
import { FirebaseService } from '../../../services/firebase.service';


@Component({
  selector: 'message-template',
  templateUrl: './app.message.template.component.html',
  styleUrls: ['./app.message.template.component.css']
})
export class AppMessageTemplateComponent implements OnInit {
  date = new Date();
  text!: string;
  message!: string;
  separationDateB!: boolean;
  statut!: Statut;
  email!: any;
  // private http!: HttpClient; // Dois être défini dans le constructeur
  heure!: string;
  firebaseApp: FirebaseApp | undefined;


  constructor(private http: HttpClient, firebaseApp: FirebaseApp) { }

  ngOnInit(): void {
    this.message = "received";
    this.text = "Bonjour la messagerie !";
    this.separationDateB = true;
    this.statut = {is_prop:false, stock:"", alertes:"", analyse:"", budget:"", facture:"", planning:""};
    this.fetchUserStatus();
    this.fetchTimeServer();
  }

  updateSeparationDate(){
    this.separationDateB = !this.separationDateB;
  }

  fetchUserStatus() {
    const db = getDatabase(this.firebaseApp);

    const userId = '0uNzmnBI0jYYspF4wNXdRd2xw9Q2'; //  ID de l'utilisateur à récupérer

    const userEmailRef = ref(db, 'users/foodandboost_prop/' + userId + '/email');
    const userStatusRef = ref(db, 'users/foodandboost_prop/' + userId + '/statut');

    onValue(userEmailRef, (snapshot) => {
      this.email = snapshot.val();
    });
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

    // this.text = "Voici mes statuts :\n alertes : " + this.statut.alertes 
    // + ",\n analyse : " + this.statut.analyse + ",\n budget : " 
    // + this.statut.budget + ",\n facture : " + this.statut.facture 
    // + ",\n planning : " + this.statut.planning + ",\n stock : " 
    // + this.statut.stock + ".";
    // const userConversations = ref(db, 'restaurants/' + )
    this.text = localStorage.getItem("user_email") as string;




  }

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
}
