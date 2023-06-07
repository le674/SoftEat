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
  analyse!: boolean;
  budget!: boolean;
  facture!: boolean;
  planning!: boolean;
  stock!: boolean; //(this.statut.stock === 'rw');

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.text = "it works !";
    this.notification = [true, true, true, true, true, true, true];
    // this.db = this.firebaseService.getDatabaseInstance();
    this.statut = this.firebaseService.fetchUserStatus(this.userId);
    this.showCanal();
  }


  showCanal() {
    if(this.statut.stock === 'rw' || this.statut.stock === 'r' ) {
      this.stock = true;
      console.log(this.stock);
    }
    if(this.statut.analyse === 'rw' || this.statut.analyse === 'r' ) this.stock = true;
    if(this.statut.budget === 'rw' || this.statut.budget === 'r' ) this.budget = true;
    if(this.statut.facture === 'rw' || this.statut.facture === 'r' ) this.facture = true;
    if(this.statut.planning === 'rw' || this.statut.planning === 'r' ) this.planning = true;
  }
  

  

  updateNotification(index: number){
    this.notification[index] = !this.notification[index];
  }
  

}

