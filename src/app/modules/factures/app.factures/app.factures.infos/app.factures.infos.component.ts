import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormArrayName, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Unsubscribe } from 'firebase/firestore';
import { Subscription, throwError } from 'rxjs';
import { Account } from 'src/app/interfaces/account';
import { Facture } from 'src/app/interfaces/facture';
import { Journal, Record } from 'src/app/interfaces/fec';
import { FactureInteractionService } from 'src/app/services/factures/facture-interaction/facture-interaction.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Transaction } from 'src/app/transaction/transaction';

@Component({
  selector: 'app-factures-infos',
  templateUrl: './app.factures.infos.component.html',
  styleUrls: ['./app.factures.infos.component.css']
})
export class AppFacturesInfosComponent implements OnInit, OnDestroy {
  public add_facture_infos = new FormGroup({
    name: new FormControl('', Validators.required),
    nature: new FormControl('', Validators.required),
    cost: new FormControl(0, Validators.required),
    id: new FormControl(''),
    accounts_number: new FormArray<FormGroup<{
      account_number: FormControl<string | null>
    }>>([])
  });
  public natures;
  public accounts: Array<Account>;
  @Output() myEvent = new EventEmitter<boolean>();
  @Input() prop: string;
  @Input() file!: File;
  @Input() facture!: Facture;
  private unsubscrib!: Unsubscribe;
  private sub_account!: Subscription;
  constructor(public facture_service: FactureInteractionService, private _snackBar: MatSnackBar, private service: FirebaseService) {
    this.prop = "";
    this.natures = Facture.getNatures();
    this.accounts = [];
  }
  ngOnDestroy(): void {
    if(this.unsubscrib){
      this.unsubscrib();
    }
    if( this.sub_account){
      this.sub_account.unsubscribe();
    }
  }
  ngOnInit(): void {
    const path_to_accounts = Account.getPathsToFirestore(this.prop);
    this.unsubscrib = this.service.getFromFirestoreBDD(path_to_accounts, Account, null);
    this.sub_account = this.service.getFromFirestore().subscribe((_accounts) => {
      const accounts = _accounts as Array<Account>;
      this.accounts = accounts;
    });
  }
  submitInfo() {
    let record = new Record();
    this.facture.account_id = []
    const _accounts = this.add_facture_infos.controls.accounts_number.controls.flat()
      .map((form_grp) => form_grp.controls.account_number.value)
      .map((account) => this.checkNull(account))
      .filter((account) => account !== "");
    if (this.add_facture_infos.valid) {
      const cost = this.add_facture_infos.controls.cost.value;
      const name = this.add_facture_infos.controls.name.value;
      const id = this.add_facture_infos.controls.id.value;
      const nature = this.add_facture_infos.controls.nature.value;
      if (_accounts) {
        this.facture.account_id = _accounts;
      }
      if (cost) {
        this.facture.ammount_total = cost;
      }
      if (name) {
        this.facture.supplier = name;
      }
      if (nature) {
        this.facture.nature = nature;
      }
      if (id) {
        this.facture.identifiant = id;
      }
      record.account_ids = Account.getPreAddedAccount(this.accounts, "facture").map((account) => account.id);
      record.account_ids_src = this.facture.account_id;
      record.credit_ammount = 0;
      record.debit_ammount = this.facture.ammount_total;
      record.description = `${this.facture.nature} - ${this.facture.name}`;
      record.devise = null;
      record.devise_ammount = null;
      if (this.facture.identifiant !== null) {
        record.id_src = this.facture.identifiant;
      }
      record.journal_name = Journal.defaultJournal()[0].name;
      record.journal_label = Journal.defaultJournal()[0].label;
      record.nature = this.facture.nature;
      record.number = -1;
      record.reception_date = new Date().toISOString();
      record.send_date = this.facture.date_reception;
      record.validation_date = "";
      record.lettrage = record.constructLettrage();
      record.lettrage_label = record.lettrageLabel();
      this.facture_service.setFactureFirestore(this.prop, this.facture).then((facture) => {
        const result = facture.creatPath(this.prop);
        if (!result) {
          this._snackBar.open("problème lors de l'archivage de la facture veuillez contacter softeat", "fermer");
          throw "identifiant du propriétaire null ou identifiant de la facture non existant"
        }
        this.facture_service.setFactureStorage(this.file, facture).catch((error) => {
          this._snackBar.open("problème lors de l'archivage de la facture veuillez contacter softeat", "fermer");
          let err = new Error(error);
          return throwError(() => err).subscribe((error) => {
            console.log(error);
          });
        }).then(() => {
          if(facture.id) record.name = facture.id;
          this.service.setFirestoreMultipleData(record, Transaction.addRecord(this.prop)).catch((error) => {
            this._snackBar.open("problème lors de l'archivage de la facture veuillez contacter softeat", "fermer");
            let err = new Error(error);
            return throwError(() => err).subscribe((error) => {
              console.log(error);
            })
          }).finally(() => {
            this.sleep(10).then(() => {
              this.myEvent.emit(true);
              this._snackBar.open("Téléchargement de la facture terminé", "fermer");
            })
          });
        })
      }).catch((error) => {
        this._snackBar.open("problème lors de l'archivage de la facture veuillez contacter softeat", "fermer");
        let err = new Error(error);
        return throwError(() => err).subscribe((error) => {
          console.log(error);
        })
      })
    }
  }
  updateAccount(add_account: boolean) {
    const all_account = this.add_facture_infos.controls.accounts_number.length;
    if (add_account) {
      this.add_facture_infos.controls.accounts_number.push(
        new FormGroup({
          account_number: new FormControl("")
        })
      );
    }
    else {
      this.add_facture_infos.controls.accounts_number.removeAt(all_account - 1);
    }
  }
  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  /*   printValue($event: MatOptionSelectionChange<string>) {
    const _accounts = this.add_facture_infos.controls.account_number.value;
    const _account = this.accounts.find((account) =>  account.id === $event.source.value);
    if(_accounts){
      if($event.source.selected){
        if(_account) {
          this.desc.push(_account);
        }
      }
      else{
        if(_account){ 
          this.desc = this.desc.filter((account) => account.id !== _account.id);
        }
      }
    }
  } */
  private checkNull(stringOrNull: string | null): string {
    return stringOrNull ?? "";
  }
}
