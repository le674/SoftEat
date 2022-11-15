import { Component, OnInit, EventEmitter, Input, Output, HostListener } from '@angular/core';

@Component({
  selector: 'app-app.dashboard',
  templateUrl: './app.dashboard.component.html',
  styleUrls: ['./app.dashboard.component.css']
})
export class AppDashboardComponent implements OnInit {
  
  public numeroPanel = -2;

  constructor() {}

  ngOnInit(): void {
  }

}
