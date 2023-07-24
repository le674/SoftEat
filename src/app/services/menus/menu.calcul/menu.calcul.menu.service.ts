import { Injectable } from '@angular/core';
import { Cmenu } from '../../../../app/interfaces/menu';
import { CbasePlat, Cplat, Plat } from '../../../../app/interfaces/plat';
import { CalculService } from './menu.calcul.ingredients/calcul.service';
import { MenuCalculPlatsServiceService } from './menu.calcul.plats/menu.calcul.plats.service.service';
import { CIngredient } from 'src/app/interfaces/ingredient';

@Injectable({
  providedIn: 'root'
})
export class MenuCalculMenuService {

  constructor(private plat_service:MenuCalculPlatsServiceService, private calcul_service:CalculService) { }

  /**
   * permet de ventiler la tva pour un menu
   * @param menu menu pour lequel nous voulons calculer le taux de tva ventilée
   * @param ingredients ensemble des ingrédients de l'inventaire
   * @param plats ensemble des plats de l'inventaire
   * @returns {number} taux de tva ventilée
  */
  getTauxTvaVentilee(menu:Cmenu, ingredients:Array<CIngredient>, plats:Array<Cplat>){
    let price_sum_plat = 0;
    let price_sum_ing = 0;
    const base_plats = menu.plats;
    const base_ings =  menu.ingredients;
    let price_sum_plat_lst:Array<number> = [];
    let price_sum_ing_lst:Array<number> = [];
    let taux_plats:Array<number> = [];
    let taux_ings:Array<number> = [];
    let taux_tot:number = 0;
    if(base_plats !== null){
      let _plats =  plats.flatMap((plat) => {
        let _plat =  base_plats.find((_plat) => _plat.id ===  plat.id);
        if(_plat !== undefined){
          if(_plat.portions !== null) plat.portions = _plat.portions;
          if(_plat.unity !== null) plat.unity = _plat.unity;
          return [plat];
        }
        return [];
      });
      taux_plats = _plats.filter((plat) => (plat.cost !== undefined) && (plat.cost !== null))
                                   .map((plat) => {
                                    if(plat.taux_tva !== null){
                                      return plat.cost*(plat.taux_tva/100);
                                    }
                                    else{
                                      return plat.cost;
                                    }
                                   });
      price_sum_plat_lst = _plats.filter((plat) => (plat.cost !== undefined) && (plat.cost !== null))
                                           .map((plat) => plat.cost)
    }
    if(price_sum_plat_lst.length > 0){
      price_sum_plat = price_sum_plat_lst.reduce((prev_price,next_price) => prev_price + next_price);
    }
    if(base_ings !== null){
      taux_ings = base_ings.map((ingredient) => {
        const _ingredient = ingredients.find((t_ingredient) => {
          if(ingredient.id !== null){
            return ingredient.id.includes(t_ingredient.id);
          }
          else{
            return false;
          }
        });
        if(_ingredient !== undefined){
          if(_ingredient.vrac === 'oui' && (_ingredient.taux_tva !== null)){
            return  _ingredient.cost*(_ingredient.taux_tva/100);
          }
          else{
            if((ingredient.quantity !== null) && (_ingredient.taux_tva !== null)){
              return ingredient.quantity*_ingredient.cost*(_ingredient.taux_tva/100);
            }
          }
        }
        return 0
      });
      price_sum_ing_lst = ingredients
      .filter((ingredient) => base_ings.flatMap((_ingredient) => _ingredient.id).includes(ingredient.id))
      .map((ingredient) => {
        if(ingredient.vrac === 'oui'){ 
          return  ingredient.cost
        }
        else{
          if(ingredient.quantity !== null) return ingredient.cost*ingredient.quantity;
        }
        return 0;
      }); 
    }
    if(price_sum_ing_lst.length > 0){
     price_sum_ing = price_sum_ing_lst.reduce((prev_price,next_price) => prev_price + next_price);
    }
    const price_sum = price_sum_ing + price_sum_plat;
    if(taux_ings.length > 0 || taux_plats.length > 0){
      taux_tot = taux_plats.concat(taux_ings).reduce((prev_taux, next_taux) => prev_taux + next_taux);
    }
    return (Math.round((taux_tot/price_sum)*10000)/10000)*100
  }

  // pour le prix de la recommandation su menu on applique une réduction de 5 à 10 % naivement dans notre cas ont prend une réduciton de 
  // 7.5%
  /**
   * permet de récupérer une recommandation pour le prix du menu
   * @param base_plats plat de base du menu
   * @param plats liste des plats du restauraant
   * @returns prix recommandé pour le menu
  */
  getPriceMenuReco(base_plats:CbasePlat[] | null, plats:Cplat[]): number {
    if(base_plats !== null){
      let _plats =  plats.flatMap((plat) => {
        let _plat =  base_plats.find((_plat) => _plat.id ===  plat.id);
        if(_plat !== undefined){
          if(_plat.portions !== null) plat.portions = _plat.portions;
          if(_plat.unity !== null) plat.unity = _plat.unity;
          return [plat];
        }
        return [];
      });
      const all_plats = base_plats.length;
      let arr_reco = _plats
                      .filter((plat) => (plat.cost !== undefined))
                      .map((plat) => this.calcul_service.getCostTtcFromTaux(plat.taux_tva,plat.cost));
      arr_reco = arr_reco.filter((cost_reco) => cost_reco !== null);
      if(all_plats > 0){
        const moy_price = (arr_reco as number[]).reduce((prev_num, next_num) => prev_num + next_num)/all_plats;
        return this.plat_service.ToCentime(moy_price - moy_price*0.075)
      }
    }
    return 0;
  }
 /**
  * permet a partir d'un cout et du taux de tva de retourner un cout toute taxe comprisent
  * @param cost_ht cout hors taxe du  menu
  * @param taux taux a appliquer au menu
  * @returns cout toute taxes comprisent 
 */
  getPriceTTC(cost_ht:number,taux:number){
    return cost_ht + cost_ht*(taux/100);
  }
}
