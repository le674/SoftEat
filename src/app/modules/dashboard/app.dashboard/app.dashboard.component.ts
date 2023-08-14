import { Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-app.dashboard',
  templateUrl: './app.dashboard.component.html',
  styleUrls: ['./app.dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppDashboardComponent implements OnInit {
  
  public numP = 1;

  constructor() {}

  ngOnInit(): void {
  }

}
