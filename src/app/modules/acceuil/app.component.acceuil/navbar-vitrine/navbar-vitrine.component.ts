import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ConnectionComponent } from '../connection/connection.component';
import { DOCUMENT } from '@angular/common'; 
@Component({
  selector: 'app-navbar-vitrine',
  templateUrl: './navbar-vitrine.component.html',
  styleUrls: ['./navbar-vitrine.component.css']
})
/*
function elementPosition (a) {
  var b = a.getBoundingClientRect();
  return {
    clientX: a.offsetLeft,
    clientY: a.offsetTop,
    viewportX: (b.x || b.left),
    viewportY: (b.y || b.top)
  }
}
const clientY
function daccord(){
  var NavBarTOP = document.getElementById('navbar_top');
  alert(elementPosition(NavBarTOP).clientX);
  const nX = elementPosition(NavBarTOP).clientY;
  if(clientY == elementPosition(NavBarTOP).clientY){
    $('.navbar_top').css('background','rgb(255, 255, 255,0)');
  }
}
*/
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
    window.scrollTo({top:0, behavior: 'smooth'});
  }
  clicTarif(){
    this.numPanel.emit(2);  

    var element = document.querySelector("#divPrix");
    element?.scrollIntoView();
  }
  clicPropos(){
    this.numPanel.emit(2);  

    var element = document.querySelector("#propos");
    element?.scrollIntoView();
  }
  clicFonctionnalite(){
    var element = document.querySelector("#divMobile");

    this.numPanel.emit(2)  
    element?.scrollIntoView();
  }
}

