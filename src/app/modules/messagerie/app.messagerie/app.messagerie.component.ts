import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
import { Statut } from '../../../interfaces/statut';
import {
  getDatabase,
  ref,
  onValue,
} from 'firebase/database';
import { FirebaseApp } from '@angular/fire/app';
import { Subscription, interval, take } from 'rxjs';
import { MessageInfos } from '../app.messagerie.message.infos/message-infos';
import { Employee } from 'src/app/interfaces/employee';
import { Router, UrlTree } from '@angular/router';
import { Condition, InteractionBddFirestore } from 'src/app/interfaces/interaction_bdd';
import { ConversationCalculService } from 'src/app/services/conversations/conversation-calcul.service';
import { Unsubscribe } from '@angular/fire/firestore';
import { Conversation } from 'src/app/interfaces/conversation';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-messagerie',
  templateUrl: './app.messagerie.component.html',
  styleUrls: ['./app.messagerie.component.css'],
})
export class AppMessagerieComponent implements OnInit, OnDestroy ,AfterViewChecked {
  @ViewChild('scrollMe') private scrollContainer!: ElementRef;
  public anaConv = "";
  public comConv = "";
  public facConv = "";
  public invConv = "";
  public recConv = "";
  public rhConv = "";
  private url: UrlTree;
  private prop:string;
  private restaurant:string;
  private path_to_employee:Array<string>;
  private path_to_conv:Array<string>;
  public employee:Employee | null;
  @Input() convActive: string = ""; // Propriété d'entrée pour convActive
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
  shouldScroll = false;
  maxScroll = 0;
  messagerie!: MessageInfos[];
  convEmployes!: string[];
  selector!: string;
  date!: number;
  author_is_me!: boolean[];
  isBot!: boolean[];
  req_employee_unsub!: Unsubscribe;
  req_employee!: Subscription
  req_conversations_unsub!: Unsubscribe;
  req_conversations!: Subscription
  messageInput = document.getElementById('messageInput');

