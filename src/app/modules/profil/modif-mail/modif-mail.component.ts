import { Component, Inject, OnInit } from '@angular/core';
import { Auth, updateCurrentUser, updateEmail } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Employee } from 'src/app/interfaces/employee';
import { UserInteractionService } from 'src/app/services/user-interaction.service';

@Component({
  selector: 'app-modif-mail',
  templateUrl: './modif-mail.component.html',
  styleUrls: ['./modif-mail.component.css']
})
export class ModifMailComponent implements OnInit {
  public email_modification = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern('.+@.+\..+')]),
  })
  constructor(public dialogRef: MatDialogRef<ModifMailComponent>, @Inject(MAT_DIALOG_DATA) public data: {
    restaurant:string,
    prop: string,
    user: Employee,
    auth: Auth
  }, private service: UserInteractionService,private _snackBar: MatSnackBar){ 
    this.email_modification.controls.email.setValue(this.data.user.email);
  }
  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  sendNewMail() {
    if (this.email_modification.valid && (this.email_modification.value.email != null) && (this.data.auth.currentUser != null)) {
       //on modifie l'email dans firebase
      const updated =  updateEmail(this.data.auth.currentUser, this.email_modification.value.email) 
      localStorage
      updated.then(() => {
         //on écrit dans la base de donnée le nouveau email
         if ((this.email_modification.value.email != null)) {
          this.service.updateEmployee(this.data.prop, this.data.user,"email" ,this.email_modification.value.email).then(() => {
            // Email updated!
           this._snackBar.open("l'email a bien été modifié", "fermer")
          }).catch((error) => {
            console.log(error);
            // An error occurred
           this._snackBar.open("l'email n'a été que partiellement modifié veuillez contacter SoftEat (envoyez leurs le nouveau email)", "fermer")
          });
         }
      }).catch((error) => {
        console.log(error);
        let msg = "";
        const type  = error.message.match(".*requires-recent-login.*");
        if(error.message.includes("requires-recent-login)")){
          //on considère le cas ou l'email n'a pas pu être modifié probable cause connexion trop vieille
          msg = "l'email n'est pas changé veuillez essayer de vous reconnecter avant de modifier l'email " +
          "(si cela ne marche pas contactez SoftEat)"
        }
        if(error.message.includes("email-already-in-use")){
          //on considère le cas ou l'email n'a pas pu être modifié probable cause connexion trop vieille
          msg = "l'email n'est pas changé, le nouvelle email est déjè utilisé par un autre compte veuillez essayer un autre email" +
          "(si cela ne marche pas contactez SoftEat)"
        }
        let snack_bar_ref =
          this._snackBar.open(msg, "reconnection", {
            duration: 10000
          })
          
          // on deconnect l'utiliateur en cas de nécessiter de reconnexion
          snack_bar_ref.onAction().subscribe(() => {
            this.data.auth.signOut();
            updateCurrentUser(this.data.auth, null);
            window.location.href = ""
          })  
      }) 
    }
  }
}
