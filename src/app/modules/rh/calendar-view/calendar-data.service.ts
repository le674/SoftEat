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
import { Unsubscribe, getAuth } from 'firebase/auth';
import { FIREBASE_DATABASE_EMULATOR_HOST, FIREBASE_FIRESTORE_EMULATOR_HOST, FIREBASE_PROD } from 'src/environments/variables';
import { environment } from 'src/environments/environment';
import { child, connectDatabaseEmulator, Database, DatabaseReference, get, getDatabase, onValue, ref, remove, update } from 'firebase/database';
import { collection, connectFirestoreEmulator, Firestore, getDocs, getFirestore } from "firebase/firestore";
import { FirebaseApp, initializeApp } from "@angular/fire/app";

interface Event {
  start: string;
  end: string;
  text: string;
  id:string;
}

@Injectable()
export class CalendarService {
  private firestore: Firestore;
  events: Event[] = [];
  private sub_event!: Unsubscribe;
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
    // convert DayPilot.Date to ISO date string
    const fromDateString = from.toString("yyyy-MM-dd");
    const toDateString = to.toString("yyyy-MM-dd");

    const path = `users/${prop}/${user}/planning/events`
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
}
