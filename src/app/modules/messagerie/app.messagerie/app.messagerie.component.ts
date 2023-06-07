import { Component, NgModule, OnInit } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
import { Statut } from '../../../interfaces/statut';

@Component({
  selector: 'app-messagerie',
  templateUrl: './app.messagerie.component.html',
  styleUrls: ['./app.messagerie.component.css']
})


export class AppMessagerieComponent implements OnInit {
  text!: string;
  notification!: boolean[];
  private db: any;
  statut!: Statut;
  userId = '0uNzmnBI0jYYspF4wNXdRd2xw9Q2'; //  ID de l'utilisateur à récupérer

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.text = "it works !";
    this.notification = [true, true, true, true, true, true, true];
    // this.db = this.firebaseService.getDatabaseInstance();
    this.statut = this.firebaseService.fetchUserStatus(this.userId);
  }

  date: Date = new Date();

  analyse = true;
  budget = true;
  facture = true;
  planning = true;
  stock = (this.statut.stock === 'rw');
  

  updateNotification(index: number){
    this.notification[index] = !this.notification[index];
  }
  

}

