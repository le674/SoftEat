/*import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {DayPilot} from "daypilot-pro-angular";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class CalendarDataService {

  events: any[] = [
    {
      id: "1",
      start: DayPilot.Date.today().addHours(10),
      end: DayPilot.Date.today().addHours(12),
      text: "Event 1"
    }
  ];

  constructor(private http : HttpClient){
  }

  getEvents(from: DayPilot.Date, to: DayPilot.Date): Observable<any[]> {

    // simulating an HTTP request
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.events);
      }, 200);
    });

    // return this.http.get("/api/events?from=" + from.toString() + "&to=" + to.toString());
  }

}*/

import { Injectable, OnInit } from '@angular/core';
import { DayPilot } from 'daypilot-pro-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Unsubscribe } from 'firebase/auth';
import { FIREBASE_DATABASE_EMULATOR_HOST, FIREBASE_FIRESTORE_EMULATOR_HOST, FIREBASE_PROD } from 'src/environments/variables';
import { environment } from 'src/environments/environment';
import { child, connectDatabaseEmulator, Database, DatabaseReference, get, set, getDatabase, onValue, ref, remove, update } from 'firebase/database';
import { collection, connectFirestoreEmulator, Firestore, getDocs, getFirestore } from "firebase/firestore";
import { FirebaseApp, initializeApp } from "@angular/fire/app";
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

  constructor(private http: HttpClient, private ofApp: FirebaseApp) {
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
        //console.log(event);
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

  async add_event(prop: string, user: string, newEvent: DayPilot.EventData): Promise<void> {
    // path to save the event
    const path = `users/${prop}/${user}/planning/events`;

    // convert the DayPilot.Date objects to ISO date strings
    const startString = newEvent.start.toString("yyyy-MM-ddTHH:mm:ss");
    const endString = newEvent.end.toString("yyyy-MM-ddTHH:mm:ss");

    // create an Event object similar to how you're storing them in Firebase
    const event = {
        start: startString,
        end: endString,
        text: newEvent.text,
        id: newEvent.id
    };

    // generate a new child location using push() and save the event data
    // replace 'this.db' with your Firebase Realtime Database reference
    const eventRef = child(ref(this.db), `${path}/${event.id}`);
    await set(eventRef, event);
}
}
