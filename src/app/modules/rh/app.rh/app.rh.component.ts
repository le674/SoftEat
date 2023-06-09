import { Component, OnInit } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { getDatabase, ref, onValue, get } from 'firebase/database';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

@Component({
  selector: 'app-rh',
  templateUrl: './app.rh.component.html',
  styleUrls: ['./app.rh.component.css']
})
export class AppRhComponent implements OnInit {
currentUserRole: any;

  constructor() { }

  ngOnInit(): void {
    const firebaseConfig = {
      apiKey: 'AIzaSyDPJyOCyUMDl70InJyJLwNLAwfiYnrtsDo',
      authDomain: 'psofteat-65478545498421319564.firebaseapp.com',
      databaseURL:
        'https://psofteat-65478545498421319564-default-rtdb.firebaseio.com',
      projectId: 'psofteat-65478545498421319564',
      storageBucket: 'psofteat-65478545498421319564.appspot.com',
      messagingSenderId: '135059251548',
      appId: '1:135059251548:web:fb05e45e1d1631953f6199',
      measurementId: 'G-5FBJE9WH0X',
    };
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getDatabase(firebaseApp);

    //const userPath = 'restaurants/ping_11/telecom/employes/';
    const userPath = '/users/foodandboost_prop/';

    // Référence au chemin des utilisateurs
    const usersRef = ref(db, userPath);

    //Current user
    const auth = getAuth(firebaseApp);

    onAuthStateChanged(auth, (currentUser) => {
      let user = currentUser;
      /*console.log('Current user:');
      console.log(user);*/
      let userdat = user?.uid;
      const role = ref(db, `${userPath}/${userdat}/role`);
      onValue(role, (roleSnapshot) => {
        this.currentUserRole = roleSnapshot.val();
      });
    });
  }

}
