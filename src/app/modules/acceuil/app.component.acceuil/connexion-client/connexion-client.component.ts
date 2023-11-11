import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';
import { AuthentificationService } from "../../../../services/authentification.service";
@Component({
  selector: 'app-connexion-client',
  templateUrl: './connexion-client.component.html',
  styleUrls: ['./connexion-client.component.css']
})

export class ConnexionClientComponent implements OnInit {
  
  @Output() public numPanel = new EventEmitter();

  constructor(public authService: AuthentificationService){

  }

  ngOnInit(): void {
    
  }

  connexionTest(){
    
  }

  signup(){
    this.numPanel.emit(4);
  }


}
