import { Injectable } from '@angular/core';
import { Cetape } from '../../../../../app/interfaces/etape';
import { Cconsommable, TIngredientBase } from '../../../../../app/interfaces/ingredient';
import { Cplat } from '../../../../../app/interfaces/plat';
import { CalculPrepaService } from '../menu.calcul.preparation/calcul.prepa.service';

@Injectable({
  providedIn: 'root'
})
export class MenuCalculPlatsServiceService {

  constructor(private prepa_service:CalculPrepaService) { }

  getPrimCost(prop:string, restaurant:string,plat:Cplat):Promise<number>{
    let arr_ings:Array<TIngredientBase> = [];
    let consommables:Array<Cconsommable> = [];
    let etapes:Array<Cetape> = [];
    let prepa_etapes:Array<Cetape> = [];
    let prepa_consommables:Array<Cconsommable> = [];
    let prepa_ingredients:Array<TIngredientBase> = [];
    if(plat.ingredients !== null) arr_ings = plat.ingredients;
    if(plat.consommables !== null) consommables = plat.consommables;
    if(etapes !== null) etapes = plat.etapes;
    if(plat.preparations !== null){
      prepa_etapes = plat.preparations.map((preparation) => {
        if(preparation.etapes !== undefined){
          return preparation.etapes
        }
        else{
          return [];
        }
      }).flat();
      prepa_consommables = plat.preparations.map((preparation) => {
        if(preparation.consommables !== undefined){
          return  preparation.consommables
        }
        else{
          return [];
        }
      }).flat();
      prepa_ingredients = plat.preparations
                          .filter((preparation) => preparation.base_ing !== undefined)
                          .map((preparation) => preparation.base_ing.map((ing) => {
        let ingredient:TIngredientBase = {
          name:ing.name,
          quantity:ing.quantity,
          quantity_unity:ing.quantity_unity,
          unity:ing.unity,
          unity_unitary: ing.unity_unitary,
          cost:ing.cost,
          vrac:ing.vrac,
          material_cost:0,
          taux_tva:0,
          marge:0
        }
        return ingredient
      })).flat();
    }
    if((etapes) && (prepa_etapes !== null)){
      etapes = etapes.concat(prepa_etapes);
    }
    if((arr_ings !== null) && (prepa_ingredients !== null)){
      arr_ings = arr_ings.concat(prepa_ingredients);
    }
    if((consommables !== null) && (prepa_consommables !== null)){
      consommables = consommables.concat(prepa_consommables);
    }
    return this.prepa_service.getPrimCost(prop, restaurant, etapes, arr_ings, consommables)
  }

  getFullTheoTimeFromSec(plat:Cplat):string{
    let sum_time_prepa  = 0
   const sum_time_plat = this.prepa_service.getFullTheoTimeSec(plat.etapes)
   if(plat.preparations !== null){
    sum_time_prepa = plat.preparations.map((preparation) => {
      if((preparation.etapes !== null) && (preparation.etapes !== undefined)){
        let etapes = preparation.etapes.filter((etape) => (etape !== null) && (etape !== undefined));
        if(etapes.length > 0){
          return preparation.etapes.map((etape) => etape.temps)
          .reduce((prev_tmps, next_tmps) =>  prev_tmps + next_tmps);
        }
        else{
          return 0;
        }
      }
      else{
        return 0;
      }
    }).reduce((prev_prep_time, next_prep_time) => prev_prep_time + next_prep_time);
   }
   const full_time =  sum_time_plat + sum_time_prepa;
   const heure = Math.trunc(full_time/3600);
   const min = Math.trunc(full_time%3600/60);
   const sec = full_time%60;
   return `${heure}h ${min}min ${sec}sec`
  }

