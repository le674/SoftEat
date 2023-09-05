import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Unsubscribe } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { Account } from 'src/app/interfaces/account';
import { Record, RowFec } from 'src/app/interfaces/fec';
import { Condition } from 'src/app/interfaces/interaction_bdd';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-fectable',
  templateUrl: './fec.table.component.html',
  styleUrls: ['./fec.table.component.css']
})
export class FecTableComponent implements OnInit, OnDestroy {
@Input() prop_id;
private record_path:Array<string>;
private account_path:Array<string>;
private accounts:Array<Account>;
public records:Array<Record>;
public row_fec:Array<RowFec>;
public  panelOpenState = false;
private unsubscrib_account!: Unsubscribe;
private unsubscrib_record!: Unsubscribe;
private sub_account!: Subscription;
private sub_record!: Subscription;
public displayedColumns: string[] = ['CodeJournal', 'LibelléJournal', 'Numéro', 'DateComptabilisation',
'NuméroCompte', 'LibelléCompte', 'NuméroCompteAuxiliaire', 'LibelléCompteAuxiliaire',
'RéférencePièceJustificative', 'DatePièceJustificative', 'LibelléEcriture', 'MontantDébit', 'MontantCrédit',
'Lettrage', 'DateLettrage', 'DateValidation', 'Montantdevise', 'Idevise'];
public index_record:Array<string>;
/* public dataSource: MatTableDataSource<RowFec>;
 */  
  constructor(private service:FirebaseService) {
    this.prop_id = "";
    this.record_path = [];
    this.account_path = [];
    this.records = [];
    this.accounts = [];
    this.row_fec = [];
    this.index_record = RowFec.getKeys();
  }
  ngOnDestroy(): void {
    this.unsubscrib_account();
    this.unsubscrib_record();
    this.sub_account.unsubscribe();
    this.sub_record.unsubscribe();
  }
  ngOnInit(): void {
    let end_date = new Date();
    let start_date = new Date();
    start_date = new Date(start_date.setDate(-30));
    let conditions:Array<Condition> = 
    [
      {
        attribut:"reception_date",
        condition:">=",
        value:start_date.toISOString()
      },
      {
        attribut:"reception_date",
        condition:"<=",
        value:end_date.toISOString()
      }
    ];
    this.account_path = Account.getPathsToFirestore(this.prop_id);
    this.record_path = Record.getPathsToFirestore(this.prop_id);
    this.unsubscrib_record = this.service.getFromFirestoreBDD(this.record_path, Record, conditions);
    this.sub_record = this.service.getFromFirestore().subscribe((records) => {
      this.records = records as Array<Record>;
      this.unsubscrib_account = this.service.getFromFirestoreBDD(this.account_path, Account, null);
      this.service.getFromFirestore().subscribe((accounts) => {
        this.accounts = accounts as Array<Account>;
        this.row_fec = this.records.map((record) => {
          let _record = new RowFec();
          return _record.setRecord(record, this.accounts);
        });

      })
    })
  }
  modifRecord(record_num:number) {
    const rec_num = this.records.find((record) => record.number === record_num);
  
  }
}