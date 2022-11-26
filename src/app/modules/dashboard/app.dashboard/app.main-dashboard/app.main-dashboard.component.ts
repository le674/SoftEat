import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, updateProfile, User } from 'firebase/auth';
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



export class AppMainDashboardComponent implements OnInit {
  @Output() public numP = new EventEmitter();
  user = auth.currentUser;

  constructor(public authService: AuthentificationService){



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
  }
  
  clickAlertes(){
  
    this.numP.emit(1)
    
  }

  clickStock(){
    this.numP.emit(2)
  }

  clickToggle(){

   /* const sidebar = document.querySelector(".sidebar");
    if(sidebar != null)
    sidebar.classList.toggle("close");*/
    }
    
  clickLogo(){

    const sidebar = document.querySelector(".sidebar");

  const logo = document.querySelector(".logo-box");
    if(sidebar!=null)
  sidebar.classList.toggle("close");
  }
  clickAnalyse(){
    this.numP.emit(3)
  }

  clickFactures(){
    this.numP.emit(4)
  }

  clickRH(){
    this.numP.emit(5)
  }
  clickProfil(){
    
    this.numP.emit(6)
  }
}
