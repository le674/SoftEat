import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Client } from 'src/app/interfaces/client';
import { AuthentificationService } from 'src/app/services/authentification.service';
@Component({
  selector: 'app-connexion-client',
  templateUrl: './connexion-client.component.html',
  styleUrls: ['./connexion-client.component.css']
})

export class ConnexionClientComponent implements OnInit {
  
  @Output() public numPanel = new EventEmitter();
  private restaurant : string;
  private proprietaire : string;
  constructor(public authService: AuthentificationService){
    this.restaurant="";
    this.proprietaire="";

  }

  ngOnInit(): void {
    
  }

  connexionClient(username : string, password : string){
    this.authService.ConnexionUtilisateur(username, password)
  }

  signup(){
    this.numPanel.emit(4);
  }


}
