import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    prop: string,
    uid: string
  }, private service: UserInteractionService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onNoClick():void{
    this.dialogRef.close();
  }

  sendNewNumber(){
    if(this.number_modification.valid && (this.number_modification.value.number != null)){
      const updated = this.service.updateNumber(this.data.prop, this.data.uid, this.number_modification.value.number).then(() => {
        this._snackBar.open("le numéro de téléphone a bien été modifié", "fermer")
      }).catch((error) => {
        console.log(error);
        this._snackBar.open("le numéro de téléphone n'a pas pu être modifié veuillez contacter SoftEat", "fermer") 
      })
    } 
  }

}
