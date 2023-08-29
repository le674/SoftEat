import { Component, Input } from '@angular/core';
import { Ctable } from '../../../../app/interfaces/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {

  @Input() table: Ctable | undefined;
  public tableOccupied:boolean | null;

  constructor() {
    if(this.table !== undefined){
      this.tableOccupied = this.table.tableOccupied
    }
    else{
      this.tableOccupied = null;
    }
  }
  isActive: boolean = false;

  toggleActive() {
    this.isActive = !this.isActive;
  }
  paiement_button() {
    let table = new Ctable();
    console.log("paiement... nbr: " + table.seats);
  }
  takeOrder(event: Event) {
    // Empêcher la propagation de l'événement de clic
    event.stopPropagation();
    if (this.table) {
      // Ajoutez ici la logique pour prendre la commande
      console.log("Commande prise pour la table :", this.table?.tableNumber);
    }
  }

}
