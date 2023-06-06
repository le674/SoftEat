import { Component, OnInit } from '@angular/core';
import { FirebaseApp, initializeApp } from "@angular/fire/app";
import { getDatabase, ref, onValue, child, get} from 'firebase/database';
import { Statut } from '../../../interfaces/statut';

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
  email!: string;





  constructor() { }

  ngOnInit(): void {
    this.message = "received";
    this.text = "Bonjour la messagerie !";
    this.separationDateB = true;
    this.statut = {is_prop:false, stock:"", alertes:"", analyse:"", budget:"", facture:"", planning:""};
    this.email = "";

    this.fetchUserStatus();
  }

  updateSeparationDate(){
    this.separationDateB = !this.separationDateB;
  }

  fetchUserStatus() {
    const userId = '0uNzmnBI0jYYspF4wNXdRd2xw9Q2'; //  ID de l'utilisateur à récupérer

    const firebaseConfig = {
      apiKey: "AIzaSyDPJyOCyUMDl70InJyJLwNLAwfiYnrtsDo",
      authDomain: "psofteat-65478545498421319564.firebaseapp.com",
      databaseURL: "https://psofteat-65478545498421319564-default-rtdb.firebaseio.com",
      projectId: "psofteat-65478545498421319564",
      storageBucket: "psofteat-65478545498421319564.appspot.com",
      messagingSenderId: "135059251548",
      appId: "1:135059251548:web:fb05e45e1d1631953f6199",
      measurementId: "G-5FBJE9WH0X"
    };
    const firebaseApp = initializeApp(firebaseConfig);

    const db = getDatabase(firebaseApp);
    
    const userEmailRef = ref(db, 'users/foodandboost_prop/' + userId + '/email');

    onValue(userEmailRef, (snapshot) => {
      this.email = snapshot.val();
    });
    const userStatusRef = ref(db, 'users/foodandboost_prop/' + userId + '/statut');
    onValue(userStatusRef, (snapshot) => {
      const statut = snapshot.val();
      this.statut.alertes = statut.alertes;
      this.statut.analyse = statut.analyse;
      this.statut.budget = statut.budget;
      this.statut.facture = statut.facture;
      this.statut.planning = statut.planning;
      this.statut.stock = statut.stock;
    }, (error) => {
      console.log('Une erreur s\'est produite lors de la récupération des statuts :', error);
    });

    this.text = "Voici mes statuts :\n alertes : " + this.statut.alertes + ",\n analyse : " + this.statut.analyse + ",\n budget : " + this.statut.budget + ",\n facture : " + this.statut.facture + ",\n planning : " + this.statut.planning + ",\n stock : " + this.statut.stock + ".";
  }
}
