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

  onFormSubmit(data: any) {
    console.log(data);
    this.router.navigateByUrl('/');
  }

  login(){
    this.numPanel.emit(3);
  }
}

