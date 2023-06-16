import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
import { Statut } from '../../../interfaces/statut';
import { User } from '../../../interfaces/user';
import { getDatabase, ref, push, update, get, onChildAdded, onValue, DatabaseReference} from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FirebaseApp } from '@angular/fire/app';
import { MessageModel } from '../messages_models/model';
import { DatePipe } from '@angular/common';
import { interval, take } from 'rxjs';

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

  canalActiveId = 'ana';
  notification!: {[canal: string]: boolean};
  convListUsers!: {[canal: string]: string[]};
  statut!: Statut;
  email!: string;
  surname!: string;
  name!: string;
  analyseCanal = true;
  budgetCanal = true;
  factureCanal = true;
  planningCanal = true;
  stockCanal = true;
  currentUserConv!: string;
  inputText!: string;
  firebaseApp: FirebaseApp | undefined;
  
  messagerie!: MessageModel[];
  date!: number;

  constructor(firebaseApp: FirebaseApp, private firebaseService: FirebaseService) {  
    this.firebaseApp = firebaseApp;
    this.fetchData();
    this.messagerie = [];
    this.callUpdateUserNotification();
  }

  async ngOnInit(): Promise<void> { //: Promise<void>
    this.notification = { 'ana': false, 'com': false, 'fac': false, 'inv': false, 'rec': false, 'plan': false, 'rh': false};
    this.email = this.firebaseService.getEmailLocalStorage();
    this.convListUsers = await this.firebaseService.fetchConvListUsers();
    this.getName();
    this.statut = await this.firebaseService.getUserStatutsLocalStorage(this.email); //await
    await this.updateUserNotification(this.email);
    this.markCanalAsRead(this.canalActiveId, this.email);
    //this.showCanal();
    this.fetchTimeServer();
    this.scrollToBottom();
    
    //emplacement des données de l'utilisateur
    const userPath = '/users/foodandboost_prop/';
    const db = getDatabase();
    const auth = getAuth(this.firebaseApp);

    onAuthStateChanged(auth, (currentUser) => {
    let user = currentUser;
    let userdat = user?.uid;
    const conv = ref(db, `${userPath}/${userdat}/convPrivee`);
    onValue(conv, (convSnapshot) => {
      this.currentUserConv = "".concat("conversations/deliss_pizz/employes/",convSnapshot.val());
    });
    //retour console de sa conversation
    console.log(this.currentUserConv);
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  /*
  showCanal() {
    if(this.statut.stock === 'wr' || this.statut.stock === 'rw' || this.statut.stock === 'r' ) this.stockCanal = true;
    if(this.statut.analyse === 'wr' || this.statut.analyse === 'rw' || this.statut.analyse === 'r' ) this.stockCanal = true;
    if(this.statut.budget === 'wr' || this.statut.budget === 'rw' || this.statut.budget === 'r' ) this.budgetCanal = true;
    if(this.statut.facture === 'wr' || this.statut.facture === 'rw' || this.statut.facture === 'r' ) this.factureCanal = true;
    if(this.statut.planning === 'wr' || this.statut.planning === 'rw' || this.statut.planning === 'r' ) this.planningCanal = true;
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

  switchChannel(convActive: string, canalId: string){
    this.convActive=convActive;
    this.fetchData();
    this.markCanalAsRead(canalId, this.email);
    this.canalActiveId = canalId;
  }


  async sendMessage(): Promise<void> {
    if(this.inputText != '') {
      const db = getDatabase(this.firebaseApp);

      //Création du nouveau message
      const newMessage = {
        auteur: localStorage.getItem("user_email"),
        contenu: this.inputText,
        horodatage: this.fetchTimeServer(),
        nom : this.name,
        prenom : this.surname
      }
      //Ecriture du message dans la BDD
      const nodeRef = ref(db, this.convActive);
      push(nodeRef, newMessage).then(() => {
        this.updateUnreadMessages(this.canalActiveId, this.convListUsers[this.canalActiveId]);
        this.markCanalAsRead(this.canalActiveId, this.email);
      })
      .catch((error) => {
        console.error("Error creating new message:", error);
      });
      //Envoie de la notification à tous les Users
      console.log("test notif envoie");
      
    }
    this.inputText = "";
  }

  async fetchData() {
    // Création d'une instance de la database
    const db = getDatabase(this.firebaseApp);
    // Node à monitorerRessources Humaines 
    const dataRef = ref(db, this.convActive);
    this.messagerie = [];
    onChildAdded(dataRef, (snapshot) => {
      const data = snapshot.val();
      const existingMessageIndex = this.messagerie.findIndex(
        (message) => message.horodatage === data.horodatage
      );
      if (existingMessageIndex === -1) {
        const donneesMessage = new MessageModel();
        donneesMessage.auteur = data.auteur;
        donneesMessage.contenu = data.contenu;
        donneesMessage.horodatage = data.horodatage;

        //On vérifie si le message date du même jour :
        if(this.messagerie.length >= 1) {
          const this_message_date = new Date(data.horodatage);
          const previous_msg_date = new Date(this.messagerie[this.messagerie.length-1].horodatage);
          console.log("this : ", this_message_date, "previous : ", previous_msg_date);
          if((this_message_date.getDay() !== previous_msg_date.getDay()) || (this_message_date.getMonth() !== previous_msg_date.getMonth()) || (this_message_date.getFullYear() !== previous_msg_date.getFullYear())) {
            donneesMessage.newDay = true;
          } else {
            donneesMessage.newDay = false;
          }
        } else {
          donneesMessage.newDay = true;
        }
        donneesMessage.nom = data.nom;
        donneesMessage.prenom = data.prenom;
        this.messagerie.push(donneesMessage);
      }
    });
  }

  getMessagerie(): MessageModel[]{
    return this.messagerie;
  }



  // NOTIFICATIONS (géré par 0 ou 1 car pourra être amélioré en nombre pour le nombre de messages non lu)
  async updateUnreadMessages(canalId: string, users_email: string[]): Promise<void> {
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
    await this.updateUserNotification(this.email);
  }

  // NOTIFICATIONS (géré par 0 ou 1 car pourra être amélioré en nombre pour le nombre de messages non lu)
  async markCanalAsRead(canalId: string, user_email: string): Promise<void> {
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
      await this.updateUserNotification(this.email);
  
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
                  // if (this.notification[canal] = true)  this.notification[canal] = false;
                  this.notification[canal] = false;
                } else {
                  // if (this.notification[canal] = false) this.notification[canal] = true;
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

  //NOTIFICATIONS, Appel de updateUserNotification() toutes les 5 secondes
  callUpdateUserNotification() {
    const interval$ = interval(5000);
    
    interval$
    .pipe(take(Infinity))
    .subscribe(() => {
      this.updateUserNotification(this.email);
    //   const convlistUsers = this.convListUsers;
    //   // for (const canal of Object.keys(convlistUsers)) {
    //   //   const listUsers = convlistUsers[canal as keyof typeof convlistUsers];
    //   //   const length = listUsers.length;
    //   //   for (var i=0; i<length; i++) {
    //   //     const user_email = listUsers[i];
    //   //     this.updateUserNotification(user_email);
    //   //   }
    //   // }
    });
  }



  //Scroll quand un message est envoyé
  scrollToBottom() {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(error) {}
  }

  // Obtenir le nom et prénom du LocalStorage
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
