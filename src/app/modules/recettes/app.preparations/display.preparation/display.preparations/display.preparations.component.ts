import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Cetape } from 'src/app/interfaces/etape';
import { Consommable, TIngredientBase } from 'src/app/interfaces/ingredient';
import { IngredientsInteractionService } from 'src/app/services/menus/ingredients-interaction.service';

@Component({
  selector: 'app-display.preparations',
  templateUrl: './display.preparations.component.html',
  styleUrls: ['./display.preparations.component.css']
})
export class DisplayPreparationsComponent implements OnInit {
  public displayedColumnsIng: string[] = ['nom', 'quantity', 'unity', 'cost', 'cost_matiere'];
  public displayedColumnsConso: string[] = ['nom', 'quantity', 'unity', 'cost'];
  public displayedColumnsEtape: string[] = ['nom', 'temps', 'commentaire'];
  public dataSource_ing: MatTableDataSource<{
    nom: string;
    quantity: number;
    unity: string,
    cost: number;
    cost_matiere: number;
  }>;

  public dataSource_conso: MatTableDataSource<{
    nom: string;
    cost: number;
    quantity: number;
    unity: string,
  }>;

  public dataSource_etape: MatTableDataSource<{
    nom: string;
    temps: Date;
    commentaire: string;
  }>;

  public displayed_ing: Array<{
    nom: string;
    quantity: number;
    unity: string,
    cost: number;
    cost_matiere: number;
  }>;

  public displayed_conso: Array<{
    nom: string;
    cost: number;
    quantity: number;
    unity: string;
  }>;

  public displayed_etape: Array<{
    nom: string;
    temps: Date;
    commentaire: string;
  }>;
  @ViewChild('paginatoring') paginatoring!: MatPaginator;
  @ViewChild('paginatorconso') paginatorconso!: MatPaginator;
  @ViewChild('paginatoretape') paginatoretape!: MatPaginator;

  constructor(public dialogRef: MatDialogRef<DisplayPreparationsComponent>, @Inject(MAT_DIALOG_DATA) public data: {
    prop: string,
    restaurant: string,
    name: string,
    ingredients: Array<TIngredientBase>,
    consommables: Array<Consommable>,
    etapes: Array<Cetape>
  }, private ingredient_service: IngredientsInteractionService) { 
    this.displayed_ing = [];
    this.displayed_conso = [];
    this.displayed_etape = [];
    this.dataSource_ing = new MatTableDataSource(this.displayed_ing);
    this.dataSource_conso = new MatTableDataSource(this.displayed_conso);
    this.dataSource_etape = new MatTableDataSource(this.displayed_etape);
  }

  ngOnInit(): void {
  }
  
  pageChangedEtape(event:PageEvent){
    console.log(event);
    
  }

  pageChangedConso(event:PageEvent){
    console.log(event);
    
  }

  pageChangedInv(event:PageEvent){
    console.log(event);
    
  }
}
