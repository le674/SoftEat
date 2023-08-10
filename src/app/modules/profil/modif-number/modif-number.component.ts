import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { Employee } from 'src/app/interfaces/employee';
import { UserInteractionService } from 'src/app/services/user-interaction.service';

@Component({
  selector: 'app-modif-number',
  templateUrl: './modif-number.component.html',
  styleUrls: ['./modif-number.component.css']
})
export class ModifNumberComponent implements OnInit {
  public number_modification = new FormGroup({
    number: new FormControl('', [Validators.required, Validators.pattern('^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$')]),
  })

  constructor(public dialogRef: MatDialogRef<ModifNumberComponent>, @Inject(MAT_DIALOG_DATA) public data: {
    restaurant: string,
    prop: string,
    user: Employee
  }, private service: UserInteractionService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.number_modification.controls.number.setValue(this.data.user.number);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  sendNewNumber() {
    if (this.number_modification.valid && (this.number_modification.value.number != null) && (this.data.user !== null)){
      const updated = this.service.updateEmployee(this.data.prop, this.data.user, "number", this.number_modification.value.number).catch((error) => {
        this._snackBar.open("le numéro de téléphone n'a pas pu être modifié veuillez contacter SoftEat", "fermer")
        const err = new Error(error);
        return throwError(() => err).subscribe((error) => {
          console.log(error);
        });
      }).then(() => {
        this._snackBar.open("le numéro de téléphone a bien été modifié", "fermer")
      })
    }
  }

}
