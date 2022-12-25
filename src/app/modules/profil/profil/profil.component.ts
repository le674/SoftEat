import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Auth, sendEmailVerification } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, UrlTree } from '@angular/router';
import { getAuth, onAuthStateChanged, updateCurrentUser } from 'firebase/auth';
import { User } from 'src/app/interfaces/user';
import { MailServicesService } from 'src/app/services/mail-services.service';
import { UserInteractionService } from 'src/app/services/user-interaction.service';
import { ModifMdpComponent } from '../modif-mdp/modif-mdp.component';

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
  public mobile: boolean;
  private auth : Auth
  constructor(private ofApp: FirebaseApp, router: Router, private service:UserInteractionService,
     private mail_service:MailServicesService,public dialog: MatDialog, private _snackBar: MatSnackBar) { 
    this.router = router;
    this.user_db = new User()
    this.enseigne = "";
    this.restaurants = "";
    this.mobile = false;
    this.auth = getAuth(this.ofApp);
    // Attention l'url doit contenir l'information concernant le restaurant et le proprietaire
    this.url = this.router.parseUrl(this.router.url)
  }

  ngOnInit(): void{
    let user_info = this.url.queryParams;
    console.log(Object.keys(user_info));
    this.enseigne = user_info["prop"]
    onAuthStateChanged(this.auth, (user) => {
      if(user){
        this.service.getUserFromUid(user.uid, this.enseigne).then((user) => {
          this.user_db = user
          if(this.user_db.name == "") this.user_db.name = "pas de nom inscrit"
          if(this.user_db.surname == "") this.user_db.surname = "pas de prénom inscrit"
          if(this.user_db.numero == "") this.user_db.numero = "pas de numéro inscrit"
        })
      }
    })
    if (window.screen.width > 1040) { // 768px portrait
      this.mobile = true;
    }
  }

  suppCompte(){
    if(this.auth.currentUser !== null){
      this.mail_service.sendMailCompteSuppresse(this.user_db.email).subscribe((v) => {
        console.log(v);
        if(v === 'sended'){
          this._snackBar.open("la demande de suppression a été envoyée à SoftEat ils traiterons votre demande", "fermer")
        }
        else{
          this._snackBar.open("la demande de suppression n'a pas été envoyée à SoftEat veuillez reporter l'erreur et leurs communiquer le problème via email", "fermer")
        }
      })
    }
  }
  openModif(): void {
    const dialogRef = this.dialog.open(ModifMdpComponent, {
      height: "350px",
      width: "300px",
    });
  }
  clicdeConnexion(){
    const auth = getAuth(this.ofApp);
    auth.signOut();
    updateCurrentUser(auth, null);
    window.location.href = ""
  }

}
