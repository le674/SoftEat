import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './app.dashboard.component.html',
  styleUrls: ['./app.dashboard.component.css']
})
export class AppMainDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Output() public numPanel = new EventEmitter();
  
  clickAlertes(){
    
    this.numPanel.emit(1)
  }

  clickStock(){
    this.numPanel.emit(2)
  }

  clickAnalyse(){
    this.numPanel.emit(3)
  }

  clickFactures(){
    this.numPanel.emit(4)
  }

  clickRH(){
    this.numPanel.emit(5)
  }
}
