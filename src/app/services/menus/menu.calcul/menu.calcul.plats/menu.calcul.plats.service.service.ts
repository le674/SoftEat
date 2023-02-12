import { Injectable } from '@angular/core';
import { TIngredientBase } from 'src/app/interfaces/ingredient';
import { Cplat } from 'src/app/interfaces/plat';
import { Cpreparation } from 'src/app/interfaces/preparation';
import { CalculPrepaService } from '../menu.calcul.preparation/calcul.prepa.service';

@Injectable({
  providedIn: 'root'
})
export class MenuCalculPlatsServiceService {

  constructor(private prepa_service:CalculPrepaService) { }

  getPrimCost(prop:string, restaurant:string,plat:Cplat):Promise<number>{
    let ingredients = plat.ingredients;
    let consommables = plat.consommables;
    let etapes = plat.etapes;
    const prepa_etapes = plat.preparations.map((preparation) => preparation.etapes).flat();
    const prepa_consommables = plat.preparations.map((preparation) => preparation.consommables).flat();
    const prepa_ingredients = plat.preparations.map((preparation) => preparation.base_ing.map((ing) => {
      let ingredient:TIngredientBase = {
        name:ing.name,
        quantity:ing.quantity,
        quantity_unity:ing.quantity_unity,
        unity:ing.unity,
        cost:ing.cost,
        vrac:ing.vrac,
        material_cost:0,
        taux_tva:0,
        marge:0
      }
      return ingredient
    })).flat();
    etapes = etapes.concat(prepa_etapes);
    ingredients = ingredients.concat(prepa_ingredients);
    consommables = consommables.concat(prepa_consommables);
    return this.prepa_service.getPrimCost(prop, restaurant, etapes, ingredients, consommables)
  }

  getFullTheoTimeFromSec(plat:Cplat):string{
   const sum_time_plat = this.prepa_service.getFullTheoTimeSec(plat.etapes)
   const sum_time_prepa = plat.preparations.map((preparation) => preparation.etapes
                                          .map((etape) => etape.temps)
                                          .reduce((prev_tmps, next_tmps) =>  prev_tmps + next_tmps))
                                          .reduce((prev_prep_time, next_prep_time) => prev_prep_time + next_prep_time);
   
   const full_time =  sum_time_plat + sum_time_prepa;
   const heure = Math.trunc(full_time/3600);
   const min = Math.trunc(full_time%3600/60);
   const sec = full_time%60;
   return `${heure}h ${min}min ${sec}sec`
  }

  getPortionCost(plat:Cplat):number{
    let ingredients = plat.ingredients;
    const prepa_ingredients = plat.preparations.map((preparation) => preparation.base_ing.map((ing) => {
      let ingredient:TIngredientBase = {
        name:ing.name,
        quantity:ing.quantity,
        quantity_unity:ing.quantity_unity,
        unity:ing.unity,
        cost:ing.cost,
        vrac:ing.vrac,
        material_cost:0,
        taux_tva:0,
        marge:0
      }
      return ingredient
    })).flat();
    ingredients = ingredients.concat(prepa_ingredients);
    const full_material_cost = this.prepa_service.getCostMaterial(ingredients).map((ingredient) => ingredient.cost_matiere);
    const portion_cost = full_material_cost.reduce((prev, next) => prev + next)/plat.portions;
    return this.ToCentime(portion_cost);
  }

  getRatioMaterial(portion_cost:number,plat:Cplat){
    const price_ht = plat.prix;
    return(this.ToCentime(portion_cost/price_ht)*100)
  }

  ToCentime(quantity:number):number{
    return Math.round(quantity*100)/100;
  }
}
