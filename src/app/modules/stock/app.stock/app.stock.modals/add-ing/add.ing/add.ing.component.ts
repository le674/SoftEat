import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add.ing',
  templateUrl: './add.ing.component.html',
  styleUrls: ['./add.ing.component.css']
})
export class AddIngComponent implements OnInit {
  private readonly _mat_dialog_ref: MatDialogRef<AddIngComponent>;

  public add_ing_section = new FormGroup({
    name: new FormControl('', Validators.required),
    name_tva: new FormControl('', Validators.required),
    taux_tva: new FormControl(0, Validators.required),
    quantity: new FormControl(0, Validators.required),
    quantity_unitary: new FormControl(0, Validators.required),
    unity: new FormControl('', Validators.required),
    unitary_cost:  new FormControl(0, Validators.required),
    dlc: new FormControl(0, Validators.required),
    quantity_bef_prep:  new FormControl(0, Validators.required),
    quantity_after_prep:  new FormControl(0, Validators.required)
  })

  constructor(public dialogRef: MatDialogRef<AddIngComponent>,) { 
    this._mat_dialog_ref = dialogRef;
  }

  ngOnInit(): void {
  }

  addIngredient(){
    
  }
}
