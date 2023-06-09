import {Injectable} from '@angular/core';
import {DayPilot} from 'daypilot-pro-angular';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { FirebaseApp, initializeApp } from "@angular/fire/app";
import { getDatabase, ref, onValue} from 'firebase/database';
import { FirebaseService } from '../../../../services/firebase.service'

@Injectable()
export class SchedulerDataService {

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

  events: DayPilot.EventData[] = [
    {
      id: '1',
      resource: 'R1',
      start: '2023-10-03',
      end: '2023-10-03',
      text: '9h30 - 13h30',
      barColor: '#e69138'
    },
    {
      id: '2',
      resource: 'R3',
      start: '2023-10-02',
      end: '2023-10-02',
      text: '10h-14h',
      barColor: '#6aa84f'
    },
    {
      id: '3',
      resource: 'R3',
      start: '2023-10-06',
      end: '2023-10-06',
      text: '15h-18h',
      barColor: '#3c78d8'
    }
  ];

  constructor(private http: HttpClient) {
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

    // simulating an HTTP request
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.resources);
      }, 200);
    });

    // return this.http.get("/api/resources");
  }

}
