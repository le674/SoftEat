import { Injectable } from '@angular/core';
import { DayPilot } from 'daypilot-pro-angular';
import { FIREBASE_DATABASE_EMULATOR_HOST, FIREBASE_FIRESTORE_EMULATOR_HOST, FIREBASE_PROD } from 'src/environments/variables';
import { environment } from 'src/environments/environment';
import { child, push, connectDatabaseEmulator, get, set, getDatabase,  ref } from 'firebase/database';
import { connectFirestoreEmulator, Firestore, getFirestore } from "firebase/firestore";
import { FirebaseApp, initializeApp } from "@angular/fire/app";

interface Event {
  start: string;
  end: string;
  text: string;
  id:string;
  tags:string;
}

@Injectable()
export class CalendarService {
  private firestore: Firestore;
  events: Event[] = [];
  private firebaseConfig=environment.firebase;
  private firebaseApp = initializeApp(this.firebaseConfig);
  private db = getDatabase(this.firebaseApp);

  constructor(private ofApp: FirebaseApp) {
    //this.db = getDatabase(ofApp);
    this.firestore = getFirestore(ofApp);
    if ((location.hostname === "localhost") && (!FIREBASE_PROD)) {
      try {
        connectDatabaseEmulator(this.db, FIREBASE_DATABASE_EMULATOR_HOST.host, FIREBASE_DATABASE_EMULATOR_HOST.port);
      } catch (error) {

      }
      try {
        connectFirestoreEmulator(this.firestore, FIREBASE_FIRESTORE_EMULATOR_HOST.host, FIREBASE_FIRESTORE_EMULATOR_HOST.port);
      } catch (error) {

      }
    }
  }


  async getEvents(from: DayPilot.Date, to: DayPilot.Date, prop: string, user: string): Promise<DayPilot.EventData[]> {
    // converti le DayPilot.Date en date ISO string
    const fromDateString = from.toString("yyyy-MM-dd");
    const toDateString = to.toString("yyyy-MM-dd");

    const path = `users/${prop}/${user}/planning/events` //chemin vers la BDD
    const eventsSnapshot = await get(child(ref(this.db), path)); //ensemble des events

    if (eventsSnapshot.exists()) {
      this.events = [];
      eventsSnapshot.forEach((eventSnapshot) => { //parcoure les events de la BDD
        const event = eventSnapshot.val() as Event;
        if (event.start >= fromDateString && event.start <= toDateString) {
          this.events.push({ 
            start: event.start,
            end: event.end,
            text: event.text,
            id: event.id,
            tags : event.tags,
           });
        }
        return false; // regarde le prochain event
      });
    }

    return this.events;
  }

  async add_event(prop: string, user: string, newEvent: DayPilot.EventData): Promise<void> {
    // Chemin vers la BDD
    const path = `users/${prop}/${user}/planning/events`;

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
        tags : newEvent.tags,
    };

    await set(eventRef, event);
}

}
