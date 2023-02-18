import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Auth, sendEmailVerification, user } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, UrlTree } from '@angular/router';
import { getAuth, onAuthStateChanged, updateCurrentUser } from 'firebase/auth';
import { User } from 'src/app/interfaces/user';
import { MailServicesService } from 'src/app/services/mail-services.service';
import { UserInteractionService } from 'src/app/services/user-interaction.service';
import { ModifMailComponent } from '../modif-mail/modif-mail.component';
import { ModifMdpComponent } from '../modif-mdp/modif-mdp.component';
import { ModifNumberComponent } from '../modif-number/modif-number.component';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  private router: Router;
  private url: UrlTree;
  private auth : Auth;
  public user_db: User;
  public enseigne:string;
  public restaurants: string;
  public mobile: boolean;
  public contact_form = new FormGroup({
    sender: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required)
  })

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
    this.enseigne = user_info["prop"]
    this.restaurants = user_info["restaurant"];
    onAuthStateChanged(this.auth, (user) => {
      if(user){
        
        const private_data = this.service.getUserFromUid(user.uid, this.enseigne).then((user) => {
          this.user_db.restaurants = user.restaurants;
          this.user_db.statut = user.statut;
          return user
        })
        private_data.then((user_db) => {
          this.service.getUserDataFromUid(user.uid, this.enseigne, this.restaurants).then((user) => {
            this.user_db.name = user.name;
            this.user_db.numero = user.numero;
            this.user_db.surname = user.surname;
            this.user_db.email = user.email;
            if(this.user_db.name == "") this.user_db.name = "pas de nom inscrit"
            if(this.user_db.surname == "") this.user_db.surname = "pas de prénom inscrit"
            if(this.user_db.numero == "") this.user_db.numero = "pas de numéro inscrit"
          })
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
        if(v === 'sended'){
          this._snackBar.open("la demande de suppression a été envoyée à SoftEat ils traiterons votre demande", "fermer")
        }
        else{
          this._snackBar.open("la demande de suppression n'a pas été envoyée à SoftEat veuillez reporter l'erreur et leurs communiquer le problème via email", "fermer")
        }
      })
    }
  }

  sendMessage(){
    if(this.auth.currentUser !== null){
      if((this.contact_form.value.sender != null) && (this.contact_form.value.message != null) ){
        this.mail_service.sendMailMessage(this.contact_form.value.sender,this.contact_form.value.message).subscribe((res) => {
          if(res === 'sended'){
            this._snackBar.open("le message a été envoyé à SoftEat", "fermer")
          }
          else{
            this._snackBar.open("le message n'a pas pu être envoyé à SoftEat veuillez passer par leurs adresse mail et leur communiquer le problème merci.", "fermer")
          }
        })
      }
    }
  }
  
  openMail(){
    const dialogRef = this.dialog.open(ModifMailComponent, {
      height: "250px",
      width: "300px",
      data: {
        restaurant: this.restaurants,
        prop: this.enseigne,
        uid: this.user_db.id,
        auth: this.auth
      }
    });
  }

  openNumber(){
    const dialogRef = this.dialog.open(ModifNumberComponent, {
      height: "250px",
      width: "300px",
      data: {
        restaurant: this.restaurants,
        prop: this.enseigne,
        uid: this.user_db.id
      }
    });
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
  redirectAcceuil(){
    window.location.href = "accueil"
  }
}
