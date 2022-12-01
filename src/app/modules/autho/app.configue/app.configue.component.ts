import { Component, OnInit } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { FirebaseApp } from '@angular/fire/app';
import {Router} from '@angular/router';

@Component({
  selector: 'app-app.configue',
  templateUrl: './app.configue.component.html',
  styleUrls: ['./app.configue.component.css']
})
export class AppConfigueComponent implements OnInit {

  constructor(private ofApp: FirebaseApp,private router: Router) { }

  ngOnInit(): void {
  }
  
  clicdeConnexion(){
    const auth = getAuth(this.ofApp);
    auth.signOut(); 
    window.location.reload();
  }

  clicAcceuil(){
    this.router.navigate([''])
  }


}
