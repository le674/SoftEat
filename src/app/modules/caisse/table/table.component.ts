import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() tableNumber: string | undefined;
  @Input() seats: number | undefined;
  @Input() tableOccupied: boolean | undefined;

  isActive: boolean = false;

  toggleActive() {
    this.isActive = !this.isActive;
  }
  paiement_button(){
    console.log("paiement...");

  }
  takeOrder(event: Event) {
    // Empêcher la propagation de l'événement de clic
    event.stopPropagation();

    // Ajoutez ici la logique pour prendre la commande
    console.log("Commande prise pour la table :", this.tableNumber);
  }

  constructor() { }

  ngOnInit(): void {
  }
}
