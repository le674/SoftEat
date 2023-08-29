import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import {initializeApp } from 'firebase/app';
import { Unsubscribe } from 'firebase/database';
import { first, Subscription } from 'rxjs';
import { AlertesService } from '../../../../../app/services/alertes/alertes.service';
import { AuthentificationService } from '../../../../../app/services/authentification.service';

const firebaseConfig = {
  apiKey: "AIzaSyDPJyOCyUMDl70InJyJLwNLAwfiYnrtsDo",
  authDomain: "psofteat-65478545498421319564.firebaseapp.com",
  databaseURL: "https://psofteat-65478545498421319564-default-rtdb.firebaseio.com",
  projectId: "psofteat-65478545498421319564",
  storageBucket: "psofteat-65478545498421319564.appspot.com",
  messagingSenderId: "135059251548",
  appId: "1:135059251548:web:fb05e45e1d1631953f6199",
  measurementId: "G-5FBJE9WH0X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let email: string | null = null;
let displayName: string | null = null;
@Component({
  selector: 'app-main-dashboard',
  templateUrl: './app.dashboard.component.html',
  styleUrls: ['./app.dashboard.component.css']
})



export class AppMainDashboardComponent implements OnInit, OnDestroy {
  @Output() public numP = new EventEmitter();
  public user:any;
  public hidden = true;
  public alert_num = 0;
  private prop:string;
  private restaurant:string;
  private alerte_subscription: Subscription; 
  private stock_unsubscribe!: Unsubscribe;
  private conso_unsubscribe!: Unsubscribe;
  
  constructor(public authService: AuthentificationService,
    public alerte_service: AlertesService){
    // on récupère dans le constructeur le paquet d'alertes 
    this.prop = "";
    this.restaurant = "";
    this.alerte_subscription = new Subscription();
}
  ngOnDestroy(): void {
    this.alerte_subscription.unsubscribe();
    this.stock_unsubscribe();
    this.conso_unsubscribe();
  }
      

 
  ngOnInit(): void {
  const listItems = document.querySelectorAll(".sidebar-list li");
  listItems.forEach((item) => {
    item.addEventListener("click", () => {
      let isActive = item.classList.contains("active");

      listItems.forEach((el) => {
        el.classList.remove("active");
      });

      if (isActive) item.classList.remove("active");
      else item.classList.add("active");
    });
  });
  const sidebar = document.querySelector(".sidebar");
  if(sidebar!=null) sidebar.classList.toggle("close");
  // on enlève le panel de gauche dans le cas d'un mobile si on à se comportement il aut s'assurer que 
  //lorsque la navebar est toggle les component se mettent sur la gauche
/*   if (window.screen.width < 1040) { // 768px portrait
    const sidebar = document.querySelector(".sidebar");
    if(sidebar!=null) sidebar.classList.toggle("close");
  } */
  
/*     this.alerte_service.getPPakageNumber(this.prop, this.restaurant, "stock").then((num) => {   
      this.stock_unsubscribe = this.alerte_service.getLastPAlertesBDD(this.prop, this.restaurant, num, "stock");
    })

    this.alerte_service.getPPakageNumber(this.prop, this.restaurant, "conso").then((num) =>{
      this.conso_unsubscribe = this.alerte_service.getLastPAlertesBDD(this.prop, this.restaurant, num, "conso");
    })

    // la récupération des stock est lancé deux fois car quand on s'abonne à getLastPAlertes() il faut donc utiliser 
    // first pour s'abonner une fois   
    this.alerte_subscription = this.alerte_service.getLastPAlertes().pipe(first()).subscribe((alertes) =>{
      // on récupère le nombre d'alerte non lu et on envoie à la vue pour affichage d'une notifiation 
      const is_read = alertes.map((alerte) => alerte.read);
      const num_read = is_read.filter(is_true => !is_true).length;
      this.alert_num = this.alert_num + num_read;
      if(this.alert_num !== 0){
        this.hidden = false; 
      }
    }) */
  }
  getNom():string{
    if(email!=null){
    return email;
    }else{
      return "null"
    }
  }
  getConnexion():boolean{
    if(this.user == null){
      return false;
    }else{
      return true;
    }
  }
  clickAlertes(){
    this.numP.emit(1)
  }
  clickProfil(){ 
    this.numP.emit(2)
  }
  clickIngredients(){
    this.numP.emit(3)
  }
  clickConso(){
    this.numP.emit(4)
  }
  clickPrepa(){
    this.numP.emit(5)
  }
  clickMenu(){
    this.numP.emit(6)
  }
  clickPlats(){
    this.numP.emit(7)
  }
  clickPreparation(){
    this.numP.emit(8)
  }
  clickClients(){
    this.numP.emit(9)
  } 
  clickCAnalyseStock(){
    this.numP.emit(10)
  }
  
  clickAnalyseFreq(){
    this.numP.emit(11)
  }  

  clickAnalyseTable(){
    this.numP.emit(12)
  }

  clickAnalyseConso(){
    this.numP.emit(13)
  }

  clickAnalyseCA(){
    this.numP.emit(14)
  }
  clickAnalyseMenu(){
    this.numP.emit(15)
  }

  clickCompta(){
    this.numP.emit(16)
  }
  clickScFactures(){
    this.numP.emit(17)
  }
  clickArchi(){
    this.numP.emit(18)
  }
  clickRH(){
    this.numP.emit(19)
  }

  clickSalle(){
    this.numP.emit(20)
  }
  clickTerrasse(){
    this.numP.emit(21)
  }
  clickCenLigne(){
    this.numP.emit(22)
  }
  clickHistCommandes(){
    this.numP.emit(23)
  }
  clickToggle(){

   /* const sidebar = document.querySelector(".sidebar");
    if(sidebar != null)
    sidebar.classList.toggle("close");*/
  }  
  clickLogo(){
    const sidebar = document.querySelector(".sidebar");
    const logo = document.querySelector(".logo-box");
    if(sidebar!=null) sidebar.classList.toggle("close");
  }
 
}
