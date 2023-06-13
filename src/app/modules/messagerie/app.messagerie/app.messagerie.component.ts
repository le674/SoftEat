import { Component, OnInit, Input } from '@angular/core';
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

  anaConv = "conversations/deliss_pizz/deliss_pizz/del42_ana_037581";
  comConv = "conversations/deliss_pizz/deliss_pizz/del42_com_238402";
  facConv = "conversations/deliss_pizz/deliss_pizz/del42_fac_238402";
  invConv = "conversations/deliss_pizz/deliss_pizz/del42_inv_684939";
  recConv = "conversations/deliss_pizz/deliss_pizz/del42_rec_937590";

  @Input() convActive: string = 'conversations/deliss_pizz/deliss_pizz/del42_ana_037581' ; // Propriété d'entrée pour convActive

  notification!: boolean[];
  statut!: Statut;
  //userId = '0uNzmnBI0jYYspF4wNXdRd2xw9Q2'; //  ID de l'utilisateur à récupérer
  email!: string;
  analyseCanal = true;
  budgetCanal = true;
  factureCanal = true;
  planningCanal = true;
  stockCanal = true;
  inputText!: string;
  firebaseApp: FirebaseApp | undefined;
  
  messagerie!: MessageModel[];
  datePipe = new DatePipe('fr-FR');
  newDay!: boolean;
  date!: number;

  constructor(firebaseApp: FirebaseApp, private firebaseService: FirebaseService) {  
    this.firebaseApp = firebaseApp;
    this.fetchData();
    this.messagerie = [];
    this.messageTemplate = messageTemplate;
  }

  async ngOnInit(): Promise<void> { //: Promise<void>
    this.notification = [true, true, true, true, true, true, true];
    this.email = this.firebaseService.getEmailLocalStorage();
    this.statut = await this.firebaseService.getUserStatutsLocalStorage(this.email); //await
    //this.showCanal();
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
  messageInput = document.getElementById("messageInput");

  updateNotification(index: number){
    this.notification[index] = !this.notification[index];
  }

  //recuperation heure du serveur
  fetchTimeServer(): number {
    const db = getDatabase();
    onValue(ref(db, '.info/serverTimeOffset'), (snapshot) => {
      const offset: number = snapshot.val() || 0;
      this.date = Date.now() + offset;
    })
    return this.date;
  }


  sendMessage(){
    if(this.inputText != '') {
      const db = getDatabase(this.firebaseApp);

      //Si le message est écrit un nouveau jour
      const current_day = new Date(this.fetchTimeServer()).getDay();
      const last_msg_day = new Date(this.messagerie[this.messagerie.length-1].horodatage).getDay();
      if(current_day != last_msg_day) {
        this.newDay = true;
      } else {
        this.newDay = false;
      }

      //Création du nouveau message
      const newMessage = {
        auteur: localStorage.getItem("user_email"),
        contenu: this.inputText,
        horodatage: this.messageTemplate.fetchTimeServer()
      }
      //Ecriture du message dans la BDD
      const nodeRef = ref(db, this.convActive);
      push(nodeRef, newMessage).then(() => {
      })
      .catch((error) => {
        console.error("Error creating new message:", error);
      });
    }
    this.inputText = "";
    this.scroll();
  }

  async fetchData() {
    // Création d'une instance de la database
    const db = getDatabase(this.firebaseApp);
    // Node à monitorer
    const dataRef = ref(db, this.convActive);
    this.messagerie = [];
    onChildAdded(dataRef, (snapshot) => {
      console.log('new message detected');
      const data = snapshot.val();
      const donneesMessage= new MessageModel();
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
      el_msg.scrollTop = el_msg.scrollHeight;
    }
  }
}

