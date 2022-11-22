import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { getAuth, User } from 'firebase/auth';
import { AuthentificationService } from 'src/app/services/authentification.service';

const auth = getAuth();
@Component({
  selector: 'app-main-dashboard',
  templateUrl: './app.dashboard.component.html',
  styleUrls: ['./app.dashboard.component.css']
})

export class AppMainDashboardComponent implements OnInit {
  @Output() public numP = new EventEmitter();
  constructor(public authService: AuthentificationService){

  }
    
   user = auth.currentUser;
  getConnexion():boolean{
    if(this.user == null){
      return false;
    }else{
      return true;
    }
  }
  ngOnInit(): void {
  }
  
  clickAlertes(){
    
    this.numP.emit(1)
  }

  clickStock(){
    this.numP.emit(2)
  }

  clickAnalyse(){
    this.numP.emit(3)
  }

  clickFactures(){
    this.numP.emit(4)
  }

  clickRH(){
    this.numP.emit(5)
  }
}
