import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
import { Statut } from '../../../interfaces/statut';
import { User } from '../../../interfaces/user';
import { getDatabase, ref, push, update, get, onChildAdded, onValue, DatabaseReference} from 'firebase/database';
import { FirebaseApp } from '@angular/fire/app';
import { MessageModel } from '../messages_models/model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-messagerie',
  templateUrl: './app.messagerie.component.html',
  styleUrls: ['./app.messagerie.component.css']
})

export class AppMessagerieComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private scrollContainer!: ElementRef;

  anaConv = "conversations/deliss_pizz/deliss_pizz/del42_ana_037581";
  comConv = "conversations/deliss_pizz/deliss_pizz/del42_com_238402";
  facConv = "conversations/deliss_pizz/deliss_pizz/del42_fac_238402";
  invConv = "conversations/deliss_pizz/deliss_pizz/del42_inv_684939";
  recConv = "conversations/deliss_pizz/deliss_pizz/del42_rec_937590";

  @Input() convActive: string = 'conversations/deliss_pizz/deliss_pizz/del42_ana_037581' ; // Propriété d'entrée pour convActive

  notification!: {[canal: string]: boolean};
  statut!: Statut;
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
  }

  async ngOnInit(): Promise<void> { //: Promise<void>
    this.notification = { 'ana': false, 'com': false, 'fac': false, 'inv': false, 'rec': false, 'plan': false, 'rh': false};
    this.email = this.firebaseService.getEmailLocalStorage();
    this.statut = await this.firebaseService.getUserStatutsLocalStorage(this.email); //await
    await this.updateUserNotification(this.email);
    //this.showCanal();
    this.fetchTimeServer();
    this.scrollToBottom();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
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
        horodatage: this.fetchTimeServer()
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
        this.updateUserNotification(this.email);
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
      this.updateUserNotification(this.email);
  
  }
  
  // NOTIFICATIONS (géré par 0 ou 1 car pourra être amélioré en nombre pour le nombre de messages non lu)
  async updateUserNotification(user_email: string): Promise<void> {
    const db = getDatabase(this.firebaseApp);

    this.firebaseService.getUserDataReference(user_email)
      .then((userRef: DatabaseReference | null) => {
        if (userRef) {
          get(userRef)
            .then((snapshot) => {
              const userSnapShot = snapshot.val();
              const notificationCanaux = userSnapShot.notificationCanaux;
              for (const canal of Object.keys(notificationCanaux)) {
                if (notificationCanaux[canal as keyof typeof notificationCanaux] == 0) {
                  this.notification[canal] = false;
                } else {
                  this.notification[canal] = true;
                }
                // console.log(`${canal}: ${notificationCanaux[canal as keyof typeof notificationCanaux]}`);
              }
            });
        }
      })
      .catch(error => {
        // Gestion de l'erreur
      });
  }



  //Scroll quand un message est envoyé
  scrollToBottom() {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(error) {}
  }
}
