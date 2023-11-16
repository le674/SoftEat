import { Component, EventEmitter, Inject, Input, NgModule, OnDestroy, OnInit, Output} from '@angular/core';
import { Ccommande } from '../../../../app/interfaces/commande';

import { Router, UrlTree } from '@angular/router';
import { Unsubscribe } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Ctable } from 'src/app/interfaces/table';
import { MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
@Component({
  selector: 'app-dialog-commandes',
  templateUrl: './dialog-commandes.component.html',
  styleUrls: ['./dialog-commandes.component.css']
})
export class DialogCommandesComponent  implements OnInit, OnDestroy{
  public commandes:Array<Array<Ccommande>>;
  private path_to_commandes: Array<string>;
  private prop: string;
  private restaurant: string;
  private req_commandes_brt!:Unsubscribe;
  private commandes_brt_sub!:Subscription;
  private url: UrlTree;
  isPopupOpen = false;
  isActive: boolean = false;
  isTableExpanded = false;
  selectedCommande: number | null = null;
  @Input() table: Ctable | undefined;
  public tableOccupied:boolean | null;
  constructor(@Inject(MAT_DIALOG_DATA) public data:{
    tableID: {tableID: string}
    cmds:Ccommande[][]
  },private firestore: FirebaseService, private router: Router, public dialog: MatDialog) {
    if(this.table !== undefined){
      this.tableOccupied = this.table.tableOccupied
    }
    else{
      this.tableOccupied = null;
    }
    this.prop = "";
    this.restaurant = "";
    this.path_to_commandes = [];
    this.commandes = [];
    this.url = this.router.parseUrl(this.router.url);
  }
  ngOnDestroy(): void {
    if(this.req_commandes_brt){
      this.req_commandes_brt();
    }
    if(this.commandes_brt_sub){
      this.commandes_brt_sub.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.commandes = this.data.cmds;
  }
  getTableId():string{
    return this.data.tableID.tableID;
  }
  toggleActive() {
    this.isActive = !this.isActive;
  }
  selectCommande(commande: number) {
    this.selectedCommande = commande;
  }
}
