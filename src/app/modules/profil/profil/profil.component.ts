import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Auth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, UrlTree } from '@angular/router';
import { connectAuthEmulator, onAuthStateChanged, updateCurrentUser } from 'firebase/auth';
import { User } from '../../../../app/interfaces/user';
import { MailServicesService } from '../../../../app/services/mail-services.service';
import { UserInteractionService } from '../../../../app/services/user-interaction.service';
import { FIREBASE_AUTH_EMULATOR_HOST, FIREBASE_PROD } from '../../../../environments/variables';
import { InfoAppliComponent } from '../../acceuil/app.component.acceuil/footer/info-appli/info-appli.component';
import { ModifMdpComponent } from '../modif-mdp/modif-mdp.component';
import { ModifNumberComponent } from '../modif-number/modif-number.component';
import { CommonService } from '../../../../app/services/common/common.service';
import { ModifMailComponent } from '../modif-mail/modif-mail.component';
import { Employee } from 'src/app/interfaces/employee';
import { Statut } from 'src/app/interfaces/statut';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  private router: Router;
  private url: UrlTree;
  public user_db: Employee;
  public enseigne:string;
  public restaurants: string;
  public not_mobile: boolean;
  public contact_form = new FormGroup({
    sender: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required)
  });

  constructor(private ofApp: FirebaseApp, router: Router, private service:UserInteractionService,
     private mail_service:MailServicesService,public dialog: MatDialog,
     private _snackBar: MatSnackBar, public mobile_service:CommonService,
     private auth:Auth) { 
    this.user_db = new Employee("", new Statut(), "");
    this.router = router;
    this.enseigne = "";
    this.restaurants = "";
    this.not_mobile = false;
    this.url = this.router.parseUrl(this.router.url)
  }
  ngOnInit(): void{
    let user_info = this.url.queryParams;
    this.enseigne = user_info["prop"]
    this.restaurants = user_info["restaurant"];
    onAuthStateChanged(this.auth, (user) => {
      if(user){
        let _user:User = new User();
        _user.proprietary_id = this.enseigne;
        _user.uid = user.uid;
        this.service.getEmployeeBDD(_user);
        this.service.getEmployee().subscribe((employee) => {
          this.user_db = employee;
        })
      }
    })
    this.not_mobile = this.mobile_service.getMobileBreakpoint("mobile");
  }

  suppCompte(){
    if(this.auth.currentUser !== null && this.user_db !== null){
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
        user: this.user_db,
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
        user: this.user_db
      }
    });
  }

  openModif(): void {
    const dialogRef = this.dialog.open(ModifMdpComponent, {
      height: "350px",
      width: "300px",
    });
  }

  openConcept():void{
    const message = "SoftEat est une application d'aide à la gestion d'un restaurant," +
    " les fonctionnalitées suivantes\n sont prisent en charge par l'application\n" + 
    "1/ Gestion de l'inventaire et notifications en cas de rupture de stock\n" +
    "2/ Affichage des fiches techniques et données concernant les plats et menus\n" +
    "3/ Analyse du restaurant\n" +
    "4/ Comptabilité\n" +
    "5/ Gestion des factures, archivage et récupération des entrants\n" +
    "6/ Gestion des ressources humaines \n" ;
    const dialogRef = this.dialog.open(InfoAppliComponent, {
      height: "500px",
      width: "400px",
      data : {
        aides: false,
        section: "Concept",
        message: message
      }
    });
  }

  openInfo():void{
    const message = "SoftEat n'est pas uniquement une solution qui souhaite vous faire gagner du temps et de l'argent," +
    " avec SoftEat nous proposons un accompagnement pour chaque enseigne" +
    " la maintenance de votre application, des formations, des conseils" +
    " ainsi que des évolutions de l'application dont vous pouvez être acteurs.\n \n \n \n \n \n";
    const dialogRef = this.dialog.open(InfoAppliComponent, {
      height: "500px",
      width: "400px",
      data : {
        aides: false,
        section: "Qui sommes nous ?",
        message: message
      }
    });
  }

  openChart():void{
    const message = "1/ Les utilisateurs s'engage à ne pas utiliser l'application en dehors de leurs domaines de compétences\n" +
    "2/ Les utilisateurs s'engage à communiquer des informations concernant leurs restaurant à SoftEat\n" +
    "3/ SoftEat s'engage à protéger et rendre privée les informations concernant les différentes enseignes\n" +
    "4/ SoftEat s'engage à ne pas exploiter les informations récoltés par l'application en dehors de celle-ci\n \n" ;
    const dialogRef = this.dialog.open(InfoAppliComponent, {
      height: "500px",
      width: "400px",
      data : {
        aides: false,
        section: "charte d'utilisation",
        message: message
      }
    });
  }

  openHelp():void{
    //const message = "Cliquer sur une section afin de bénéficier d'une aide concernant le fonctionnement de l'application";
    const message = "en cours de création la documentation n'est pas encore disponible"
    const dialogRef = this.dialog.open(InfoAppliComponent, {
      height: "500px",
      width: "400px",
      data : {
        aides: false,
        section: "aide",
        message: message
      }
    });
  }

  clicdeConnexion(){
    this.auth.signOut();
    updateCurrentUser(this.auth, null);
    window.location.href = ""
  }
  redirectAcceuil(){
    window.location.href = "accueil"
  }
}
