import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Account } from 'src/app/interfaces/account';
import { Facture } from 'src/app/interfaces/facture';
import { Journal, Record } from 'src/app/interfaces/fec';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Transaction } from 'src/app/transaction/transaction';

@Component({
  selector: 'app-fec.modif-record',
  templateUrl: './fec.modif.record.component.html',
  styleUrls: ['./fec.modif.record.component.css']
})
export class FecModifRecordComponent implements OnInit {
  public _accounts: Array<Account>;
  public modif_form = new FormGroup({
    journal_name: new FormControl(''),
    debit_ammount: new FormControl(0, Validators.required),
    credit_ammount: new FormControl(0, Validators.required),
    description: new FormControl(''),
    name: new FormControl('', Validators.required),
    reception_date: new FormControl(new Date(), Validators.required),
    accounts:new FormControl<Array<string>>([])
  });
  public accounts:Array<Account>;
  public journals:Array<{name:string, label:string, description:string}>;
  constructor(private service:FirebaseService, public dialogRef: MatDialogRef<FecModifRecordComponent>,
    private _snackBar: MatSnackBar,@Inject(MAT_DIALOG_DATA) public data: {
      record:Record,
      accounts:Array<Account>,
      prop:string
    }
  ){
    this.journals =  Journal.defaultJournal();
    this.accounts = this.data.accounts;
    this._accounts = [];
  }
  ngOnInit(): void {
    const reception_date = new Date(this.data.record.reception_date);
    const sended_date = new Date(this.data.record.send_date);
    this.modif_form.controls.journal_name.setValue(this.data.record.journal_name);
    this.modif_form.controls.debit_ammount.setValue(this.data.record.debit_ammount); 
    this.modif_form.controls.credit_ammount.setValue(this.data.record.credit_ammount); 
    this.modif_form.controls.description.setValue(this.data.record.description); 
    this.modif_form.controls.name.setValue(this.data.record.name);
    this.modif_form.controls.accounts.setValue(this.data.record.account_ids);   
    this.modif_form.controls.reception_date.setValue(reception_date);
    if(this.data.record.nature === 'facture'){
      this.modif_form.controls.name.disable();
    } 
  }
  changeRecord() {
    const journal_name = this.modif_form.controls.journal_name.value;
    const debit_ammount =  this.modif_form.controls.debit_ammount.value;
    const credit_ammount =  this.modif_form.controls.credit_ammount.value;
    const description =  this.modif_form.controls.description.value;
    const name =  this.modif_form.controls.name.value;
    const reception_date =  this.modif_form.controls.reception_date.value;
    const accounts = this.modif_form.controls.accounts.value;
    let record = new Record();
    let facture = new Facture("", null);
    record.setData(this.data.record);
    facture.id = record.name;
    if(journal_name){
      record.journal_name = journal_name;
      const default_journal = Journal.defaultJournal().find((journal) => journal.name === journal_name);
      if(default_journal){
        record.journal_label = default_journal.label;
      }
    }
    if(name){
      record.name = name;
    }
    if(debit_ammount){
      record.debit_ammount = debit_ammount;
    }
    if(credit_ammount){
      record.credit_ammount = credit_ammount;
      facture.ammount_total = credit_ammount;
    }
    if(description){
      record.description = description;
      facture.name = description;
    }
    if(reception_date){
      record.reception_date = reception_date.toISOString();
    }
    if(accounts){
      record.account_ids = accounts;
    }
    const conf = Transaction.changeRecord(this.data.prop, record, facture);
    this.service.setFirestoreMultipleDataOnly(conf).then(() => {
      console.log("write lettrage completed");
    }).catch((err) => {
      this._snackBar.open("impossible de modifier l'enrregistrement contacter softeat", "fermer");
      this.dialogRef.close();
      throw err;
    }).then(() => {
      this._snackBar.open("l'eregistrement vient d'être modifié", "fermer");
      this.dialogRef.close();
    }) 
  }
  printValue($event: MatOptionSelectionChange<string>) {
    const _accounts = this.modif_form.controls.accounts.value;
    const _account = this.accounts.find((account) =>  account.id === $event.source.value);
    if(_accounts){
      if($event.source.selected){
        if(_account) {
          this._accounts.push(_account);
        }
      }
      else{
        if(_account){ 
          this._accounts = this._accounts.filter((account) => account.id !== _account.id);
        }
      }
    }
  }
  closePopup($event: MouseEvent) {
    this.dialogRef.close();
  }
}