  constructor(
    private router: Router,
    private firebaseApp: FirebaseApp,
    private firebaseService: FirebaseService,
    private conv_service:ConversationCalculService,
    private auth:Auth
  ) {
    this.firebaseApp = firebaseApp;
    this.fetchData();
    this.messagerie = [];
    this.callUpdateUserNotification();
    this.url = this.router.parseUrl(this.router.url);
    this.prop = this.url.queryParams["prop"];
    this.restaurant = this.url.queryParams["restaurant"];
    this.path_to_employee = Employee.getPathsToFirestore(this.prop);
    this.path_to_conv = Conversation.getPathsToFirestore(this.prop, this.restaurant);
    this.employee = null;
    this.anaConv = this.restaurant.substring(0,2) + "42" + "_ana";
    this.comConv = this.restaurant.substring(0,2) + "42" + "_com";
    this.facConv = this.restaurant.substring(0,2) + "42" + "_fac";
    this.invConv = this.restaurant.substring(0,2) + "42" + "_inv";
    this.recConv = this.restaurant.substring(0,2) + "42" + "_rec";
    this.rhConv = this.restaurant.substring(0,2) + "42" + "_rh";
  }
  ngOnDestroy(): void {
    this.req_employee_unsub();
    this.req_employee.unsubscribe();
    this.req_conversations_unsub();
    this.req_conversations.unsubscribe();
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
  ngOnInit(): void {
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
    this.req_employee_unsub = this.firebaseService.getFromFirestoreBDD(this.path_to_employee, Employee, null);
    this.req_employee = this.firebaseService.getFromFirestore().subscribe((_employees:Array<InteractionBddFirestore>) => {
      let employees = _employees as Array<Employee>;
      employees = employees.filter((employee) => employee.convPrivee !== null)
      this.convListUsers = this.conv_service.fetchConvListUsers(employees);
      this.convEmployes = employees.map((employee) => employee.convPrivee) as string[];
      let curr_employee = employees.find((employee) => employee.email === this.email);
      if(curr_employee && curr_employee.name && curr_employee.surname){
        this.employee = curr_employee;
        this.name = curr_employee.name;
        this.surname = curr_employee.surname;
        this.statut = curr_employee.statut;
        this.currentUserConv  = this.rhConv;
      }
    })
    this.updateUserNotification(this.email);
    this.markconvAsRead(this.convActiveId, this.email);
    this.showconv();
    this.fetchTimeServer();
    this.scrollToBottom();
  }

  /**
   *
   * @param employee
   */
  processConvEmployes(employee: string) {
    this.convActive = employee;
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
    const db = getDatabase(this.firebaseApp);
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
/*     const previousDataRef = ref(getDatabase(this.firebaseApp), this.convActive);
    off(previousDataRef); */
    console.log(convActive);
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
      let new_message = new Conversation();
      new_message.author = this.email;
      new_message.container = this.convActive;
      new_message.timestamp = this.fetchTimeServer();
      new_message.name = this.name;
      new_message.surname = this.surname;
      new_message.content = this.inputText;
      this.firebaseService.setFirestoreData(new_message, this.path_to_conv, Conversation).then(() => {
      //Envoie de la notification à tous les Users
        this.updateUnreadMessages(
          this.convActiveId,
          this.convListUsers[this.convActiveId]
        );
        this.markconvAsRead(this.convActiveId, this.email);
          }).catch((err) => {
              console.error('Error creating new message:', err);
          })
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
    this.messagerie = [];
    console.log("conv active");
    console.log(this.convActive);
    
    const conditions:Array<Condition> = [{
      attribut: "container",
      condition: "==",
      value:this.convActive
    }];
    this.req_conversations_unsub = this.firebaseService.getFromFirestoreChangeDataBDD(this.path_to_conv, Conversation, conditions);
    this.req_conversations = this.firebaseService.getFromFirestoreChangeData().subscribe((data) => {
      const conversation = data as Conversation;
      const existingMessageIndex = this.messagerie.findIndex(
        (messageInfos) => messageInfos.message.timestamp === conversation.timestamp
      );
            //On récupère les informations si et seulement si le message correspond à celui qu'on veut
            if (existingMessageIndex === -1) {
              const donneesMessage = new MessageInfos();
              // console.log(donneesMessage);
              donneesMessage.message.author = conversation.author;
              donneesMessage.message.content = conversation.content;
              donneesMessage.message.timestamp = conversation.timestamp;
      
              //On vérifie si le message date du même jour que le précédent :
              if (this.messagerie.length >= 1) {
                const this_message_date = new Date(conversation.timestamp);
                const previous_msg_date = new Date(
                  this.messagerie[this.messagerie.length - 1].message.timestamp
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
              donneesMessage.message.name = conversation.name;
              donneesMessage.message.surname = conversation.surname;
      
              //On regarde si on met le message à gauche ou à droite de la messagerie selon l'auteur
              if (conversation.author === this.email) {
                donneesMessage.authorIsMe = true;
              } else {
                donneesMessage.authorIsMe = false;
                if (conversation.author === 'softeat@gmail.com') {
                  donneesMessage.isBot = true;
                } else {
                  donneesMessage.isBot = false;
                }
              }
              this.messagerie.push(donneesMessage);
            }
    })
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
    users_email.forEach((email) => {
      if(this.employee !== null){
        const notifConversations = this.employee.notifConversations || {};
        notifConversations[convId] = 1;
        this.employee.notifConversations = notifConversations;
        // Mise à jour dans la BDD de la valeur de la clé de la conv du user
        this.firebaseService.updateFirestoreData(this.employee.id, this.employee, this.path_to_employee ,Employee).then(() => {
          console.log("User's notification marked as read");
        })
        .catch((error) => {
          console.error("Error updating user's notification:", error);
        });
      }
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
    if(this.employee){
      const notifConversations = this.employee.notifConversations || {};
      notifConversations[convId] = 0; 
      this.employee.notifConversations = notifConversations;
      this.firebaseService.updateFirestoreData(this.employee.id, this.employee, this.path_to_employee ,Employee).then(() => {
        console.log("User's notification marked as read");
      })
      .catch((error) => {
        console.error("Error updating user's notification:", error);
      });
    }
    await this.updateUserNotification(this.email);
  }

  /** NOTIFICATIONS :
   *  (géré par 0 ou 1 car pourra être amélioré en nombre pour le nombre de messages non lu)
   */
  async updateUserNotification(user_email: string): Promise<void> {
    if(this.employee){
      const notifConversations =  this.employee.notifConversations
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
    }
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
}
