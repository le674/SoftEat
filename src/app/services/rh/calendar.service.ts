import { Injectable } from '@angular/core';
import { DayPilot } from 'daypilot-pro-angular';
import { HttpClient } from '@angular/common/http';
import { Unsubscribe } from 'firebase/auth';
import { child, Database, get, getDatabase, ref } from 'firebase/database';
import {Firestore } from "firebase/firestore";
import { FirebaseApp} from "@angular/fire/app";
import { FirebaseService } from '../firebase.service'

interface Event {
  start: string;
  end: string;
  text: string;
  id: string;
  // Include any other properties your events might have
}

@Injectable()
export class CalendarService {
  private db: Database;
  events: Event[] = [];
  private sub_event!: Unsubscribe;

  constructor(private http: HttpClient, private firestore:Firestore ,private firebaseService: FirebaseService, private ofApp: FirebaseApp) {
    this.db = getDatabase(ofApp);
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