import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Facture } from 'src/app/interfaces/facture';
import { Record} from 'src/app/interfaces/fec';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Transaction } from 'src/app/transaction/transaction';

@Component({
  selector: 'app-fec.modif.lettrage',
  templateUrl: './fec.modif.lettrage.component.html',
  styleUrls: ['./fec.modif.lettrage.component.css']
})
export class FecModifLettrageComponent implements OnInit {
  public natures:Array<string>;
  public add_lettrage = new FormGroup({
    send_date: new FormControl(''),
    nature: new FormControl(''),
    id: new FormControl(''),
    accounts_number: new FormArray<FormGroup<{
      account_number: FormControl<string | null>
    }>>([])
  });
  constructor(public dialogRef: MatDialogRef<FecModifLettrageComponent>,@Inject(MAT_DIALOG_DATA) public data: {
    record:Record,
    prop:string
  }, private service:FirebaseService, private _snackBar: MatSnackBar) { 
    this.natures = Facture.getNatures();
  }

  ngOnInit(): void {
    this.add_lettrage.controls.send_date.setValue(this.data.record.send_date);
    this.add_lettrage.controls.nature.setValue(this.data.record.nature);
    this.add_lettrage.controls.id.setValue(this.data.record.id_src);
    if(this.data.record.account_ids_src){
      this.data.record.account_ids_src.forEach((account) => {
        let new_acc = new FormGroup({
          account_number:new FormControl(account)
        });
        this.add_lettrage.controls.accounts_number.push(new_acc);
      });
    }

  }
  submitInfo(){

    const date_sended = this.add_lettrage.controls.send_date.value;
    const identifiant = this.add_lettrage.controls.id.value;
    const nature = this.add_lettrage.controls.nature.value;
    const accounts = this.add_lettrage.controls.accounts_number.value;
    let _record = this.data.record;
    let record = new Record();
    let facture = new Facture("", null);
    record.setData(_record);
    facture.id = record.name;
    if(date_sended){
      record.send_date =  new Date(date_sended).toISOString();
      facture.date_reception = new Date(date_sended).toISOString();
    }
    if(nature){
      record.nature = nature;
      facture.nature = nature;
    }
    if(identifiant){
      record.id_src = identifiant;
      facture.identifiant = identifiant;
    }
    if(accounts){
      record.account_ids_src = accounts.map((account) => this.removeNull(account).account_number)
                                       .filter((account) => account !== "");
      facture.account_id = accounts.map((account) => this.removeNull(account).account_number)
                                   .filter((account) => account !== "");
    }
    record.lettrage = record.constructLettrage();
    const conf = Transaction.changeLettrage(this.data.prop, record, facture);
    this.service.setFirestoreMultipleDataOnly(conf).then(() => {
      console.log("write lettrage completed");
    }).catch((err) => {
      this._snackBar.open("impossible de modifier le lettrage contacter softeat", "fermer");
      this.dialogRef.close();
      throw err;
    }).then(() => {
      this._snackBar.open("le lettrage vient d'être modifié", "fermer");
      this.dialogRef.close();
    }) 
  }
  updateAccount(add_account: boolean) {
    const all_account = this.add_lettrage.controls.accounts_number.length;
    if (add_account) {
      this.add_lettrage.controls.accounts_number.push(
        new FormGroup({
          account_number: new FormControl("")
        })
      );
    }
    else {
      this.add_lettrage.controls.accounts_number.removeAt(all_account - 1);
    }
  }
  closePopup($event: MouseEvent) {
    this.dialogRef.close();
  }
  removeNull(account: Partial<{ account_number: string | null;}>){
    let acc:{
      account_number:string 
    } = {
      account_number: account.account_number ?? ""
    };
    return acc;
  }
}