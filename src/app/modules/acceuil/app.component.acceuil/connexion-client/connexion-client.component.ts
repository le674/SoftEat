import { Component, HostBinding, OnInit } from '@angular/core';
import { AuthentificationService } from "../../../../services/authentification.service";

@Component({
  selector: 'app-connexion-client',
  templateUrl: './connexion-client.component.html',
  styleUrls: ['./connexion-client.component.css']
})

export class ConnexionClientComponent implements OnInit {

  
  constructor(public authService: AuthentificationService){

  }

  ngOnInit(): void {
    
  }

  connexionTest(){
    
  }


}
