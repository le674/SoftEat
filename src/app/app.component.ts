import { Component } from '@angular/core';
import { FirebaseApp } from "@angular/fire/app";
import { getDatabase, ref, child, get} from 'firebase/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'restoP';
  //private db;

  constructor(private ofApp: FirebaseApp){
    // on réalise une inversion de controle ofApp contient par défaut la configuration d'accès aux api que l'on a set dans app.module
    //this.db = getDatabase(ofApp)
  }

  ngOnInit(){
    //ref permet de réferencer un chemin vers la base de données, child permet de spécifier le chemin
    //const ref_db = ref(this.db);
    //get(child(ref_db, 'client_1/Restaurant')).then((restaurant) => {
    //  if (restaurant.exists()) {
    //      console.log(restaurant.val().adresse);
    //  }
    //})
  }
}
