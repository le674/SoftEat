import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CIngredient, CingredientModif, Ingredient } from 'src/app/interfaces/ingredient';

@Component({
  selector: 'app-stock',
  templateUrl: './app.stock.component.html',
  styleUrls: ['./app.stock.component.css']
})
export class AppStockComponent implements OnInit {

  public displayedColumns: string[] = ['name', 'categorie_restaurant', 'categorie_tva', 'cost', 'cost_ttc', 'val_bouch', 'quantity', 'dlc'];
  public ingredient_table: Array<Ingredient>;
  public dataSource: MatTableDataSource<Ingredient>;
  constructor() { 
    this.ingredient_table = [];
    this.dataSource = new MatTableDataSource(this.ingredient_table)
  }

  ngOnInit(): void {
    
  }

}
