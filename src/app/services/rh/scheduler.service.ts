import { Injectable, OnInit } from '@angular/core';
import {DayPilot} from 'daypilot-pro-angular';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { FirebaseApp, initializeApp } from "@angular/fire/app";
import { getDatabase, ref, onValue} from 'firebase/database';
import { FirebaseService } from '../firebase.service'

@Injectable({providedIn: 'root'})
export class SchedulerService implements OnInit{
  barColor!:string;
  end!:string;
  id!:string;
  resource!:string;
  start!:string;
  text!:string;
  private db: any;

  resources: DayPilot.ResourceData[] = [
    {
      name: 'Cuisiniers', id: 'GA', expanded: true, children: [
        {name: 'Cuisinier 1', id: 'R1', capacity: 10},
        {name: 'Cuisinier 2', id: 'R2', capacity: 30},
        {name: 'Cuisinier 3', id: 'R3', capacity: 20}
      ]
    },
    {
      name: 'Serveurs', id: 'GB', expanded: true, children: [
        {name: 'Serveur 1', id: 'R5', capacity: 20},
        {name: 'Serveur 2', id: 'R6', capacity: 40},
        {name: 'Serveur 3', id: 'R7', capacity: 20}
      ]
    }
  ];

  events: DayPilot.EventData[] = [];

  constructor(private http: HttpClient, private firebaseService: FirebaseService) {
  }

  ngOnInit(): void {
    this.db = this.firebaseService.getDatabaseInstance();
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

  getResources(): Observable<any[]> {
    return this.db.list('/backend_resources').valueChanges();
  }

    // return this.http.get("/api/resources");
  }