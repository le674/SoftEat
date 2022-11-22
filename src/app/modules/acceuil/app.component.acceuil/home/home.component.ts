import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Output() public numPanel = new EventEmitter();

  clicConnexion(){
    this.numPanel.emit(1);  
  }  
  constructor() { }

  ngOnInit(): void {
  }

}
