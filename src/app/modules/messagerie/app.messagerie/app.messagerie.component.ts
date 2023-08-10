import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
import { Statut } from '../../../interfaces/statut';
import { User } from '../../../interfaces/user';
import {
  getDatabase,
  ref,
  push,
  update,
  get,
  onChildAdded,
  off,
  onValue,
  DatabaseReference,
} from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FirebaseApp } from '@angular/fire/app';
import { interval, take } from 'rxjs';
import { MessageInfos } from '../app.messagerie.message.infos/message-infos';
import { Employee } from 'src/app/interfaces/employee';

@Component({
  selector: 'app-messagerie',
  templateUrl: './app.messagerie.component.html',
  styleUrls: ['./app.messagerie.component.css'],
})
export class AppMessagerieComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private scrollContainer!: ElementRef;

  anaConv = 'conversations/deliss_pizz/deliss_pizz/del42_ana_037581';
  comConv = 'conversations/deliss_pizz/deliss_pizz/del42_com_238402';
  facConv = 'conversations/deliss_pizz/deliss_pizz/del42_fac_238402';
  invConv = 'conversations/deliss_pizz/deliss_pizz/del42_inv_684939';
  recConv = 'conversations/deliss_pizz/deliss_pizz/del42_rec_937590';

  @Input() convActive: string =
    'conversations/deliss_pizz/deliss_pizz/del42_ana_037581'; // Propriété d'entrée pour convActive

  convActiveId = 'ana';
  notification!: { [conv: string]: boolean };
  convListUsers!: { [conv: string]: string[] };
  statut!: Statut;
  email!: string;
  surname!: string;
  name!: string;
  analyseConv!: boolean;
  budgetConv!: boolean;
  factureConv!: boolean;
  planningConv!: boolean;
  stockConv!: boolean;
  currentUserConv!: string;
  inputText!: string;
  firebaseApp: FirebaseApp | undefined;
  shouldScroll = false;
  maxScroll = 0;

  messagerie!: MessageInfos[];
  convEmployes!: string[];
  selector!: string;

  date!: number;

  author_is_me!: boolean[];
  isBot!: boolean[];

  messageInput = document.getElementById('messageInput');

  constructor(
    firebaseApp: FirebaseApp,
    private firebaseService: FirebaseService
  ) {
    this.firebaseApp = firebaseApp;
    this.fetchData();
    this.messagerie = [];
    this.callUpdateUserNotification();
  }

  /**
   *
   */
  showconv() {
    if (
      this.statut.stock === 'wr' ||
      this.statut.stock === 'rw' ||
      this.statut.stock === 'r'
    )
      this.stockConv = true;
    if (
      this.statut.analyse === 'wr' ||
      this.statut.analyse === 'rw' ||
      this.statut.analyse === 'r'
    )
      this.analyseConv = true;
    if (
      this.statut.budget === 'wr' ||
      this.statut.budget === 'rw' ||
      this.statut.budget === 'r'
    )
      this.budgetConv = true;
    if (
      this.statut.facture === 'wr' ||
      this.statut.facture === 'rw' ||
      this.statut.facture === 'r'
    )
      this.factureConv = true;
    if (
      this.statut.planning === 'wr' ||
      this.statut.planning === 'rw' ||
      this.statut.planning === 'r'
    )
      this.planningConv = true;
  }

  async ngOnInit(): Promise<void> {
    this.notification = {
      ana: false,
      com: false,
      fac: false,
      inv: false,
      rec: false,
      plan: false,
      rh: false,
    };
    this.email = this.firebaseService.getEmailLocalStorage();
    this.convListUsers = await this.firebaseService.fetchConvListUsers();
    this.getName();
    this.statut = await this.firebaseService.getUserStatutsLocalStorage(
      this.email
    ); //await
    await this.updateUserNotification(this.email);
    this.markconvAsRead(this.convActiveId, this.email);
    this.showconv();
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
        this.currentUserConv = ''.concat(
          'conversations/deliss_pizz/employes/',
          convSnapshot.val()
        );
      });
      //retour console de sa conversation
      // console.log(this.currentUserConv);
    });

    if (this.planningConv) {
      const emplacementConv = 'conversations/deliss_pizz/employes';
      const emplacementRef = ref(db, emplacementConv);

      onValue(emplacementRef, (snapshot) => {
        let keys: string[] = Object.keys(snapshot.val());
        // console.log('Clés récupérées:', keys);
        this.convEmployes = keys;
      });
    }
  }

  /**
   *
   * @param employee
   */
  processConvEmployes(employee: string) {
    this.selector = employee;
    // console.log('Liste des employes' + this.convEmployes);
    this.convActive = ''.concat(
      'conversations/deliss_pizz/employes/',
      employee
    );
    this.switchChannel(this.convActive, '');
  }

  /**
   * Scroll la page vers le bas à chaque fois que "shouldScroll" vaut "true"
   * et que le scroll a bien été appliqué. On vérifie cela avec la valeur "maxScroll" qui
   * décrit la valeur du scroll précédement appliquée. Si elle est différente de la dernière
   * valeur de scroll appliquée, c'est qu'on a changé de conv ou qu'un nouveau message est apparu.
   * Dans ces cas-là, on scroll.
   */
  ngAfterViewChecked(): void {
    if (this.maxScroll !== this.scrollContainer.nativeElement.scrollHeight) {
      this.shouldScroll = true;
    } else {
      this.shouldScroll = false;
    }

    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  /**
   * Récupération de l'heure du serveur Firebase et ajout d'un offset pour avoir l'heure
   * française. Ainsi tous les composants de la messagerie partagent la même heure.
   *
   * @returns timestamp (heure française) à l'instant T
   */
  fetchTimeServer(): number {
    const db = getDatabase();
    onValue(ref(db, '.info/serverTimeOffset'), (snapshot) => {
      const offset: number = snapshot.val() || 0;
      this.date = Date.now() + offset;
    });
    return this.date;
  }

  /**
   *
   * @param convActive
   * @param convId
   */
  switchChannel(convActive: string, convId: string) {
    // Arrêter l'écoute des modifications du conv précédent
    const previousDataRef = ref(getDatabase(this.firebaseApp), this.convActive);
    off(previousDataRef);

    // Mettre à jour la référence du conv actif
    this.convActive = convActive;
    // Réinitialiser la liste des messages
    this.messagerie = [];

    // Démarrer l'écoute des modifications du nouveau conv
    this.fetchData();

    // Retirer la notif du conv actif
    if (convId != '') {
      this.selector = '';
      this.markconvAsRead(convId, this.email);
    }
    this.convActiveId = convId;
    console.log('shouldscroll');
    this.maxScroll = 0;
  }

  /**
   * Déclenche l'envoi d'un message dans la base de données. Récupère l'heure, le nom et prénom
   * de l'utilisateur (celui-ci doit avoir son nom et prénom enregistré dans la base de données).
   * Lorsqu'un message est envoyé, un scroll est appliqué afin de voir apparaître le nouveau message.
   */
  async sendMessage(): Promise<void> {
    if (this.inputText != '') {
      const db = getDatabase(this.firebaseApp);

      //Création du nouveau message
      const newMessage = {
        auteur: localStorage.getItem('user_email'),
        contenu: this.inputText,
        horodatage: this.fetchTimeServer(),
        nom: this.name,
        prenom: this.surname,
      };
      //Ecriture du message dans la BDD
      const nodeRef = ref(db, this.convActive);
      push(nodeRef, newMessage)
        .then(() => {
          //Envoie de la notification à tous les Users
          this.updateUnreadMessages(
            this.convActiveId,
            this.convListUsers[this.convActiveId]
          );
          this.markconvAsRead(this.convActiveId, this.email);
        })
        .catch((error) => {
          console.error('Error creating new message:', error);
        });
    }
    this.inputText = '';
    this.shouldScroll = true;
  }

  /**
   * Récupère tous les messages d'un conv. Les message ainsi récupérés sont ajoutés à
   * un objet de type "MessageInfos" dont le rôle est de passer au DOM les informations
   * provenant de la base de données.
   */
  async fetchData() {
    // Création d'une instance de la database
    const db = getDatabase(this.firebaseApp);
    // Node à monitorerRessources Humaines
    const dataRef = ref(db, this.convActive);
    this.messagerie = [];

    //Pour tous les messages (qui ici sont les "child")
    onChildAdded(dataRef, (snapshot) => {
      // console.log("dataRef : " + dataRef);
      const data = snapshot.val();
      const existingMessageIndex = this.messagerie.findIndex(
        (messageInfos) => messageInfos.message.horodatage === data.horodatage
      );

      //On récupère les informations si et seulement si le message correspond à celui qu'on veut
      if (existingMessageIndex === -1) {
        const donneesMessage = new MessageInfos();
        // console.log(donneesMessage);
        donneesMessage.message.auteur = data.auteur;
        donneesMessage.message.contenu = data.contenu;
        donneesMessage.message.horodatage = data.horodatage;

        //On vérifie si le message date du même jour que le précédent :
        if (this.messagerie.length >= 1) {
          const this_message_date = new Date(data.horodatage);
          const previous_msg_date = new Date(
            this.messagerie[this.messagerie.length - 1].message.horodatage
          );
          if (
            this_message_date.getDay() !== previous_msg_date.getDay() ||
            this_message_date.getMonth() !== previous_msg_date.getMonth() ||
            this_message_date.getFullYear() !== previous_msg_date.getFullYear()
          ) {
            donneesMessage.message.newDay = true;
          } else {
            donneesMessage.message.newDay = false;
          }
        } else {
          donneesMessage.message.newDay = true;
        }
        donneesMessage.message.nom = data.nom;
        donneesMessage.message.prenom = data.prenom;

        //On regarde si on met le message à gauche ou à droite de la messagerie selon l'auteur
        if (data.auteur === this.email) {
          donneesMessage.authorIsMe = true;
        } else {
          donneesMessage.authorIsMe = false;
          if (data.auteur === 'softeat@gmail.com') {
            donneesMessage.isBot = true;
          } else {
            donneesMessage.isBot = false;
          }
        }
        this.messagerie.push(donneesMessage);
      }
    });
  }

  /** NOTIFICATIONS :
   * (géré par 0 ou 1 car pourra être amélioré en nombre pour le nombre de messages non lu)
   * Met à 1 la clé de la conversation (transmise par convId) et ce pour tous les Users participants 
   * à cette conversation (transmis par users_email[]).
   * L'appel de this.updateUserNotification(this.email) actualise le badge de la notification de
   * toutes ses conversations, immédiatement et n'attend pas la boucle de 5 secondes.
   */
  async updateUnreadMessages(
    convId: string,
    users_email: string[]
  ): Promise<void> {
    const db = getDatabase(this.firebaseApp);

    users_email.forEach((email) => {
      this.firebaseService
        .getUserDataReference(email)
        .then((userRef: DatabaseReference | null) => {
          if (userRef) {
            // Query de récupération du user
            get(userRef).then((snapshot) => {
              const user: Employee = snapshot.val();
              const notifConversations = user.notifConversations || {};
              notifConversations[convId] = 1;
              // Mise à jour dans la BDD de la valeur de la clé de la conv du user
              update(userRef.ref, { notifConversations })
                .then(() => {
                  console.log("User's notification updated successfully");
                })
                .catch((error) => {
                  console.error("Error updating user's notification:", error);
                });
            });
          }
        })
        .catch((error) => {
          console.error("Error updating user's notification:",error);
        });
    });
    await this.updateUserNotification(this.email);
  }

  /** NOTIFICATIONS :
   * (géré par 0 ou 1 car pourra être amélioré en nombre pour le nombre de messages non lu)
   * Met à 0 la clé de la conversation (transmise par convId) pour le User (transmis par user_email).
   * L'appel de this.updateUserNotification(this.email) actualise le badge de la notification de
   * toutes ses conversations, immédiatement et n'attend pas la boucle de 5 secondes.
   */
  async markconvAsRead(convId: string, user_email: string): Promise<void> {
    const db = getDatabase(this.firebaseApp);

    this.firebaseService
      .getUserDataReference(user_email)
      .then((userRef: DatabaseReference | null) => {
        if (userRef) {
          get(userRef).then((snapshot) => {
            const user: Employee = snapshot.val();
            const notifConversations = user.notifConversations || {};
            notifConversations[convId] = 0;
            update(userRef.ref, { notifConversations })
              .then(() => {
                console.log("User's notification marked as read");
              })
              .catch((error) => {
                console.error("Error updating user's notification:", error);
              });
          });
        }
      })
      .catch((error) => {
        console.error("Error updating user's notification:",error);
      });

    await this.updateUserNotification(this.email);
  }

  /** NOTIFICATIONS :
   *  (géré par 0 ou 1 car pourra être amélioré en nombre pour le nombre de messages non lu)
   */
  async updateUserNotification(user_email: string): Promise<void> {
    const db = getDatabase(this.firebaseApp);

    this.firebaseService
      .getUserDataReference(user_email)
      .then((userRef: DatabaseReference | null) => {
        if (userRef) {
          get(userRef).then((snapshot) => {
            const userSnapShot = snapshot.val();
            const notifConversations = userSnapShot.notifConversations;
            for (const conv of Object.keys(notifConversations)) {
              if (
                notifConversations[conv as keyof typeof notifConversations] ==
                0
              ) {
                this.notification[conv] = false;
              } else {
                this.notification[conv] = true;
              }
            }
          });
        }
      })
      .catch((error) => {
        // Gestion de l'erreur
      });
  }

  /** NOTIFICATIONS :
   * Appelle updateUserNotification() toutes les 5 secondes.
   */
  callUpdateUserNotification() {
    const interval$ = interval(5000);

    interval$.pipe(take(Infinity)).subscribe(() => {
      this.updateUserNotification(this.email);
    });
  }

  /**
   * Scroll en bas de la page. Garde en mémoire la valeur du scroll appliqué.
   */
  scrollToBottom() {
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
      this.maxScroll = this.scrollContainer.nativeElement.scrollHeight;
    } catch (error) {}
  }

  /**
   * Récupère le nom et prénom à partir de l'e-mail de l'utilisateur.
   */
  async getName(): Promise<void> {
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
