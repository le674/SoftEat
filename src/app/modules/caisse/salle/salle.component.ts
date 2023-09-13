import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ctable } from 'src/app/interfaces/table';

import { Router, UrlTree } from '@angular/router';
import { Unsubscribe } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';

interface Table {
  number: number;
  seats: number;
}

@Component({
  selector: 'app-salle',
  templateUrl: './salle.component.html',
  styleUrls: ['./salle.component.css']
})
export class SalleComponent  implements OnInit,OnDestroy{
  public tables:Array<Ctable>;
  private path_to_tables: Array<string>;
  private prop: string;
  private restaurant: string;
  private req_tables_brt!:Unsubscribe;
  private ables_brt_sub!:Subscription;
  private url: UrlTree;
  constructor(private firestore: FirebaseService, private router: Router) {
    this.prop = "";
    this.restaurant = "";
    this.path_to_tables = [];
    this.tables = [];
    this.url = this.router.parseUrl(this.router.url);
  }
  ngOnDestroy(): void {
    if(this.req_tables_brt){
      this.req_tables_brt();
    }
    if(this.ables_brt_sub){
      this.ables_brt_sub.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.prop = this.url.queryParams["prop"];
    this.restaurant = this.url.queryParams["restaurant"];
    this.path_to_tables = Ctable.getPathsToFirestore(this.prop, this.restaurant);
    this.req_tables_brt = this.firestore.getFromFirestoreBDD(this.path_to_tables, Ctable, null);
    this.ables_brt_sub   = this.firestore.getFromFirestore().subscribe((tables) => { 
      this.tables = tables as Array<Ctable>;
    })
  }
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
