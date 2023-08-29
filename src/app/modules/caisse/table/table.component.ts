import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import  {Ctable} from '../../../../app/interfaces/table';
import { Unsubscribe } from 'firebase/auth';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit,OnDestroy {
  
  @Input() tableNumber: string | undefined;
  @Input() seats: number | undefined;
  @Input() tableOccupied: boolean | undefined;

  private prop: string;
  private restaurant: string;
  private path_to_tables:Array<string>;
  private req_tables_brt!: Unsubscribe;
  constructor(private firestore: FirebaseService) { 
    this.prop = "";
    this.restaurant = "";
    this.path_to_tables = [];


  }
  ngOnDestroy(): void {

  }

  ngOnInit(): void {

    this.path_to_tables = Ctable.getPathsToFirestore(this.prop, this.restaurant);
    this.req_tables_brt = this.firestore.getFromFirestoreBDD(this.path_to_tables, Ctable, null);
    const obs_ing = this.firestore.getFromFirestore()
    console.log("");
  }
  
  isActive: boolean = false;

  toggleActive() {
    this.isActive = !this.isActive;
  }
  paiement_button(){
    let table = new Ctable();

    console.log("paiement... nbr: "+table.nbr_clients_max);

  }
  takeOrder(event: Event) {
    // Empêcher la propagation de l'événement de clic
    event.stopPropagation();

    // Ajoutez ici la logique pour prendre la commande
    console.log("Commande prise pour la table :", this.tableNumber);
  }

}
