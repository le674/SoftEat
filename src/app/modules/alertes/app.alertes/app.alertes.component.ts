import { Component, OnInit } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { CAlerte } from 'src/app/interfaces/alerte';
import { AlertesService } from 'src/app/services/alertes/alertes.service';

@Component({
  selector: 'app-alertes',
  templateUrl: './app.alertes.component.html',
  styleUrls: ['./app.alertes.component.css']
})
export class AppAlertesComponent implements OnInit {

  public toasts_stock:Array<CAlerte>;
  public toast_num:number;
  public date_time:string;

  private router: Router;
  private url: UrlTree;
  private prop:string;
  private restaurant:string;

  constructor(private alerte_stock_service: AlertesService,  router: Router) { 
    this.toasts_stock = [];
    this.toast_num = 0;
    this.router = router;
    this.url = this.router.parseUrl(this.router.url);
    this.prop = "";
    this.restaurant = "";
    this.date_time = "";
  }

  ngOnInit(): void {
    let user_info = this.url.queryParams;
    this.prop = user_info["prop"];
    this.restaurant = user_info["restaurant"];
    this.alerte_stock_service.getLastPAlertes().subscribe((alertes) => {
      this.toasts_stock = alertes;
    })
  }

  markRead(toast:CAlerte):void{

  }

  displayAnswer(toast:CAlerte):void{

  }

}
