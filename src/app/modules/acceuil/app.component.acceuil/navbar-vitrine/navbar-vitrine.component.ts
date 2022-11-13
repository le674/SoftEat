import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar-vitrine',
  templateUrl: './navbar-vitrine.component.html',
  styleUrls: ['./navbar-vitrine.component.css']
})

export class NavbarVitrineComponent implements OnInit {

  constructor() {
    
   }

  ngOnInit(): void {
  }
  clicConnexion(){
    alert("Vous venez de cliquer sur un bouton");

  }
}
