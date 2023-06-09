import { Injectable, OnInit } from '@angular/core';
import { DayPilot } from 'daypilot-pro-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Unsubscribe } from 'firebase/auth';
import { FIREBASE_DATABASE_EMULATOR_HOST, FIREBASE_FIRESTORE_EMULATOR_HOST, FIREBASE_PROD } from 'src/environments/variables';
import { child, connectDatabaseEmulator, Database, DatabaseReference, get, getDatabase, onValue, ref, remove, update } from 'firebase/database';
import { collection, connectFirestoreEmulator, Firestore, getDocs, getFirestore } from "firebase/firestore";
import { FirebaseApp, initializeApp } from "@angular/fire/app";
import { FirebaseService } from '../firebase.service'
import { map } from 'rxjs/operators';
import { DataSnapshot } from 'firebase/database';

interface Event {
  start: string;
  end: string;
  text: string;
  id:string;
  // Include any other properties your events might have
}

@Injectable()
export class CalendarService {
  private db: Database;
  private firestore: Firestore;
  events: Event[] = [];
  private sub_event!: Unsubscribe;

  constructor(private http: HttpClient, private firebaseService: FirebaseService, private ofApp: FirebaseApp) {
    this.db = getDatabase(ofApp);
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


  async getEvents(from: DayPilot.Date, to: DayPilot.Date, prop: string, restaurant: string): Promise<DayPilot.EventData[]> {
    // convert DayPilot.Date to ISO date string
    const fromDateString = from.toString("yyyy-MM-dd");
    const toDateString = to.toString("yyyy-MM-dd");

    const path = `restaurants/${restaurant}/${prop}/employes/valentin/planning/events`
    const eventsSnapshot = await get(child(ref(this.db), path));

    if (eventsSnapshot.exists()) {
      this.events = [];
      eventsSnapshot.forEach((eventSnapshot) => {
        const event = eventSnapshot.val() as Event;
        if (event.start >= fromDateString && event.start <= toDateString) {
          this.events.push({ 
            start: event.start,
            end: event.end,
            text: event.text,
            id: event.id
           });
        }
        return false; // continue to the next child
      });
    }

    return this.events;
  }
}