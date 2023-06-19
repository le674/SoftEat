import { Injectable } from '@angular/core';
import { DayPilot } from 'daypilot-pro-angular';
import { FIREBASE_DATABASE_EMULATOR_HOST, FIREBASE_FIRESTORE_EMULATOR_HOST, FIREBASE_PROD } from 'src/environments/variables';
import { environment } from 'src/environments/environment';
import { child, push, remove, connectDatabaseEmulator, get, set, getDatabase, ref, query, orderByChild, equalTo } from 'firebase/database';
import { connectFirestoreEmulator, Firestore, getFirestore } from "firebase/firestore";
import { FirebaseApp, initializeApp } from "@angular/fire/app";
import { BehaviorSubject } from 'rxjs';

interface Event {
  start: string;
  end: string;
  text: string;
  id: string;
  tags: string;
  resource: string;
}

@Injectable()
export class CalendarService {
  events: DayPilot.EventData[] = [];
  private firebaseConfig = environment.firebase;
  private firebaseApp = initializeApp(this.firebaseConfig);
  private db = getDatabase(this.firebaseApp);
  private currentUser = localStorage.getItem("user_email") as string;
  private users = new BehaviorSubject<string>(this.currentUser)
  currentData = this.users.asObservable();
  private statusSubject = new BehaviorSubject<string>('');
  statusService = this.statusSubject.asObservable();


  constructor(private ofApp: FirebaseApp) {
    if ((location.hostname === "localhost") && (!FIREBASE_PROD)) {
      try {
        connectDatabaseEmulator(this.db, FIREBASE_DATABASE_EMULATOR_HOST.host, FIREBASE_DATABASE_EMULATOR_HOST.port);
      } catch (error) {
      }
    }
  }

  async getEventsFromAllUsers(prop: string, usersMails: string): Promise<DayPilot.EventData[]> {
    
    if (usersMails === "") {
      this.events = [];
      return this.events;
    } //Evite les erreurs dans le cas où aucun utilisateur n'est sélectionné
    
    // Sépare le string de mails d'utilisateurs en liste de mails
    const emails = usersMails.split(",");
  
    let allEvents: DayPilot.EventData[] = []; // Crée un nouveau tableau pour enregistrer tous les événements
    
    for (const userMail of emails) {
      const userEvents = await this.getEvents(prop, userMail.trim());  
      allEvents = [...allEvents, ...userEvents]; // Ajoute les événements de l'utilisateur au tableau d'événements
    }
  
    this.events = allEvents;
    return this.events;
  }
  

  async getEvents(prop: string, userMail: string): Promise<DayPilot.EventData[]> {
    this.statusSubject.next('Chargement...');
    console.log('Emitting loading status...');
    this.events = [];
    const userToken : string | null = await this.getPath(userMail);
    const path = `users/${prop}/${userToken}/planning/events` //chemin vers la BDD
    const eventsSnapshot = await get(child(ref(this.db), path)); //ensemble des events

    if (eventsSnapshot.exists()) {
      eventsSnapshot.forEach((eventSnapshot) => { //parcourt les events de la BDD
        const event = eventSnapshot.val() as Event;
          this.events.push({
            start: event.start,
            end: event.end,
            text: event.text,
            id: event.id,
            tags: event.tags,
            resource: event.resource,
          }); //ajoute chaque événement trouvé à la liste d'événements à afficher
        return false; // regarde le prochain event
      });
    } else {
      return [];
    }
    this.statusSubject.next('');
    console.log('Emitting final status...');
    return this.events;
  }

  async add_event(prop: string, user: string, newEvent: DayPilot.EventData): Promise<void> {
    
    this.statusSubject.next('Ajout des événements...');

    // Chemin vers la BDD
    const path = `users/${prop}/${user}/planning/events`;
    const pathConges = `users/${prop}/${user}/conges`;

    const daysSnapshot = await get(child(ref(this.db), pathConges));

    // converti le DayPilot.Date objet en date ISO
    const startString = newEvent.start.toString("yyyy-MM-ddTHH:mm:ss");
    const endString = newEvent.end.toString("yyyy-MM-ddTHH:mm:ss");

    const eventRef = push(child(ref(this.db), path));
    const id = eventRef.key;

    // Crée l'événement
    const event = {
      start: startString,
      end: endString,
      text: newEvent.text,
      id: id,
      tags: newEvent.tags,
      resource: newEvent.resource,
    };

    if (event.tags=="Congés"){
       const days = daysSnapshot.val() as number
       const start = new Date(event.start);
       const end = new Date(event.end);
       const diff = end.getTime() - start.getTime();

      // Converti la différence de millisecondes en jours
      let diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (diffInDays==0){ //Si l'employeur ne met un congé que sur des heures de travail par exemple
        diffInDays=1;
      }
      const newDays = days-diffInDays;
      console.log(diffInDays);
      await set (child(ref(this.db), pathConges),newDays);
    }
    await set(eventRef, event);
    this.statusSubject.next('');
  }

  async remove_event(prop: string, userMail: string, eventId: string): Promise<void> {
    // Chemin vers la BDD
    const userToken : string | null = await this.getPath(userMail);
    const path = `users/${prop}/${userToken}/planning/events/${eventId}`;
    // Supprime l'événement
    await remove(ref(this.db, path));
  }
  async getPath(email: string): Promise<string | null> {
    const database = getDatabase(this.ofApp);

    // Cherche le chemin dans la BDD à partir de l'email
    const usersRef = ref(database, 'users');
    const queryRef = query(usersRef, orderByChild('email'), equalTo(email));
    const snapshot = await get(queryRef);

    if (snapshot.exists()) {
      // Prend le premier ID utilisateur qui correspond
      const userId = Object.keys(snapshot.val())[0];
      
      // Le chemin devient l'ID de l'utilisateur
      const path = `${userId}`;
      return path;
    }

    return null; // Retourne null si aucun utilisateur ne correspond au mail
  }
  
  changeUsers(newUsers: string) { //Change la liste d'utilisateurs sélectionnés dynamiquement
    this.users.next(newUsers);
  }
}
