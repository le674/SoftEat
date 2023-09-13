import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Record, RowFec } from 'src/app/interfaces/fec';
import { FecModifRecordComponent } from '../fec.modif-record/fec.modif-record.component';
import { Account } from 'src/app/interfaces/account';
import { FecModifLettrageComponent } from '../fec.modif.lettrage/fec.modif.lettrage.component';
import { CommonTableService } from 'src/app/services/common/common.table.service';
import { DownloadService } from 'src/app/services/download/download.service';
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
constructor(public dialog: MatDialog,
    private table_service:CommonTableService,
    private download_service:DownloadService) {
    this.records = [];
    this.row_fec = [];
    this.columns = [];
    this.accounts = [];
    this.index_record = RowFec.getKeys(false);
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
  addRecord() {
    const dialog_ref = this.dialog.open(FecModifRecordComponent,{
      height: "900px",
      width: "600px",
      data:{
        record:null,
        accounts:this.accounts,
        prop:this.prop
      }
    }); 
  }
  exportTab(){
    let _keys = RowFec.getKeys(true);
    let date_validation = Record.formatDate(new Date());
    let table = [this.columns];
    this.row_fec.forEach((record, index) => {
      let line = [];
      for(let index of _keys){
        let value_line = record[index];
        if(index === 'valid_date'){
          value_line = date_validation;
        }
        else{
          if(['timestamp_reception_date', 'timestamp_send_date', 'timestamp_lettrage_date'].includes((index))){
            value_line = Record.formatDate(new Date(record[index]));
          }
          else{
            if(value_line){
              value_line = record[index].toString(); 
            }
            else{
              value_line = "";
            }
          }
        }
        line.push(value_line);
      }
      table.push(line);
    });
    const str_table = this.table_service.arrayToTab(table);
    this.download_service.download(str_table, "fec");
  }

}