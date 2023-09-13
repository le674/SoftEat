import { Component, Input } from '@angular/core';
import { Ccommande } from '../../../../app/interfaces/commande';

import { Router, UrlTree } from '@angular/router';
import { Unsubscribe } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Ctable } from 'src/app/interfaces/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {

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

  constructor(private firestore: FirebaseService, private router: Router) {

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
    
    console.log("commande 0 : "+this.commandes[0]);
    console.log("longueur: "+this.commandes.length);
    })
    //console.log("commandes : "+this.commandes[0].id);
    //this.commandeNbr = this.commandes.length;
    console.log(this.path_to_commandes);

  }
  getTableId():string{
    if(this.table?.id!=undefined){
      return this.table.id;
    }
    return "";
  }
  toggleActive() {
    this.isActive = !this.isActive;
  }
  paiement_button() {
    let table = new Ctable();

    console.log("commande 0.2 : "+this.commandes[0]);
    console.log("longueur: "+this.commandes.length);
  }
  takeOrder(event: Event) {
    // Empêcher la propagation de l'événement de clic
    event.stopPropagation();
    if (this.table) {
      // Ajoutez ici la logique pour prendre la commande
      if (!this.tableOccupied && !this.isActive) {
        this.isPopupOpen = true;
        this.isTableExpanded = true; // Activer l'agrandissement de la table

        console.log("Commande prise pour la table :", this.table?.tableNumber);

        
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
