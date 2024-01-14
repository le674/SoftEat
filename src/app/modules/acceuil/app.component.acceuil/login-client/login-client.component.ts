import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';
import { AuthentificationService } from "../../../../services/authentification.service";
import { Router } from '@angular/router';
@Component({
  selector: 'app-login-client',
  templateUrl: './login-client.component.html',
  styleUrls: ['./login-client.component.css']
})

export class LoginClientComponent implements OnInit {

  @Output() public numPanel = new EventEmitter();

  constructor(public authService: AuthentificationService, private router: Router){

  }

  ngOnInit(): void {
    
  }

  onFormSubmit(email : string, password : string, name : string) {
    this.authService.InscriptionClient(email, password, name);
  }

  login(){
    this.numPanel.emit(3);
  }
}

