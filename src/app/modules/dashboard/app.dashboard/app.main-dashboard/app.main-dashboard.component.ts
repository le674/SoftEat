import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, updateProfile, User } from 'firebase/auth';
import { Observable, Subscription } from 'rxjs';
import { CAlerte } from 'src/app/interfaces/alerte';
import { AlertesService } from 'src/app/services/alertes/alertes.service';
import { AuthentificationService } from 'src/app/services/authentification.service';

const firebaseConfig = {
  apiKey: "AIzaSyDGbo4CzfBKbtL-hUaAK8N-0k-O4tAuXc8",
  authDomain: "project-firebase-44cfe.firebaseapp.com",
  databaseURL: "https://project-firebase-44cfe-default-rtdb.firebaseio.com",
  projectId: "project-firebase-44cfe",
  storageBucket: "project-firebase-44cfe.appspot.com",
  messagingSenderId: "673925066278",
  appId: "1:673925066278:web:d4db735057922d05e1c0e7",
  measurementId: "G-ZNLSYK4LNG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let email: string | null = null;
let displayName: string | null = null;
@Component({
  selector: 'app-main-dashboard',
  templateUrl: './app.dashboard.component.html',
  styleUrls: ['./app.dashboard.component.css']
})



export class AppMainDashboardComponent implements OnInit, OnDestroy {
  @Output() public numP = new EventEmitter();
  user = auth.currentUser;
  public hidden = true;
  public alert_num = 1;
  private url: UrlTree;
  private router: Router;
  private prop:string;
  private restaurant:string;
  private num:number;
  private alerte_subscription: Subscription; 
  
  constructor(public authService: AuthentificationService, public alerte_stock_service: AlertesService, router: Router,){

    this.num = 0;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
   // The user object has basic properties such as display name, email, etc.
   displayName = user.displayName;
   email = user.email;
   const photoURL = user.photoURL;
   const emailVerified = user.emailVerified;
 
   // The user's ID, unique to the Firebase project. Do NOT use
   // this value to authenticate with your backend server, if
   // you have one. Use User.getToken() instead.
   const uid = user.uid;
        // ...
      } else {
        // User is signed out
        // ...
      }
    });

    // on récupère dans le constructeur le paquet d'alertes 
    this.router = router;
    this.url = this.router.parseUrl(this.router.url);
    this.prop = "";
    this.restaurant = "";
    this.alerte_subscription = new Subscription();
}
  ngOnDestroy(): void {
    this.alerte_subscription.unsubscribe();
  }
      

 
  ngOnInit(): void {
  let user_info = this.url.queryParams;
  this.prop = user_info["prop"];
  this.restaurant = user_info["restaurant"];
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
    this.alerte_stock_service.getPPakageNumber(this.prop, this.restaurant).then((num) => {
      this.alerte_stock_service.getLastPAlertesBDD(this.prop, this.restaurant, num);
    })
    this.alerte_subscription = this.alerte_stock_service.getLastPAlertes().subscribe((alertes) =>{
      // on récupère le nombre d'alerte non lu et on envoie à la vue pour affichage d'une notifiation 
      const is_read = alertes.map((alerte) => alerte.read);
      const num_read = is_read.filter(is_true => !is_true).length;
      this.alert_num = num_read
      if(this.alert_num !== 0){
        this.hidden = false; 
      }
    })
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

  clickMenu(){
    this.numP.emit(5)
  }

  clickPlats(){
    this.numP.emit(6)
  }

  clickPreparation(){
    this.numP.emit(7)
  }

  clickCAnalyseStock(){
    this.numP.emit(8)
  }
  
  clickAnalyseFreq(){
    this.numP.emit(9)
  }  

  clickAnalyseTable(){
    this.numP.emit(10)
  }

  clickAnalyseConso(){
    this.numP.emit(11)
  }

  clickAnalyseCA(){
    this.numP.emit(12)
  }

  clickAnalyseMenu(){
    this.numP.emit(13)
  }

  clickCompta(){
    this.numP.emit(14)
  }
  
  clickScFactures(){
    this.numP.emit(15)
  }

  clickArchi(){
    this.numP.emit(16)
  }


  clickRH(){
    this.numP.emit(17)
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
