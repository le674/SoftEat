import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ConnectionComponent } from '../connection/connection.component';

@Component({
  selector: 'app-navbar-vitrine',
  templateUrl: './navbar-vitrine.component.html',
  styleUrls: ['./navbar-vitrine.component.css']
})

export class NavbarVitrineComponent implements OnInit {
  @Output() public numPanel = new EventEmitter();
  constructor() {
   }

  ngOnInit(): void {
    
  }
  clicConnexion(){
  this.numPanel.emit(1);  
  
  }
  clicHome(){
    this.numPanel.emit(2);  
    
    }
}
