import { Component, OnDestroy, OnInit} from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Unsubscribe } from 'firebase/auth';
import { first, Subscription } from 'rxjs';
import { CAlerte } from '../../../../app/interfaces/alerte';
import { AlertesService } from '../../../../app/services/alertes/alertes.service';

@Component({
  selector: 'app-alertes',
  templateUrl: './app.alertes.component.html',
  styleUrls: ['./app.alertes.component.css']
})
export class AppAlertesComponent{
 /*  public toasts_stock:Array<CAlerte>;
  public toast_num:number;
  public date_time:string;
  private router: Router;
  private url: UrlTree;
  private prop:string;
  private restaurant:string;
  private alerte_subscription:Subscription;
  private alerte_unsubscribe!: Unsubscribe;
  private stock_unsubscribe!: Unsubscribe;
  private conso_unsubscribe!: Unsubscribe;

  constructor(private alerte_service: AlertesService,  router: Router) { 
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
    if(this.alerte_subscription !== undefined) this.alerte_subscription.unsubscribe();
    if(this.stock_unsubscribe !== undefined) this.stock_unsubscribe();
    if(this.conso_unsubscribe !== undefined) this.conso_unsubscribe();
  }

  ngOnInit(): void {
    let user_info = this.url.queryParams;
    this.prop = user_info["prop"];
    this.restaurant = user_info["restaurant"];
    this.alerte_service.getPPakageNumber(this.prop, this.restaurant, "stock").then((num) => {   
      this.stock_unsubscribe = this.alerte_service.getLastPAlertesBDD(this.prop, this.restaurant, num, "stock");
    })

    this.alerte_service.getPPakageNumber(this.prop, this.restaurant, "conso").then((num) =>{
      this.conso_unsubscribe = this.alerte_service.getLastPAlertesBDD(this.prop, this.restaurant, num, "conso");
    })

    // on subscribe au getLastPAlertesBDD de la dashboard attention au fuite mémoire 
    this.alerte_subscription = this.alerte_service.getLastPAlertes().pipe(first()).subscribe((alertes) => {  
      for(let alerte of alertes){
        if(alerte.categorie === "stock"){
          if(!alerte.read){
            this.toasts_stock.push(alerte);
          }
        }
      }
    })
  }
  markReadStock(toast:CAlerte):void{
    toast.read = true;
    this.alerte_service.getPPakageNumber(this.prop, this.restaurant, 'stock').then((p_number:number) => {

      this.alerte_service.updateAlerte(this.prop, this.restaurant, toast,'stock', p_number);
    })
  }  
  tabMaxWidth() {
    if((window.innerWidth < 768) && (window.innerWidth > 600)) {
      return 500; // Largeur maximale pour les écrans plus petits que 768px
    } 
    if((window.innerWidth < 600) && (window.innerWidth > 480)){
      return 380;
    }
    if((window.innerWidth < 480) && (window.innerWidth > 414)){
      return 314;
    }
    if((window.innerWidth < 414) && (window.innerWidth > 375)){
      return 275;
    }
    if((window.innerWidth < 375) && (window.innerWidth > 320)){
      return 220;
    }
    return window.innerWidth - 100;
  } */
}
