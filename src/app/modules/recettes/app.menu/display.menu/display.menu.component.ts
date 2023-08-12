import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cmenu } from '../../../../../app/interfaces/menu';
import { CalculService } from '../../../../../app/services/menus/menu.calcul/menu.calcul.ingredients/calcul.service';
import { MenuCalculMenuService } from '../../../../../app/services/menus/menu.calcul/menu.calcul.menu.service';
import { Cplat } from 'src/app/interfaces/plat';

@Component({
  selector: 'app-display.menu',
  templateUrl: './display.menu.component.html',
  styleUrls: ['./display.menu.component.css']
})
export class DisplayMenuComponent implements OnInit {

  public menu:Cmenu;
  public taux_tva:number | null = null;
  public prix_ttc:number | null = null;
  public desserts:Array<string>;
  public plats:Array<string>;
  public entrees:Array<string>;
  public autres:Array<string> = [];
  public price_reco: number;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    prop: string,
    restaurant: string,
    plats: Array<Cplat>,
    menu:Cmenu
  }, public dialogRef: MatDialogRef<DisplayMenuComponent>,
   private menu_service:MenuCalculMenuService,private calcul_service:CalculService) {
    this.desserts = [];
    this.plats = [];
    this.entrees = [];
    this.autres = [];
    if(this.data.menu.taux_tva !== null){
      this.taux_tva = Math.round(this.data.menu.taux_tva*100)/100; 
    }
    if(this.data.menu.cost_ttc !== null){
      this.prix_ttc = Math.round(this.data.menu.cost_ttc*100)/100; 
    }
    this.menu = this.data.menu;
    this.price_reco = 0;
  }

  ngOnInit(): void {
    if(this.data.menu.ingredients !== null){
      this.autres = this.data.menu.ingredients.map((ingredient) => ingredient.name);
    }
    if(this.data.menu.plats !== null){
      this.data.menu.plats.forEach((plat) => {
        let _plat  = this.data.plats.find((_plat) => _plat.id === plat.id);
        if(_plat !== undefined){
          if(_plat.type === "dessert"){
            this.desserts.push(plat.name);
          }
          if(_plat.type === "plat"){
            this.plats.push(plat.name)
          }
          if(_plat.type === "entree"){
            this.entrees.push(plat.name)
          }
          if(_plat.type === "boissons"){
            this.autres.push(plat.name);
          }
        }
      })
    }
    this.price_reco = this.menu_service.getPriceMenuReco(this.data.menu.plats, this.data.plats);
  }
  closePopup($event: MouseEvent) {
    this.dialogRef.close();
  }
}
