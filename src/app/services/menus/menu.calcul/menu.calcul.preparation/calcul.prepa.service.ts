import { Injectable } from '@angular/core';
import { Cetape } from 'src/app/interfaces/etape';
import { Cconsommable, CIngredient, TIngredientBase } from 'src/app/interfaces/ingredient';
import { Cpreparation } from 'src/app/interfaces/preparation';
import { CalculService } from '../menu.calcul.ingredients/calcul.service';

@Injectable({
  providedIn: 'root'
})
export class CalculPrepaService {

  constructor(private calcul_service: CalculService) { }

  getCostMaterial(ings:Array<TIngredientBase>):Array<{nom:string, quantity:number, unity:string, cost:number, cost_matiere:number}>{
    let ingredients:Array<{nom:string, quantity:number, unity:string, cost:number, cost_matiere:number}> = [];
    ings.forEach((ing) => {
      let cost_matiere = ing.cost
      if(!(ing.vrac === 'oui')){
        cost_matiere = this.calcul_service.convertQuantity(ing.quantity, ing.unity)*ing.cost;
      }
      ingredients.push({
        nom: ing.name,
        quantity: ing.quantity,
        unity: ing.unity,
        cost: ing.cost,
        cost_matiere: cost_matiere
      })
    })
    return ingredients
  }

  getPrimCost(etapes: Array<Cetape>, ingredients: Array<TIngredientBase>, consommables: Array<Cconsommable>, salary:number){
    let cost:number;
    const full_time = etapes.map((etape) => etape.temps).
                                                        reduce((curr_tmps, next_tmps) => curr_tmps + next_tmps);
    const full_conso_cost = consommables.map((consommable) => consommable.cost).
                                                        reduce((curr_cost, next_cost) => curr_cost + next_cost);
    const full_conso_quantity = consommables.map((consommable) => this.calcul_service.convertQuantity(consommable.quantity, consommable.unity)).
                                                        reduce((curr_quant, next_quant) => curr_quant + next_quant);
    const full_ing_cost = ingredients.map((ing) => ing.cost).
                                                        reduce((curr_cost, next_cost) => curr_cost + next_cost);
    const full_ing_quant = ingredients.map((ing) => this.calcul_service.convertQuantity(ing.quantity, ing.unity)).
                                                        reduce((curr_quant, next_quant) => curr_quant + next_quant);
    // 35 nombr d'heur travaillé par semaine en fonction du nombre de semaine dans un mois
    const mensuel_work_hour = 4.34524*35;
    const second_salary = salary/(mensuel_work_hour * 3600);

    return second_salary*full_time + full_conso_cost*full_conso_quantity + full_ing_cost*full_ing_quant;

  }

  getFullTheoTimeFromSec(etapes: Array<Cetape>):string{
    let full_time_sec =  etapes.reduce((prev_etape:Cetape, suiv_etape:Cetape) => {
      const tmp_etape = new Cetape();
      tmp_etape.temps =  prev_etape.temps + suiv_etape.temps;
      return tmp_etape
    }).temps;
    
    const heure = Math.trunc(full_time_sec/3600);
    const min = Math.trunc(full_time_sec%3600/60);
    const sec = full_time_sec%60;
    return `${heure}h ${min}min ${sec}sec`
  }

  getValBouchFromBasIng(base: TIngredientBase[], quantity_aft_prep: number, unity_aft_prep:string): number {

  
    if (base.length === 0) {
      return 0;
    }
    const quantity_unity_act = this.calcul_service.convertQuantity(quantity_aft_prep, unity_aft_prep);
    base.forEach((ingredient: TIngredientBase) => {
     ingredient.quantity = this.calcul_service.convertQuantity(ingredient.quantity, ingredient.unity);
    })
    // on fait la somme des coûts et des quantitées des ingrédients de base utilisées pour la préparation
    const moy_cost = base.map(ing => ing.cost).reduce((cost, next_cost) => cost + next_cost) / base.length;
    const moy_quantity = base
      .map(ing => ing.quantity)
      .reduce((quantity, next_quantity) => Number(quantity) + Number(next_quantity)) / base.length;
    const moy_total_cost = moy_cost * moy_quantity;
    const square_final_cost = quantity_unity_act * quantity_unity_act;
    if (square_final_cost !== 0) {
      return moy_total_cost / square_final_cost;
    }
    else {
      return 0
    }
  }
  
}
