import { Component, NgModule, OnInit } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
import { Statut } from '../../../interfaces/statut';
import { getDatabase, ref, push, get, child, set, onValue } from 'firebase/database';
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
  analyse!: boolean;
  budget!: boolean;
  facture!: boolean;
  planning!: boolean;
  stock!: boolean; //(this.statut.stock === 'rw');
  inputText!: string;
  firebaseApp: FirebaseApp | undefined;
  
  constructor(firebaseApp: FirebaseApp, private firebaseService: FirebaseService) {  
    this.firebaseApp = firebaseApp;
  }

  

  ngOnInit(): void {
    this.text = "it works !";
    this.notification = [true, true, true, true, true, true, true];
    this.statut = this.firebaseService.fetchUserStatus(this.userId);
    // this.showCanal();
  }


  showCanal() {
    if(this.statut.stock === 'rw' || this.statut.stock === 'r' ) {
      this.stock = true;
      console.log(this.stock);
    }
    if(this.statut.analyse === 'rw' || this.statut.analyse === 'r' ) this.stock = true;
    if(this.statut.budget === 'rw' || this.statut.budget === 'r' ) this.budget = true;
    if(this.statut.facture === 'rw' || this.statut.facture === 'r' ) this.facture = true;
    if(this.statut.planning === 'rw' || this.statut.planning === 'r' ) this.planning = true;
  }

  messageInput = document.getElementById("messageInput");

  updateNotification(index: number){
    this.notification[index] = !this.notification[index];
  }
  

  
  sendMessage(){
    if(this.inputText != '') {
      const db = getDatabase(this.firebaseApp);

      //Récupération du nombre de messages dans la conversation
      const nb_messageRef = ref(db, "conversations/deliss_pizz/deliss_pizz/del42_ana_037581");
      let nb_messages = 0;
      onValue(nb_messageRef, (snapshot) => {
        nb_messages = snapshot.val();
        console.log("Retrieved data:", nb_messages);
      }, (error) => {
        console.error("Error retrieving data:", error);
      });

      //Création du nouveau message
      const newMessage = {
        auteur: 'matthieu',
        contenu: this.inputText,
        horodatage: new Date().getHours() + ":" + new Date().getMinutes()
      }

      //Ecriture du message dans la BDD
      const nodeName = `message_${nb_messages}`;
      const nodeRef = ref(db, `conversations/deliss_pizz/deliss_pizz/del42_ana_037581`);
      
      set(nodeRef, newMessage)
      //Mise à jour du nombre de messages

      set(ref(db, "conversations/deliss_pizz/deliss_pizz/del42_ana_037581"), {
        nb_messages: nb_messages+1
      }).then(() => {
        console.log("New message with custom name created successfully");
      })
      .catch((error) => {
        console.error("Error creating new message:", error);
      });
    }
    this.inputText = "";
  }
}

