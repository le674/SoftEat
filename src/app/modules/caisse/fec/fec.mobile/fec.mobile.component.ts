import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Record, RowFec } from 'src/app/interfaces/fec';
import { CommonService } from 'src/app/services/common/common.service';
import { FecModifRecordComponent } from '../fec.modif-record/fec.modif-record.component';
import { Account } from 'src/app/interfaces/account';
import { FecModifLettrageComponent } from '../fec.modif.lettrage/fec.modif.lettrage.component';

@Component({
  selector: 'app-fecmobile',
  templateUrl: './fec.mobile.component.html',
  styleUrls: ['./fec.mobile.component.css']
})
export class FecMobileComponent implements OnInit {
  @Input() row_fec:Array<RowFec>;
  @Input() records:Array<Record>;
  @Input() columns:Array<string>;
  @Input() stock:string | null;
  @Input() accounts:Array<Account>; 
  @Input() prop:string;
  public index_record:Array<string>;
  public visibles: Array<boolean>;
  constructor(public mobile_service:CommonService, public dialog: MatDialog) { 
    this.row_fec = [];
    this.records = [];
    this.columns = [];
    this.visibles = [];
    this.accounts = [];
    this.index_record = RowFec.getKeys();
    this.stock = null;
    this.prop = "";
  }

  ngOnInit(): void {
    this.row_fec = this.row_fec.map((value) => value.suppNulls());
    this.visibles = this.visibles.fill(false, 0, this.row_fec.length);
  }
  modifRecord(_record:RowFec) {
    const rec_num = this.records.find((record) => record.id === _record.id);
    if(rec_num){
      const dialog_ref = this.dialog.open(FecModifRecordComponent,{
        height: "700px",
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
  // Gestion de l'accordéon
  getVisible(i: number):boolean{
      return this.visibles[i];
  }
  changeArrow(arrow_index: number) {
      this.visibles[arrow_index] = !this.visibles[arrow_index];
  }
}
