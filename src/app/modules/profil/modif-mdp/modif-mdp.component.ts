import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Auth, updateCurrentUser } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {connectAuthEmulator, updatePassword } from 'firebase/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FIREBASE_AUTH_EMULATOR_HOST, FIREBASE_PROD } from '../../../../environments/variables';

@Component({
  selector: 'app-modif-mdp',
  templateUrl: './modif-mdp.component.html',
  styleUrls: ['./modif-mdp.component.css']
})
export class ModifMdpComponent implements OnInit {

  public mdp_modification = new FormGroup({
    prev_mdp: new FormControl('', Validators.required),
    new_mdp: new FormControl('', Validators.required)
  })
  constructor(public dialogRef: MatDialogRef<ModifMdpComponent>, private ofApp: FirebaseApp, private auth:Auth ,private _snackBar: MatSnackBar) {
    if ((location.hostname === "localhost") && (!FIREBASE_PROD)) {
      try {
         // Point to the RTDB emulator running on localhost.
         connectAuthEmulator(this.auth, FIREBASE_AUTH_EMULATOR_HOST);
      } catch (error) {
        console.log(error);
        
      }
  } 
  
  }

  ngOnInit(): void {
  }



  sendMailVerif() {
    if ((this.auth.currentUser != null) && this.mdp_modification.valid){
      const user = this.auth.currentUser
      let mdp = this.mdp_modification.value.new_mdp;
      let mdp_prev = this.mdp_modification.value.prev_mdp;
      mdp = (mdp == null) ? "" : mdp;
      if ((mdp !== "") && (mdp == mdp_prev)) {
        updatePassword(user, mdp).then(() => {
          let snack_bar_ref = this._snackBar.open("le mot de passe vient d'être changé", "fermer")
          snack_bar_ref.onAction().subscribe(() => {
            this._snackBar.dismiss()
          })
        }).catch((error) => {
          const msg = "le mot de passe n'est pas changé veuillez essayer de vous reconnecter avant de modifier le mot de passe " +
            "(si cela ne marche pas contactez SoftEat)"
          let snack_bar_ref =
            this._snackBar.open(msg, "reconnection", {
              duration: 10000
            })
          snack_bar_ref.onAction().subscribe(() => {
            this.auth.signOut();
            updateCurrentUser(this.auth, null);
            window.location.href = ""
          })
        });
      }
      else {
        this.mdp_modification.setErrors({ passwordMismatch: true })
        let snack_bar_ref = this._snackBar.open("veuillez bien confirmer le mot de passe", "fermer")
        snack_bar_ref.onAction().subscribe(() => {
          this._snackBar.dismiss()
        })
      }
    }
  }



  onNoClick(): void {
    this.dialogRef.close();
  }
}
