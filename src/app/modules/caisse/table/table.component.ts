import { Component, Input} from '@angular/core';
import { Ccommande } from '../../../../app/interfaces/commande';
import { Router, UrlTree } from '@angular/router';
import { Unsubscribe } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Ctable } from 'src/app/interfaces/table';
import { MatDialog} from '@angular/material/dialog';
import { DialogCommandesComponent } from '../dialog-commandes/dialog-commandes.component';
import { PriseCommandeComponent } from '../prise-commande/prise-commande.component';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  public tableOccupied:boolean | null;
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
  @Input() is_payable:boolean | undefined;

  constructor(private firestore: FirebaseService, private router: Router, public dialog: MatDialog) {
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
  openDialog() {
    const dialogRef = this.dialog.open(DialogCommandesComponent, {
      data: { 
        tableID: this.table?.id,
        cmds:this.commandes 
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if(typeof result === "number"){
        this.isActive = true;
      }
      else{
        if(result){
          const _dialog_ref = this.dialog.open(PriseCommandeComponent, {
            data: {
              prop:this.prop,
              restaurant:this.restaurant,
              table_id:this.table?.id
            },
            height: `${window.innerHeight - window.innerWidth / 10}px`,
            width: `${window.innerWidth - window.innerWidth / 10}px`,
          })
        }
        this.isActive = false;
      }
      console.log(`Dialog result: ${result}`);
    });
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
    console.log('commandes : ', this.path_to_commandes);
    this.req_commandes_brt = this.firestore.getFromFirestoreBDD(this.path_to_commandes, Ccommande, null);
    this.commandes_brt_sub   = this.firestore.getFromFirestore().subscribe((commande) => {
      console.log(commande);
      this.commandes.push(commande as Array<Ccommande>);
    })
  }
  getTableId():string{
    if(this.table?.id!=undefined){
      return this.table.id;
    }
    return "";
  }
  paiement_button() {
    this.isActive = false;
  }
  takeOrder(event: Event) {
    // Empêcher la propagation de l'événement de clic
    event.stopPropagation();
    if (this.table) {
      // Ajoutez ici la logique pour prendre la commande
      if (!this.tableOccupied && !this.isActive) {
        this.isPopupOpen = true;
        this.isTableExpanded = true; // Activer l'agrandissement de la table
      }
    }

  }
  selectCommande(commande: number) {
    this.selectedCommande = commande;
    // Vous pouvez ajouter ici la logique pour traiter la commande sélectionnée
  }
  closePopup() {
    this.isTableExpanded = false; // desact l'agrandissement de la table
    this.isPopupOpen = false;
    this.selectedCommande = null;
  }
}
