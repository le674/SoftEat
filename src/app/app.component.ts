import { Component } from '@angular/core';
import { FirebaseApp } from "@angular/fire/app";
import { Firestore } from '@angular/fire/firestore';
import {Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SoftEat';
  constructor(private router: Router, private ofApp: FirebaseApp, private firestore:Firestore){
  }
  ngOnInit(){

  }
}
