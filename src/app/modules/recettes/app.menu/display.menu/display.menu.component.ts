import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cmenu } from 'src/app/interfaces/menu';
import { CalculService } from 'src/app/services/menus/menu.calcul/menu.calcul.ingredients/calcul.service';
import { MenuCalculMenuService } from 'src/app/services/menus/menu.calcul/menu.calcul.menu.service';
import { MenuCalculPlatsServiceService } from 'src/app/services/menus/menu.calcul/menu.calcul.plats/menu.calcul.plats.service.service';

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
  public price_reco: number;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    prop: string,
    restaurant: string,
    name: string,
    menu:Cmenu
  }, public dialogRef: MatDialogRef<DisplayMenuComponent>,
   private menu_service:MenuCalculMenuService,private calcul_service:CalculService) {
    this.desserts = [];
    this.plats = [];
    this.entrees = [];
    this.autres = [];
    this.taux_tva = Math.round(this.data.menu.taux_tva*100)/100; 
    this.prix_ttc = Math.round(this.data.menu.prix_ttc*100)/100; 
    this.menu = this.data.menu;
    this.price_reco = 0;
  }

  ngOnInit(): void {
    
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
    this.price_reco = this.menu_service.getPriceMenuReco(this.data.menu.plats);
  }
  closePopup($event: MouseEvent) {
    this.dialogRef.close();
  }
}
