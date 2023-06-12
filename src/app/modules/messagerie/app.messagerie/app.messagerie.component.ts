import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
import { Statut } from '../../../interfaces/statut';
import { getDatabase, ref, push } from 'firebase/database';
import { FirebaseApp } from '@angular/fire/app';

@Component({
  selector: 'app-messagerie',
  templateUrl: './app.messagerie.component.html',
  styleUrls: ['./app.messagerie.component.css']
})

export class AppMessagerieComponent implements OnInit {
  text!: string;
  notification!: boolean[];
  statut!: Statut;
  userId = '0uNzmnBI0jYYspF4wNXdRd2xw9Q2'; //  ID de l'utilisateur à récupérer
  analyseCanal!: boolean;
  budgetCanal!: boolean;
  factureCanal!: boolean;
  planningCanal!: boolean;
  stockCanal!: boolean; //(this.statut.stock === 'rw');
  inputText!: string;
  firebaseApp: FirebaseApp | undefined;
  
  constructor(firebaseApp: FirebaseApp, private firebaseService: FirebaseService) {  
    this.firebaseApp = firebaseApp;
  }

  

  async ngOnInit(): Promise<void> { //: Promise<void>
    this.text = "it works !";
    this.notification = [true, true, true, true, true, true, true];
    this.statut = await this.firebaseService.fetchUserStatus(this.userId); //await
    this.showCanal();
  }


  showCanal() {
    if(this.statut.stock === 'wr' || this.statut.stock === 'rw' || this.statut.stock === 'r' ) this.stockCanal = true;
    if(this.statut.analyse === 'wr' || this.statut.analyse === 'rw' || this.statut.stock === 'r' ) this.stockCanal = true;
    if(this.statut.budget === 'wr' || this.statut.budget === 'rw' || this.statut.stock === 'r' ) this.budgetCanal = true;
    if(this.statut.facture === 'wr' || this.statut.facture === 'rw' || this.statut.stock === 'r' ) this.factureCanal = true;
    if(this.statut.planning === 'wr' || this.statut.planning === 'rw' || this.statut.stock === 'r' ) this.planningCanal = true;
  }

  messageInput = document.getElementById("messageInput");

  updateNotification(index: number){
    this.notification[index] = !this.notification[index];
  }
  

  
  sendMessage(){
    if(this.inputText != '') {
      const db = getDatabase(this.firebaseApp);

      //Création du nouveau message
      const newMessage = {
        auteur: 'matthieu',
        contenu: this.inputText,
        horodatage: new Date().getTime()
      }
      //Ecriture du message dans la BDD
      const nodeRef = ref(db, `conversations/deliss_pizz/deliss_pizz/del42_ana_037581`);
      push(nodeRef, newMessage).then(() => {
        console.log("New message with custom name created successfully");
      })
      .catch((error) => {
        console.error("Error creating new message:", error);
      });
    }
    this.inputText = "";
  }

}

