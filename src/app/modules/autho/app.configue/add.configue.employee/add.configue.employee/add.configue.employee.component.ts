import { Component, Inject, OnInit } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, updateCurrentUser } from 'firebase/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserInteractionService } from '../../../../../../app/services/user-interaction.service';
import { User } from '../../../../../../app/interfaces/user';
import { throwError } from 'rxjs';
import { Employee } from 'src/app/interfaces/employee';
import { Statut } from 'src/app/interfaces/statut';
import { CommonService } from 'src/app/services/common/common.service';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-add.configue.employee',
  templateUrl: './add.configue.employee.component.html',
  styleUrls: ['./add.configue.employee.component.css']
})
export class AddConfigueEmployeeComponent implements OnInit {
  private path_to_employee;
  private path_to_user;
  public add_employee = new FormGroup({
    name: new FormControl('', Validators.required),
    surname:new FormControl('', Validators.required),
    mail: new FormControl('', [Validators.required, Validators.email]),
    mdp: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  constructor(public dialogRef: MatDialogRef<AddConfigueEmployeeComponent>,
    private _snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: {
      restaurants: Array<string>
      prop: string
      auth: Auth
    }, public user_service: UserInteractionService, private common_service: CommonService,
    private service: FirebaseService) {
    this.path_to_employee = Employee.getPathsToFirestore(this.data.prop);
    this.path_to_user = User.getPathsToFirestore();
  }

  ngOnInit(): void {
  }

  addEmployee() {
    if (!this.add_employee.controls.mail.hasError("email") && !this.add_employee.controls.mdp.hasError("required")) {
      if ((this.add_employee.controls.mail.value !== null) && (this.add_employee.controls.mdp.value !== null)) {
        // on récupère l'ancien utilisateur connecté ici le propriétaire 
        const user = this.data.auth.currentUser;
        if (user !== null) {
          //ont crée le nouveau utilisateur puis on reconnecte le proprietaire 
          createUserWithEmailAndPassword(this.data.auth, this.add_employee.controls.mail.value, this.add_employee.controls.mdp.value).then((user_cred) => {
             updateCurrentUser(this.data.auth, user).then(() => {
              let name = "";
              let email = "";
              let surname = "";
              const uid = user_cred.user.uid;
              if (this.add_employee.controls.name.value !== null){
                name = this.add_employee.controls.name.value;
              }
              if (this.add_employee.controls.mail.value !== null) {
                email = this.add_employee.controls.mail.value as string;
              }
              if(this.add_employee.controls.surname.value !== null){
                surname = this.add_employee.controls.surname.value as string;
              }
              const status = new Statut();
              let employee = new Employee(email, status, uid);
              employee.name = name;
              employee.surname = surname;
              employee.auth_rh = [uid];
              employee.proprietary_id = this.data.prop;
              employee.statut = status;
              this.service.setFirestoreData(employee, this.path_to_employee, Employee).then((id) => {
                let _user:User = new User();
                _user.id_employee = id;
                _user.email = email;
                _user.proprietary_id = this.data.prop;
                _user.related_restaurants = [];
                _user.uid = uid;
                this.service.setFirestoreData(_user, this.path_to_user, User).then((_id) => {
                  employee.user_id = _id;
                  this.service.updateFirestoreData(id, employee, this.path_to_employee, Employee).then(() => {
                    this._snackBar.open(`l'utilisateur ${user.email} vient d'être ajouté dans la base de donnée`);
                  }).catch((err) => throwError(() => console.log(err)));
                }).catch((err) => throwError(() => console.log(err)));
              }).catch((err) => throwError(() => console.log(err)));
            });
          });
        }
      }
    }
  }
}
