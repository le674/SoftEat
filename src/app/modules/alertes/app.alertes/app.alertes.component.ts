import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Unsubscribe } from 'firebase/auth';
import { Subscription } from 'rxjs';
import { CAlerte } from 'src/app/interfaces/alerte';
import { AlertesService } from 'src/app/services/alertes/alertes.service';

@Component({
  selector: 'app-alertes',
  templateUrl: './app.alertes.component.html',
  styleUrls: ['./app.alertes.component.css']
})
export class AppAlertesComponent implements OnInit, OnDestroy {

  public toasts_stock:Array<CAlerte>;
  public toast_num:number;
  public date_time:string;

  private router: Router;
  private url: UrlTree;
  private prop:string;
  private restaurant:string;
  private alerte_subscription:Subscription;
  private alerte_unsubscribe!: Unsubscribe;

  constructor(private alerte_stock_service: AlertesService,  router: Router) { 
    this.toasts_stock = [];
    this.toast_num = 0;
    this.router = router;
    this.url = this.router.parseUrl(this.router.url);
    this.prop = "";
    this.restaurant = "";
    this.date_time = "";
    this.alerte_subscription = new Subscription();
  }
  ngOnDestroy(): void {
    this.alerte_subscription.unsubscribe();
    this.alerte_unsubscribe();
  }

  ngOnInit(): void {
    console.log("init : ", this.alerte_subscription.closed);
    let user_info = this.url.queryParams;
    this.prop = user_info["prop"];
    this.restaurant = user_info["restaurant"];
    this.alerte_stock_service.getPPakageNumber(this.prop, this.restaurant).then((num) => {
      this.alerte_unsubscribe = this.alerte_stock_service.getLastPAlertesBDD(this.prop, this.restaurant, num);
    })
    this.alerte_subscription = this.alerte_stock_service.getLastPAlertes().subscribe((alertes) => {
      this.toasts_stock = alertes;
    })
  }

  markRead(toast:CAlerte):void{

  }

  displayAnswer(toast:CAlerte):void{

  }

}
