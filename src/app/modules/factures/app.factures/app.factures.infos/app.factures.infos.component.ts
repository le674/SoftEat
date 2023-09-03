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

@Component({
  selector: 'app-factures-infos',
  templateUrl: './app.factures.infos.component.html',
  styleUrls: ['./app.factures.infos.component.css']
})
export class AppFacturesInfosComponent implements OnInit, OnDestroy {
  public add_facture_infos = new FormGroup({
    name:new FormControl('', Validators.required),
    nature:new FormControl('', Validators.required),
    cost:new FormControl(0, Validators.required),
    id:new FormControl(''),
    account_number:new FormControl<Array<string>>([])
  });
  public natures;
  public accounts:Array<Account>;
  public desc:Array<Account>;
  @Output() myEvent = new EventEmitter<boolean>();
  @Input() prop:string;
  @Input() file!:File;
  @Input() facture!:Facture;
  private unsubscrib!:Unsubscribe;
  private sub_account!:Subscription;
  constructor(public facture_service:FactureInteractionService,  private _snackBar:MatSnackBar, private service:FirebaseService){
    this.prop = "";
    this.natures = Facture.getNatures();
    this.accounts = [];
    this.desc = [];
  }
  ngOnDestroy(): void {
    this.unsubscrib();
    this.sub_account.unsubscribe();
  }
  ngOnInit(): void {
    this.desc = [];
    const path_to_accounts = Account.getPathsToFirestore(this.prop);
    this.unsubscrib = this.service.getFromFirestoreBDD(path_to_accounts, Account, null);
    this.sub_account = this.service.getFromFirestore().subscribe((_accounts) => {
      const accounts = _accounts as Array<Account>;
      this.accounts = accounts;
      const pre_added_account = Account.getPreAddedAccount(this.accounts, "facture");
      this.add_facture_infos.controls.account_number.setValue(pre_added_account.map((acc) => acc.id));
    });
  }
  submitInfo() {
    let record = new Record();
    let accounts = null;
    this.facture.account_id = []
    const _accounts = this.add_facture_infos.controls.account_number.value;
    if(_accounts){
      accounts = this.accounts.filter((account) => _accounts.includes(account.id));
    }
    if(this.add_facture_infos.valid){
      const cost = this.add_facture_infos.controls.cost.value;
      const name = this.add_facture_infos.controls.name.value;
      const id = this.add_facture_infos.controls.id.value;
      const nature = this.add_facture_infos.controls.nature.value;
      if(accounts){
        this.facture.account_id = accounts.map((acc) => acc.id);
      }
      if(cost){
        this.facture.ammount_total = cost;
      }
      if(name){
        this.facture.supplier = name;
      }
      if(nature){
        this.facture.nature = nature;
      }
      if(id){
        this.facture.identifiant = id;
      }
      this.facture.account_id
      record.account_ids = this.facture.account_id;
      record.account_ids_src = null;
      record.credit_ammount = 0;
      record.debit_ammount = this.facture.ammount_total;
      record.description = `${this.facture.nature} - ${this.facture.id}`;
      record.devise = null;
      record.devise_ammount = null;
      if(this.facture.id !== null){
        record.id_src = this.facture.id; 
      }
      record.journal_name = Journal.defaultJournal()[1].name;
      record.journal_label = Journal.defaultJournal()[1].label;
      record.name = `${this.facture.name}`;
      record.nature = this.facture.nature;
      record.number = -1;
      record.reception_date = new Date().toISOString();
      record.send_date = this.facture.date_reception;
      record.validation_date = "";
      this.facture_service.setFactureFirestore(this.prop, this.facture).then((facture) => {
        const result = facture.creatPath(this.prop);
        if(!result){
          this._snackBar.open("problème lors de l'archivage de la facture veuillez contacter softeat", "fermer");
          throw "identifiant du propriétaire null ou identifiant de la facture non existant"
        }
        this.facture_service.setFactureStorage(this.file, facture).catch((error) => {
          this._snackBar.open("problème lors de l'archivage de la facture veuillez contacter softeat", "fermer");
          let err = new Error(error);
          return throwError(() => err).subscribe((error) => {
            console.log(error);
          });
        }).finally(() => {
          this.sleep(10).then(() => {
            this.myEvent.emit(true);
            this._snackBar.open("Téléchargement de la facture terminé", "fermer");
          })
        });
      }).catch((error) => {
        this._snackBar.open("problème lors de l'archivage de la facture veuillez contacter softeat", "fermer");
        let err = new Error(error);
        return throwError(() => err).subscribe((error) => {
          console.log(error);
        })
      }) 
    }
  }
  printValue($event: MatOptionSelectionChange<string>) {
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
  }
  sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
