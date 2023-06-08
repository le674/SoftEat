import { Component } from '@angular/core';
import { FirebaseApp, initializeApp } from "@angular/fire/app";
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'restoP';

  constructor(private router: Router, private ofApp: FirebaseApp){

  }

  ngOnInit(){

  }

  
}