  getFullTheoTimeToSec(plat:Cplat):number{
    let sum_time_prepa  = 0
    let sum_time_plat = 0;
    if((plat.etapes !== undefined) &&(plat.etapes !== null)){
      sum_time_plat = this.prepa_service.getFullTheoTimeSec(plat.etapes);
    }
    if(plat.preparations !== null){
     const preparations = plat.preparations.filter((prepa) => (prepa !== undefined) && (prepa !== null))
     if(preparations.length > 0){
      sum_time_prepa = preparations
      .map((preparation) => {
          if(preparation.etapes !== null){
            const etapes = preparation.etapes.filter((prepa) => (prepa !== undefined) && (prepa !== null));
            if(etapes.length > 0){
              const time_etapes = etapes.map((etape) => etape.temps)
              if(time_etapes !== null){
                time_etapes.filter((temps) => (temps !== null) && (temps !== undefined))
                if(time_etapes.length > 0){
                  return time_etapes.reduce((prev_tmps, next_tmps) =>  prev_tmps + next_tmps)
                }
              }
            }
          }
          return 0
        }
      ).reduce((prev_prep_time, next_prep_time) => prev_prep_time + next_prep_time);
     }
    }
    const full_time =  sum_time_plat + sum_time_prepa;
    return full_time;
  }


  // convertion des secondes en chaine de caractère
  SecToString(full_time:number){
   const heure = Math.trunc(full_time/3600);
   const min = Math.trunc(full_time%3600/60);
   const sec = full_time%60;
   return `${heure}h ${min}min ${sec}sec`
  }
  
  // convertion de l'heure en seconde 
  StringToSec(time_str:string){
    let hour = 0;
    let minute = 0;
    let sec = 0;

    let hours = time_str.match(/[0-9]+h/);
    let minutes = time_str.match(/[0-9]+min/);
    let seconds = time_str.match(/[0-9]+sec/);

    if((hours !== null) && (minutes !== null) && (seconds !== null)){
      hour = Number(hours[0].replace('h',''))*60*60;
      minute = Number(minutes[0].replace('min',''))*60;
      sec = Number(seconds[0].replace('sec', ''));
    }
    return hour + minute + sec;
  }

  getPortionCost(plat:Cplat):number{
    let arr_ingredients: TIngredientBase[] = [];
    let prepa_ingredients:TIngredientBase[] = [];
    if(plat !== null){
      if(plat.ingredients !== null){
        plat.ingredients.forEach((ingredient) => arr_ingredients.push(ingredient))
      }
      if(plat.preparations !== null){
        prepa_ingredients = plat.preparations
                            .filter((prep) => (prep.base_ing !== null) && (prep.base_ing !== undefined))
                            .map((preparation) => preparation.base_ing.map((ing) => {
          let ingredient:TIngredientBase = {
            name:ing.name,
            quantity:ing.quantity,
            quantity_unity:ing.quantity_unity,
            unity:ing.unity,
            unity_unitary: ing.unity_unitary,
            cost:ing.cost,
            vrac:ing.vrac,
            material_cost:0,
            taux_tva:0,
            marge:0
          }
          return ingredient
        })).flat();
      }

      arr_ingredients = arr_ingredients.concat(prepa_ingredients);
      if(arr_ingredients.length > 0){
        const full_material_cost = this.prepa_service.getCostMaterial(arr_ingredients).map((ingredient) => ingredient.cost_matiere);
        const portion_cost = full_material_cost.reduce((prev, next) => prev + next)/plat.portions;
        return this.ToCentime(portion_cost);
      }
      return 0;
    }
    else {
      return 0;
    }
  }

  getRatioMaterial(portion_cost:number,plat:Cplat){
    const price_ht = plat.prix;
    return(Math.round(this.ToCentime(portion_cost/price_ht)*100))
  }

  // ont utilise la liste [5,4,3,2.5] qui sont les coefficient multiplicateur pour l'établissement du prix des plats
  platsRecommendationStep1(portion_cost:number):number{
    const coeff = this.listCoeffTarif()
    if(portion_cost <= 2){
      return portion_cost * coeff.fourth_tarif_coeff
    }
    if((portion_cost > 2) && (portion_cost <= 3)){
      return portion_cost * coeff.third_tarif_coeff
    } 
    if((portion_cost > 3) && (portion_cost <= 4)){
      return portion_cost * coeff.sec_tarif_coeff
    } 
    if(portion_cost > 4){
      return portion_cost * coeff.fst_tarif_coeff
    }
    return 0
  }

  listCoeffTarif(){
    return {fst_tarif_coeff: 2.5, sec_tarif_coeff: 3, third_tarif_coeff:4, fourth_tarif_coeff:5}
  }

  ToCentime(quantity:number):number{
    return Math.round(quantity*100)/100;
  }
}
