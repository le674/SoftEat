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

  getPrimCost(etapes: Array<Cetape>, ingredients: Array<CIngredient>, consommables: Array<Cconsommable>){
    
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

  getValBouchFromBasIng(base: CIngredient[], ingredient_act: Cpreparation): number {

    if (base.length === 0) {
      return 0;
    }
    // comme les objet son passez par réferance on fait une "deep copy"
    let tmp_base_ing = JSON.parse(JSON.stringify(ingredient_act.base_ing));
    const quantity_unity_act = this.calcul_service.convertQuantity(ingredient_act.quantity_unity, ingredient_act.unity);
    base.forEach((ingredient: CIngredient, index: number) => {
      const obj_ele = ingredient_act.base_ing.filter((ing) => ing.name === ingredient.nom)[0];
      obj_ele.quantity = this.calcul_service.convertQuantity(obj_ele.quantity, ingredient.unity);
    })
    // on renvoie 0 pour signifier que des ingrédient de base pour la préparation n'on pas été ajouté en base de donnée
    if (base.length < ingredient_act.base_ing.length) {
      ingredient_act.base_ing = tmp_base_ing;
      return 0;
    }
    // on fait la somme des coûts et des quantitées des ingrédients de base utilisées pour la préparation
    const moy_cost = base.map(ing => ing.cost).reduce((cost, next_cost) => cost + next_cost) / base.length;
    const moy_quantity = ingredient_act.base_ing
      .map(ing => ing.quantity)
      .reduce((quantity, next_quantity) => Number(quantity) + Number(next_quantity)) / ingredient_act.base_ing.length;
    const moy_total_cost = moy_cost * moy_quantity;
    const square_final_cost = quantity_unity_act * quantity_unity_act;
    ingredient_act.base_ing = tmp_base_ing;
    if (square_final_cost !== 0) {
      return moy_total_cost / square_final_cost;
    }
    else {
      return 0
    }
  }
  
}
