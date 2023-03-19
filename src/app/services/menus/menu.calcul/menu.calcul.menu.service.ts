import { Injectable } from '@angular/core';
import { Cmenu } from 'src/app/interfaces/menu';
import { Plat } from 'src/app/interfaces/plat';
import { CalculService } from './menu.calcul.ingredients/calcul.service';
import { MenuCalculPlatsServiceService } from './menu.calcul.plats/menu.calcul.plats.service.service';

@Injectable({
  providedIn: 'root'
})
export class MenuCalculMenuService {

  constructor(private plat_service:MenuCalculPlatsServiceService, private calcul_service:CalculService) { }

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

  // pour le prix de la recommandation su menu on applique une réduction de 5 à 10 % naivement dans notre cas ont prend une réduciton de 
  // 7.5%
  getPriceMenuReco(plats: Plat[]): number {
    const all_plats = plats.length;
    const arr_reco = plats
                    .filter((plat) => (plat.prix !== undefined))
                    .map((plat) => this.calcul_service.getCostTtcFromTaux(plat.taux_tva,plat.prix));
    if(all_plats > 0){
      const moy_price = arr_reco.reduce((prev_num, next_num) => prev_num + next_num)/all_plats;
      return this.plat_service.ToCentime(moy_price - moy_price*0.075)
    }
    return 0;
  }

  getPriceTTC(price_ht:number,taux:number){
    return price_ht + price_ht*(taux/100);
  }
}
