import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cmenu } from 'src/app/interfaces/menu';

@Component({
  selector: 'app-display.menu',
  templateUrl: './display.menu.component.html',
  styleUrls: ['./display.menu.component.css']
})
export class DisplayMenuComponent implements OnInit {

  public menu:Cmenu;
  public taux_tva:number;
  public prix_ttc:number;
  public desserts:Array<string>;
  public plats:Array<string>;
  public entrees:Array<string>;
  public autres:Array<string>;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    prop: string,
    restaurant: string,
    name: string,
    menu:Cmenu
  }) {
    this.desserts = [];
    this.plats = [];
    this.entrees = [];
    this.autres = [];
    this.taux_tva = Math.round(this.data.menu.taux_tva*100)/100; 
    this.prix_ttc = Math.round(this.data.menu.prix_ttc*100)/100; 
    this.menu = this.data.menu;
  }

  ngOnInit(): void {
    console.log(this.data.menu);
    this.autres = this.data.menu.ingredients.map((ingredient) => ingredient.name.split('_').join(' '));
    this.data.menu.plats.forEach((plat) => {
      if(plat.type === "dessert"){
        this.desserts.push(plat.nom.split('_').join(' '));
      }
      if(plat.type === "plat"){
        this.plats.push(plat.nom.split('_').join(' '))
      }
      if(plat.type === "entree"){
        this.entrees.push(plat.nom.split('_').join(' '))
      }
      if(plat.type === "boissons"){
        this.autres.push(plat.nom.split('_').join(' '));
      }
    })
  }

}
