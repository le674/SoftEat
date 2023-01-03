import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CalculService } from 'src/app/services/menus/menu.calcul/menu.calcul.ingredients/calcul.service';

@Component({
  selector: 'app-add.ing',
  templateUrl: './add.ing.component.html',
  styleUrls: ['./add.ing.component.css']
})
export class AddIngComponent implements OnInit {
  
  public is_prepa: boolean;
  public index_inputs:Array<number>
  public add_ing_section = new FormGroup({
    name: new FormControl('', Validators.required),
    name_tva: new FormControl(''),
    taux_tva: new FormControl(0),
    quantity: new FormControl(0, Validators.required),
    quantity_unitary: new FormControl(0, Validators.required),
    unity: new FormControl('', Validators.required),
    unitary_cost:  new FormControl(0, Validators.required),
    dlc: new FormControl(0, Validators.required),
    quantity_bef_prep:  new FormControl(0, Validators.required),
    quantity_after_prep:  new FormControl(0, Validators.required)
  })
  @ViewChild('taux')
  taux!: ElementRef;

  private current_inputs:number;
  private readonly _mat_dialog_ref: MatDialogRef<AddIngComponent>;
 
  constructor(public dialogRef: MatDialogRef<AddIngComponent>, public calcul_service: CalculService) { 
    this._mat_dialog_ref = dialogRef;
    this.is_prepa = false;
    this.current_inputs = 1;
    this.index_inputs = [this.current_inputs];
  }

  ngOnInit(): void {
    console.log(this.taux.nativeElement);
    
  }


  addIngredient(){
    
  }

  clickRadio(state:boolean){
    this.is_prepa = state
  }

  addInput():void{
    this.current_inputs = this.current_inputs + 1;
    this.index_inputs.push(this.current_inputs);
  }

  addTaux(event:Object):void{
    console.log(event["value" as keyof typeof event].toString());
    const taux = this.calcul_service.getTauxFromCat(event["value" as keyof typeof event].toString())
    console.log(this.taux.nativeElement);
    this.taux.nativeElement.value = taux
    console.log(event);
    
  }
}
