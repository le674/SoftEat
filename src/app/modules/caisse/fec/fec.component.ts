import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, UrlTree } from '@angular/router';
import { DocumentData, Unsubscribe } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { Account } from 'src/app/interfaces/account';
import { Record, RowFec } from 'src/app/interfaces/fec';
import { Condition, InteractionBddFirestore } from 'src/app/interfaces/interaction_bdd';
import { Proprietary } from 'src/app/interfaces/proprietaire';
import { CommonService } from 'src/app/services/common/common.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-fec',
  templateUrl: './fec.component.html',
  styleUrls: ['./fec.component.css']
})
export class FecComponent implements OnInit, OnDestroy {
  @Input() stock:string | null; 
  private url: UrlTree;
  public windows_screen_mobile:boolean;
  public prop:string;
  public siret:string;
  private record_path:Array<string>;
  private account_path:Array<string>;
  private proprietary_path:Array<string>;
  public accounts:Array<Account>;
  public records:Array<Record>;
  public row_fec:Array<RowFec>;
  private unsubscrib_account!: Unsubscribe;
  private unsubscrib_record!: Unsubscribe;
  private sub_account!: Subscription;
  private sub_record!: Subscription;
  public displayedColumns: string[] = ['JournalCode', 'JournalLib', 'EcritureNum', 'EcritureDate',
  'CompteNum', 'CompteLib','CompAuxNum', 'CompAuxLib',
  'PieceRef', 'PieceDate', 'EcritureLib', 'Debit', 'Credit',
  'EcritureLet', 'DateLet', 'ValidDate', 'Montantdevise', 'Idevise'];
  constructor(private router: Router, private service:FirebaseService, public mobile_service:CommonService) { 
    this.url = this.router.parseUrl(this.router.url);
    this.prop = "";
    this.siret = "";
    this.stock = null;
    this.account_path = [];
    this.record_path = [];
    this.proprietary_path = [];
    this.records = [];
    this.accounts = [];
    this.row_fec = [];
    this.windows_screen_mobile = this.mobile_service.getMobileBreakpoint("ing");
    let user_info = this.url.queryParams;
    this.prop = user_info["prop"];
  }
  ngOnDestroy(): void {
    if(this.unsubscrib_account){
      this.unsubscrib_account();
    }
    if(this.unsubscrib_record){
      this.unsubscrib_record();
    }
    if(this.sub_account.unsubscribe){
      this.sub_account.unsubscribe();
    }
    if(this.sub_record.unsubscribe){
      this.sub_record.unsubscribe(); 
    }
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
    
    this.account_path = Account.getPathsToFirestore(this.prop);
    this.record_path = Record.getPathsToFirestore(this.prop);
    this.proprietary_path = Proprietary.getPathsToFirestore();
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
        this.service.getFromFirestoreDocProm(this.proprietary_path, this.prop, Proprietary).then((doc:InteractionBddFirestore) => {
          const proprietary = doc as Proprietary;
          this.siret = proprietary.siret;
        })
      })
    });
  }
}
