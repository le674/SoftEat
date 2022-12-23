import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { NavigationEnd, Router, UrlTree } from '@angular/router';
import { getAuth, onAuthStateChanged, updateCurrentUser } from 'firebase/auth';
import { throwIfEmpty } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { UserInteractionService } from 'src/app/services/user-interaction.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  private router: Router;
  private url: UrlTree;
  public user_db: User;
  public enseigne:string;
  public restaurants: string;
  constructor(private ofApp: FirebaseApp, router: Router, private service:UserInteractionService) { 
    this.router = router;
    this.user_db = new User()
    this.enseigne = "";
    this.restaurants = "";
    // Attention l'url doit contenir l'information concernant le restaurant et le proprietaire
    this.url = this.router.parseUrl(this.router.url)
  }

  ngOnInit(): void{
    const auth = getAuth(this.ofApp);
    let user_info = this.url.queryParams;
    console.log(Object.keys(user_info));
    this.enseigne = user_info["prop"]
    onAuthStateChanged(auth, (user) => {
      if(user){
        this.service.getUserFromUid(user.uid, this.enseigne).then((user) => {
          this.user_db = user
          if(this.user_db.name == "") this.user_db.name = "pas de nom inscrit"
          if(this.user_db.surname == "") this.user_db.surname = "pas de prénom inscrit"
          if(this.user_db.numero == "") this.user_db.numero = "pas de numéro inscrit"
        })
      }
    })
    
  }

  
  clicdeConnexion(){
    const auth = getAuth(this.ofApp);
    auth.signOut();
    updateCurrentUser(auth, null);
    window.location.href = ""
  }

}
