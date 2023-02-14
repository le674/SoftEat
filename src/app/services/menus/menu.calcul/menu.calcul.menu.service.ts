import { Injectable } from '@angular/core';
import { Cmenu } from 'src/app/interfaces/menu';

@Injectable({
  providedIn: 'root'
})
export class MenuCalculMenuService {

  constructor() { }

  getTauxTvaVentilee(menu:Cmenu){
    const taux_plats = menu.plats.map((plat) => plat.prix*(plat.taux_tva/100));
    const price_sum_plat = menu.plats.map((plat) => plat.prix).reduce((prev_price,next_price) => prev_price + next_price);
    const taux_ings = menu.ingredients.map((ingredient) => {
      if(ingredient.vrac === 'oui'){
        return  ingredient.cost*(ingredient.taux_tva/100);
      }
      else{
        return ingredient.quantity* ingredient.cost*(ingredient.taux_tva/100);
      }
    });
    const price_sum_ing =  menu.ingredients.map((ingredient) => {
      if(ingredient.vrac === 'oui'){ 
        return  ingredient.cost
      }
      else{
        return ingredient.cost*ingredient.quantity;
      }
    }).reduce((prev_price,next_price) => prev_price + next_price);
    const price_sum = price_sum_ing + price_sum_plat;
    const taux_tot = taux_plats.concat(taux_ings).reduce((prev_taux, next_taux) => prev_taux + next_taux);
    return (Math.round((taux_tot/price_sum)*10000)/10000)*100
  }


  getPriceTTC(price_ht:number,taux:number){
    return price_ht + price_ht*(taux/100);
  }
}
