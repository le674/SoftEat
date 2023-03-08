import { Component, Inject, OnInit } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, updateCurrentUser } from 'firebase/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add.configue.employee',
  templateUrl: './add.configue.employee.component.html',
  styleUrls: ['./add.configue.employee.component.css']
})
export class AddConfigueEmployeeComponent implements OnInit {
  public add_employee = new FormGroup({
    mail: new FormControl('', [Validators.required, Validators.email]),
    mdp: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  constructor(public dialogRef: MatDialogRef<AddConfigueEmployeeComponent>,
    private _snackBar: MatSnackBar,@Inject(MAT_DIALOG_DATA) public data:{
    restaurants:Array<string>
    prop:string
    auth:Auth
    }) {
     }

  ngOnInit(): void {
  }

  addEmployee(){
    if(!this.add_employee.controls.mail.hasError("email") && !this.add_employee.controls.mdp.hasError("required")){
      if((this.add_employee.controls.mail.value !== null) && (this.add_employee.controls.mdp.value !== null)){
        // on récupère l'ancien utilisateur connecté ici le propriétaire 
        const user = this.data.auth.currentUser;
        if(user !== null){
          //ont crée le nouveau utilisateur puis on reconnecte le proprietaire 
          createUserWithEmailAndPassword(this.data.auth, this.add_employee.controls.mail.value, this.add_employee.controls.mdp.value).then((user_cred) => {
            updateCurrentUser(this.data.auth,user);
          });
        }
      }
    }
  }
}
