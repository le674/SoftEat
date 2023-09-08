import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Record, RowFec } from 'src/app/interfaces/fec';
import { FecModifRecordComponent } from '../fec.modif-record/fec.modif-record.component';
import { Account } from 'src/app/interfaces/account';
import { FecModifLettrageComponent } from '../fec.modif.lettrage/fec.modif.lettrage.component';

@Component({
  selector: 'app-fectable',
  templateUrl: './fec.table.component.html',
  styleUrls: ['./fec.table.component.css']
})
export class FecTableComponent implements OnInit {
@Input() row_fec:Array<RowFec>;
@Input() records:Array<Record>;
@Input() columns:Array<string>;
@Input() accounts:Array<Account>;
@Input() prop:string;
public  panelOpenState = false;
public index_record:Array<string>;
/* public dataSource: MatTableDataSource<RowFec>;
 */  
  constructor(public dialog: MatDialog) {
    this.records = [];
    this.row_fec = [];
    this.columns = [];
    this.accounts = [];
    this.index_record = RowFec.getKeys();
    this.prop = "";
  }
  ngOnInit(): void {
  }
  modifRecord(_record:RowFec) {
    const rec_num = this.records.find((record) => record.id === _record.id);
    if(rec_num){
      const dialog_ref = this.dialog.open(FecModifRecordComponent,{
        height: "900px",
        width: "600px",
        data:{
          record:rec_num,
          accounts:this.accounts,
          prop:this.prop
        }
      }); 
    }
  }
  openSenderInfo(_record:RowFec){
    const rec_num = this.records.find((record) => record.id === _record.id);
    if(rec_num){
      const dialog_ref = this.dialog.open(FecModifLettrageComponent,{
        height: "900px",
        width: "600px",
        data:{
          record:rec_num,
          prop:this.prop
        }
      }); 
    }
  }
}