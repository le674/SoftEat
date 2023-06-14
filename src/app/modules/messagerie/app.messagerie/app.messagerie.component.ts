import { Component, Input, OnInit } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
import { Statut } from '../../../interfaces/statut';
import { User } from '../../../interfaces/user';
import { getDatabase, ref, push, update, onValue, get, onChildAdded, DatabaseReference} from 'firebase/database';
import { FirebaseApp } from '@angular/fire/app';
import { HttpClient } from '@angular/common/http';
import { MessageModel } from '../messages_models/model';

@Component({
  selector: 'app-messagerie',
  templateUrl: './app.messagerie.component.html',
  styleUrls: ['./app.messagerie.component.css']
})

export class AppMessagerieComponent implements OnInit {
  text!: string;
  notification!: boolean[];
  statut!: Statut;
  // userId = '0uNzmnBI0jYYspF4wNXdRd2xw9Q2'; //  ID de l'utilisateur à récupérer
  email!: string;
  analyseCanal!: boolean;
  budgetCanal!: boolean;
  factureCanal!: boolean;
  planningCanal!: boolean;
  stockCanal!: boolean; //(this.statut.stock === 'rw');
  inputText!: string;
  firebaseApp: FirebaseApp | undefined;
  http!: HttpClient;
  messagerie!: MessageModel[];
  
  constructor(firebaseApp: FirebaseApp, private firebaseService: FirebaseService, http: HttpClient) {  
    this.firebaseApp = firebaseApp;
    this.fetchData();
    this.http = http;
    this.messagerie = [];

  }

  

  async ngOnInit(): Promise<void> { //: Promise<void>
    this.text = "it works !";
    this.notification = [true, true, true, true, true, true, true];
    this.email = this.firebaseService.getEmailLocalStorage();
    this.statut = await this.firebaseService.getUserStatutsLocalStorage(this.email); //await
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

  fetchData() {
    // Création d'une instance de la database
    const db = getDatabase(this.firebaseApp);
    // Node à monitorer
    const dataRef = ref(db, 'conversations/deliss_pizz/deliss_pizz/del42_ana_037581');

    onChildAdded(dataRef, (snapshot) => {
      console.log('new message detected');
      const data = snapshot.val();
      //console.log(data);
      const donneesMessage= new MessageModel();
      donneesMessage.auteur = data.auteur;
      donneesMessage.contenu = data.contenu;
      donneesMessage.horodatage = data.horodatage;
      this.messagerie.push(donneesMessage);
      //console.log(this.messagerie);
      //Ajouter msg au DOM

    });
  }

  getMessagerie(): MessageModel[]{
    return this.messagerie;
  }


  // NOTIFICATIONS (géré par 0 ou 1 car pourra être amélioré en nombre pour le nombre de messages non lu)
  updateUnreadMessages(canalId: string, users_email: string[]): void {
    const db = getDatabase(this.firebaseApp);

    users_email.forEach(email => {
      this.firebaseService.getUserDataReference(email)
        .then((userRef: DatabaseReference | null) => {
          if (userRef) {
            get(userRef)
              .then((snapshot) => {
              const user: User = snapshot.val();
              const notificationCanaux = user.notificationCanaux || {};
              notificationCanaux[canalId] = 1;
              update(userRef.ref, { notificationCanaux })
                .then(() => {
                  console.log("User's notification updated successfully");
                })
                .catch(error => {
                  console.error("Error updating user's notification:", error);
                });
            });
          }
        })
        .catch(error => {
          // Gestion de l'erreur
        });
    });
  }

  // NOTIFICATIONS (géré par 0 ou 1 car pourra être amélioré en nombre pour le nombre de messages non lu)
  markCanalAsRead(canalId: string, user_email: string): void {
    const db = getDatabase(this.firebaseApp);

    this.firebaseService.getUserDataReference(user_email)
      .then((userRef: DatabaseReference | null) => {
        if (userRef) {
          get(userRef)
            .then((snapshot) => {
            const user: User = snapshot.val();
            const notificationCanaux = user.notificationCanaux || {};
            notificationCanaux[canalId] = 0;
            update(userRef.ref, { notificationCanaux })
                .then(() => {
                  console.log("User's notification marked as read");
                })
                .catch(error => {
                  console.error("Error updating user's notification:", error);
                });
          });
        }
      })
      .catch(error => {
        // Gestion de l'erreur
      });
  
  }


}

