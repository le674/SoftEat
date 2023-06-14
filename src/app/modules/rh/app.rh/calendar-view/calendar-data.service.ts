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
  private firestore: Firestore;
  events: DayPilot.EventData[] = [];
  private firebaseConfig = environment.firebase;
  private firebaseApp = initializeApp(this.firebaseConfig);
  private db = getDatabase(this.firebaseApp);
  private currentUser = localStorage.getItem("user_email") as string;
  private users = new BehaviorSubject<string>(this.currentUser)
  currentData = this.users.asObservable();

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

  async getEventsFromAllUsers(prop: string, usersMails: string): Promise<DayPilot.EventData[]> {
    
    if (usersMails === "") {
      this.events = [];
      return this.events;
    }
    
    // Split the string into an array of emails
    const emails = usersMails.split(",");
  
    let allEvents: DayPilot.EventData[] = []; // Create a new array to store all events
    
    for (const userMail of emails) {
      console.log(`Fetching events for user: ${userMail}`); // Log the email
      const userEvents = await this.getEvents(prop, userMail.trim());
      console.log(`Events for user ${userMail}:`, userEvents); // Log the returned events
  
      allEvents = [...allEvents, ...userEvents]; // Add the user's events to the allEvents array
    }
  
    this.events = allEvents; // Assign the collected events to this.events
    return this.events;
  }
  

  async getEvents(prop: string, userMail: string): Promise<DayPilot.EventData[]> {
    // converti le DayPilot.Date en date ISO string
    //const fromDateString = from.toString("yyyy-MM-dd");
    //const toDateString = to.toString("yyyy-MM-dd");
    this.events = [];
    const userToken : string | null = await this.getPath(userMail);
    const path = `users/${prop}/${userToken}/planning/events` //chemin vers la BDD
    const eventsSnapshot = await get(child(ref(this.db), path)); //ensemble des events

    if (eventsSnapshot.exists()) {
      eventsSnapshot.forEach((eventSnapshot) => { //parcourt les events de la BDD
        const event = eventSnapshot.val() as Event;
        //if (event.start >= fromDateString && event.start <= toDateString) {
          this.events.push({
            start: event.start,
            end: event.end,
            text: event.text,
            id: event.id,
            tags: event.tags,
            resource: event.resource,
          });
        return false; // regarde le prochain event
      });
    } else {
      return [];
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
      tags: newEvent.tags,
      resource: newEvent.resource,
    };

    await set(eventRef, event);
  }

  async remove_event(prop: string, userMail: string, eventId: string): Promise<void> {
    // Path to the database
    const userToken : string | null = await this.getPath(userMail);
    const path = `users/${prop}/${userToken}/planning/events/${eventId}`;

    // Remove the event
    await remove(ref(this.db, path));
  }
  async getPath(email: string): Promise<string | null> {
    const database = getDatabase(this.ofApp); // Get the Realtime Database instance

    // Query the database to find the path based on the email
    const usersRef = ref(database, 'users');
    const queryRef = query(usersRef, orderByChild('email'), equalTo(email));
    const snapshot = await get(queryRef);

    if (snapshot.exists()) {
      // Get the first matching user's key (assuming there is only one match)
      const userId = Object.keys(snapshot.val())[0];
      
      // Construct the path using the found user ID
      const path = `${userId}`;

      return path;
    }

    return null; // Return null if no matching user is found
  }
  
  changeUsers(newUsers: string) {
    this.users.next(newUsers);
    console.log(this.users)
  }

}
