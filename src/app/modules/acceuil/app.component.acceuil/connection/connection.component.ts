import { Component, HostBinding, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { AuthentificationService } from "../../../../services/authentification.service";

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css']
})
export class ConnectionComponent implements OnInit {

  constructor(public authService: AuthentificationService){

  }

  ngOnInit(): void {
  }

  connexionTest(){
    
  }

}
