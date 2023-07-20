import { Component } from '@angular/core';

interface Table {
  number: number;
  seats: number;
}

@Component({
  selector: 'app-salle',
  templateUrl: './salle.component.html',
  styleUrls: ['./salle.component.css']
})
export class SalleComponent {
  constructor() { }

  tableOccupied(tableNumber: number): boolean {
    // Ajoutez ici la logique pour vérifier si la table est occupée ou non
    // Vous pouvez utiliser un service, une variable de statut, ou toute autre logique appropriée
    // Par exemple, nous considérons que les tables avec un numéro pair sont occupées
    return tableNumber % 2 === 0;
  }

  selectTable(tableNumber: number) {
    // Ajoutez ici la logique de traitement pour la table sélectionnée
    console.log("Table sélectionnée :", tableNumber);
  }
}
