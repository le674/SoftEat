import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-app.component.acceuil',
  templateUrl: './app.component.acceuil.html',
  styleUrls: ['./app.component.acceuil.css'],
  encapsulation: ViewEncapsulation.None

})
export class ComponentAcceuil implements OnInit {
  public numeroPanel = -2;
  constructor() {
   }

  ngOnInit(): void {
  }
  
}
