import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
import { Statut } from '../../../interfaces/statut';
import { getDatabase, ref, push, onChildAdded, onValue } from 'firebase/database';
import { FirebaseApp } from '@angular/fire/app';
import { MessageModel } from '../messages_models/model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-messagerie',
  templateUrl: './app.messagerie.component.html',
  styleUrls: ['./app.messagerie.component.css']
})

export class AppMessagerieComponent implements OnInit {
  notification!: boolean[];
  statut!: Statut;
  userId = '0uNzmnBI0jYYspF4wNXdRd2xw9Q2'; //  ID de l'utilisateur à récupérer
  analyseCanal = true;
  budgetCanal = true;
  factureCanal = true;
  planningCanal = true;
  stockCanal = true;
  inputText!: string;
  firebaseApp: FirebaseApp | undefined;
  
  messagerie!: MessageModel[];
  datePipe = new DatePipe('fr-FR');
  just_once = true;
  separationDateB!: boolean;
  heure!: number;

  constructor(firebaseApp: FirebaseApp, private firebaseService: FirebaseService) {  
    this.firebaseApp = firebaseApp;
    this.fetchData();
    this.messagerie = [];
  }

  async ngOnInit(): Promise<void> { //: Promise<void>
    this.notification = [true, true, true, true, true, true, true];
    this.statut = await this.firebaseService.fetchUserStatus(this.userId); //await
    //this.showCanal();
    this.fetchTimeServer();
    this.updateSeparationDate();
  }

  /*
  showCanal() {
    if(this.statut.stock === 'wr' || this.statut.stock === 'rw' || this.statut.stock === 'r' ) this.stockCanal = true;
    if(this.statut.analyse === 'wr' || this.statut.analyse === 'rw' || this.statut.stock === 'r' ) this.stockCanal = true;
    if(this.statut.budget === 'wr' || this.statut.budget === 'rw' || this.statut.stock === 'r' ) this.budgetCanal = true;
    if(this.statut.facture === 'wr' || this.statut.facture === 'rw' || this.statut.stock === 'r' ) this.factureCanal = true;
    if(this.statut.planning === 'wr' || this.statut.planning === 'rw' || this.statut.stock === 'r' ) this.planningCanal = true;
  }
  */
  
  anaConv = "conversations/deliss_pizz/deliss_pizz/del42_ana_037581";
  comConv = "conversations/deliss_pizz/deliss_pizz/del42_com_238402";
  facConv = "conversations/deliss_pizz/deliss_pizz/del42_fac_238402";
  invConv = "conversations/deliss_pizz/deliss_pizz/del42_inv_684939";
  recConv = "conversations/deliss_pizz/deliss_pizz/del42_rec_937590";
  convActive = this.anaConv;  

  /*
  selectConv(conversation: string){

    this.convActive = conversation;
  }
  */
  messageInput = document.getElementById("messageInput");

  updateNotification(index: number){
    this.notification[index] = !this.notification[index];
  }

  //recuperation heure du serveur
  fetchTimeServer(): number {
    const db = getDatabase();
    onValue(ref(db, '.info/serverTimeOffset'), (snapshot) => {
      const offset: number = snapshot.val() || 0;
      this.heure = Date.now() + offset;
    })
    return this.heure;
  }

  updateSeparationDate() {
    if((this.datePipe.transform(this.fetchTimeServer(), 'HH:mm') == "00:00")) {
      this.separationDateB = true;
    }
  }
  
  sendMessage(){
    if(this.inputText != '') {
      const db = getDatabase(this.firebaseApp);

      //Création du nouveau message
      const newMessage = {
        auteur: localStorage.getItem("user_email"),
        contenu: this.inputText,
        horodatage: this.fetchTimeServer()
      }
      //Ecriture du message dans la BDD
      const nodeRef = ref(db, this.convActive);
      push(nodeRef, newMessage).then(() => {
        console.log("New message with custom name created successfully");
      })
      .catch((error) => {
        console.error("Error creating new message:", error);
      });
    }
    this.inputText = "";
    this.separationDateB = false;
    this.scroll();
  }

  fetchData() {
    // Création d'une instance de la database
    const db = getDatabase(this.firebaseApp);
    // Node à monitorer
    const dataRef = ref(db, this.convActive);

    onChildAdded(dataRef, (snapshot) => {
      console.log('new message detected');
      const data = snapshot.val();
      const donneesMessage = new MessageModel();
      donneesMessage.auteur = data.auteur;
      donneesMessage.contenu = data.contenu;
      donneesMessage.horodatage = data.horodatage;
      this.messagerie.push(donneesMessage);
    });
  }

  getMessagerie(): MessageModel[]{
    return this.messagerie;
  }

  //Scroll quand un message est envoyé
  scroll() {
    const el_msg = document.getElementById('messages');
    if(el_msg) {

    }
  }
}

