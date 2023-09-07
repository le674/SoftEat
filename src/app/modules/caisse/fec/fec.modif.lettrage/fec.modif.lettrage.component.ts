import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Facture } from 'src/app/interfaces/facture';
import { Record} from 'src/app/interfaces/fec';

@Component({
  selector: 'app-fec.modif.lettrage',
  templateUrl: './fec.modif.lettrage.component.html',
  styleUrls: ['./fec.modif.lettrage.component.css']
})
export class FecModifLettrageComponent implements OnInit {
submitInfo() {
throw new Error('Method not implemented.');
}
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
  }) { 
    this.natures = Facture.getNatures();
  }

  ngOnInit(): void {
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
}
