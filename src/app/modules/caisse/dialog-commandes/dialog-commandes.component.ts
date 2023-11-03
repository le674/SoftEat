import { Component, EventEmitter, Inject, Input, NgModule, OnDestroy, OnInit, Output} from '@angular/core';
import { Ccommande } from '../../../../app/interfaces/commande';

import { Router, UrlTree } from '@angular/router';
import { Unsubscribe } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Ctable } from 'src/app/interfaces/table';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
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
  @Output() is_payable = new EventEmitter<boolean>();
  public tableOccupied:boolean | null;
  constructor(@Inject(MAT_DIALOG_DATA) public tableID: {tableID: string},private firestore: FirebaseService, private router: Router, public dialog: MatDialog) {
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
    this.prop = this.url.queryParams["prop"];
    this.restaurant = this.url.queryParams["restaurant"];
    this.path_to_commandes = Ccommande.getPathsToFirestore(this.prop, this.restaurant, this.getTableId());
    this.req_commandes_brt = this.firestore.getFromFirestoreBDD(this.path_to_commandes, Ccommande, null);
    this.commandes_brt_sub   = this.firestore.getFromFirestore().subscribe((commande) => {
    this.commandes.push(commande as Array<Ccommande>);
    })
    console.log(this.path_to_commandes);
  }
  getTableId():string{
    return this.tableID.tableID;
  }
  toggleActive() {
    this.isActive = !this.isActive;
  }
  closePopup(change_button:boolean) {
    this.dialog.closeAll();
    if(change_button){
      this.is_payable.emit(change_button);
    }
    this.selectedCommande = null;
  }
  selectCommande(commande: number) {
    this.selectedCommande = commande;
  }
}
