import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Auth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, UrlTree } from '@angular/router';
import { connectAuthEmulator} from 'firebase/auth';
import { MailServicesService } from '../../../../../app/services/mail-services.service';
import { FIREBASE_AUTH_EMULATOR_HOST, FIREBASE_PROD } from '../../../../../environments/variables';
import { InfoAppliComponent } from './info-appli/info-appli.component';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  private router: Router;
  private url: UrlTree;
  public enseigne:string;
  public restaurants: string;
  public not_mobile: boolean;
  public contact_form = new FormGroup({
    sender: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required)
  })

  constructor(private auth: Auth, private _snackBar: MatSnackBar, router: Router,
    private mail_service:MailServicesService, public dialog: MatDialog, public mobile_service:CommonService) {
    this.router = router;
    this.enseigne = "";
    this.restaurants = "";
    this.not_mobile = false;
    if ((location.hostname === "localhost") && (!FIREBASE_PROD)) {
      try {
         // Point to the RTDB emulator running on localhost.
         connectAuthEmulator(this.auth, FIREBASE_AUTH_EMULATOR_HOST);
      } catch (error) {
        console.log(error);
      }
    } 
  
    // Attention l'url doit contenir l'information concernant le restaurant et le proprietaire
    this.url = this.router.parseUrl(this.router.url)
   }

  ngOnInit(): void {
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
  openConcept():void{
    const message = "SoftEat est une application d'aide à la gestion d'un restaurant," +
    " les fonctionnalitées suivantes\n sont prisent en charge par l'application\n" + 
    "1/ Gestion de l'inventaire et notifications en cas de rupture de stock\n" +
    "2/ Affichage des fiches techniques et données concernant les plats et menus\n" +
    "5/ Gestion des factures\n" +
    "6/ Planning \n" ;
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
    const message = "Nous sommes deux frères passionnés à la fois par l'informatique et la cuisine.\n" + 
    "Après avoir travaillé en tant que serveurs et livreurs dans différents restaurants," +
    "nous avons constaté qu'à l'heure actuelle," +
    "il est essentiel d'utiliser toutes les ressources à notre disposition pour améliorer les opérations dans le secteur de la restauration. ";
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

}
