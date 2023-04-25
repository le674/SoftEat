import { Injectable } from '@angular/core';
import { Cetape } from 'src/app/interfaces/etape';
import { Cconsommable, TConsoBase, TIngredientBase } from 'src/app/interfaces/ingredient';
import { RestaurantService } from 'src/app/services/restaurant/restaurant.service';
import { CalculService } from '../menu.calcul.ingredients/calcul.service';

@Injectable({
  providedIn: 'root'
})
export class CalculPrepaService {

  private prime_cost:number;
  constructor(private calcul_service: CalculService, private restau_service:RestaurantService) { 
    this.prime_cost = 0;
  }

  getCostMaterial(ings:Array<TIngredientBase>):Array<{nom:string, quantity:number, unity:string, cost:number,taux_tva:number, cost_matiere:number, vrac:string}>{
    let ingredients:Array<{nom:string, quantity:number, unity:string, cost:number, taux_tva:number, cost_matiere:number, vrac:string}> = [];
    ings.forEach((ing) => {
      let cost_matiere = 0;
      // on peut considérer les ingrédients sur plusieurs aspects
      // 1. un ingrédient est définie par un prix unitaire et une quantitée pour le plat dans ce cas il suffit de faire prix * quantitée plat
      // 2. un ingrédient est difinie plus précisément avec une unitée dans se cas c'est le calcul 1 qu'il faut faire
      // à priorie lorsuq eon récupère les ingrédients des factures ont tombe souvent dan le cas 1. 
      // au restaurateur de voir si il préfère modifier l'unitée p par une autre unitée.
      // dans le cas d'ingrédient en vrac il ne faut pas que le restaurateur puisse choisir p dans les unitée pour son plat/préparation pour ses ingrédients 
      // dans la partie stock si le restaurateur choisit de faire du vrac en pièce exemple : quantitée unitaire 6 tomates -> unitée p -> 9€
      // alors il vaut mieux remplir : quantitée unitaire de 1 -> unitée p -> cost 1.50 -> quantitée 6 
      cost_matiere = this.getOnlyCostMaterial(ing);
      ingredients.push({
        nom: ing.name,
        quantity: ing.quantity,
        unity: ing.unity,
        cost: ing.cost,
        taux_tva: ing.taux_tva,
        cost_matiere: cost_matiere,
        vrac: ing.vrac
      })
    })
    return ingredients
  }

  getOnlyCostMaterial(ing:TIngredientBase):number{
    let cost_matiere = 0;
    // dans un premier temps ont calcule la quantitée pas par pièce dans un seconbd temps ont pren en compte l'unitée par pièce
    if(ing.vrac === "oui"){
      cost_matiere = ing.cost/this.calcul_service.convertQuantity(ing.quantity_unity, ing.unity_unitary);
    } 
    else{
      if(ing.unity !== "p" || ((ing.unity === "p") && (ing.unity_unitary === "p"))){
        cost_matiere = this.calcul_service.convertQuantity(ing.quantity, ing.unity)*(ing.cost/this.calcul_service.convertQuantity(ing.quantity_unity, ing.unity_unitary));
      }
      else{
        cost_matiere = ing.quantity * ing.cost;
      }
    }
   
    return this.ToCentime(cost_matiere);
  }

  async getPrimCost(prop:string,restaurant:string, etapes: Array<Cetape>, ingredients: Array<TIngredientBase>,
     consommables: Array<Cconsommable> | Array<TConsoBase>){
      let sum_cost_ing = 0;
      let sum_cost_conso = 0;
      let second_salary = 0;
      let full_time = 0;
      let full_cost_quant_ing:Array<number> = [0];
      let full_cost_quant_conso:Array<number> = [0];
      if(ingredients !== null){
        if(ingredients.length > 0){
          full_cost_quant_ing = ingredients
                                .filter((ing) => (ing !== null) && (ing !== undefined))
                                .filter((ing) => (ing.cost !== undefined) && (ing.cost !== null))
                                .filter((ing) => (ing.quantity !== undefined) && (ing.quantity !== null))
                                .filter((ing) => (ing.unity !== undefined) && (ing.unity !== null))
                                .filter((ing) => (ing.quantity_unity !== undefined) && (ing.quantity_unity !== null))
                                .map((ing) => {
                                // on normalise le cout par la quantitée unitaire
                                let cost = this.getOnlyCostMaterial(ing);
                                return cost
                            })
        }
      }
      if(consommables !== null){
        if(consommables.length > 0){
          console.log(consommables);
          
          full_cost_quant_conso = consommables
                                  .filter((conso) => (conso !== null) && (conso !== undefined))
                                  .filter((conso) => (conso.cost !== null) && (conso.cost !== undefined))
                                  .filter((conso) => (conso.quantity !== null) && (conso.quantity !== undefined))
                                  .map((conso) => {
            let cost =  conso.cost*conso.quantity;
            return cost
          })
        }
      }
      if(etapes !== null){
        if(etapes.length > 0){
          const times = etapes
                       .filter((etape) => (etape !== null) && (etape !== undefined))
                       .filter((etape) => (etape.temps !== null) && (etape.temps !== undefined))
                       .map((etape) => etape.temps)
                       .filter((time) => (time !== null) && (time !== undefined));
        if(times.length > 0){
            full_time = times.reduce((curr_tmps, next_tmps) => curr_tmps + next_tmps);
          }
        }
      }
      if(full_cost_quant_ing.length > 0){
        sum_cost_ing = full_cost_quant_ing.reduce((curr_cost, next_cost) => curr_cost + next_cost);
      }
      if(full_cost_quant_conso.length > 0){
        sum_cost_conso = full_cost_quant_conso.reduce((curr_cost, next_cost) => curr_cost + next_cost)
      }
      this.prime_cost =  this.ToCentime(sum_cost_conso + sum_cost_ing);
      await this.restau_service.getSalaryCuisiniee(prop, restaurant).then((salary) => {
      // 35 nombr d'heur travaillé par semaine en fonction du nombre de semaine dans un mois
      const mensuel_work_hour = 4.34524*35;
      if((salary !== null) && (salary !== undefined)){
        second_salary = salary/(mensuel_work_hour * 3600);
      }
      else{
        console.log("veuillez entrer le salaire dans la base de donnée");
        
      }
      
      this.prime_cost = this.ToCentime(second_salary*full_time + this.prime_cost);
    });
    return this.prime_cost;
  }
  getFullTheoTimeFromSec(etapes: Array<Cetape>):string{
    if((etapes !== undefined) && (etapes !== null)){
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
    else{
      return "0h 0min 0sec"
    }
  }
  
  getFullTheoTimeSec(etapes: Array<Cetape>):number{
    if(etapes !== null){
      if(etapes.length > 0){
        let full_time_sec =  etapes.reduce((prev_etape:Cetape, suiv_etape:Cetape) => {
          const tmp_etape = new Cetape();
          tmp_etape.temps =  prev_etape.temps + suiv_etape.temps;
          return tmp_etape
        }).temps;
        return full_time_sec;
      }
      else{
        return 0;
      }
    }
    else{
      return 0
    }
  }

  // convertion des secondes en chaine de caractère
  SecToString(full_time:number){
    const heure = Math.trunc(full_time/3600);
    const min = Math.trunc(full_time%3600/60);
    const sec = full_time%60;
    return `${heure}h ${min}min ${sec}sec`
   }
   

    // convertion des secondes en chaine de caractère
  SecToArray(full_time:number){
    const heure = Math.trunc(full_time/3600);
    const min = Math.trunc(full_time%3600/60);
    const sec = full_time%60;
    return [heure, min, sec]
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
   
  // quand la quantitée finale est précise on applique le calcul normal de la valeur bouchère en revanche quand la quantitée finale 
  // est exprimé en pièce alors le coût pour une préparation
  // on néglige les préparations qui ont une quantitée inférieure à 100g car alors ont divise le quotient
  // par une puissance de 10 de sorte à avoir une valeur bouchère de l'ordre de grandeur du total des coûts 
  // des ingrédients de base.
  getValBouchFromBasIng(base: TIngredientBase[], quantity_aft_prep: number, unity_aft_prep:string): number {
    let ingredient_quantity:Array<number> = [];
    let square_final_cost = 0;
    if (base.length === 0) {
      return 0;
    }

    quantity_aft_prep = Number(quantity_aft_prep);
    const quantity_unity_act = this.calcul_service.convertQuantity(Number(quantity_aft_prep), unity_aft_prep);
    
    base.forEach((ingredient: TIngredientBase) => {
      ingredient.quantity = Number(ingredient.quantity);
      ingredient_quantity.push(this.calcul_service.convertQuantity(ingredient.quantity, ingredient.unity));
    });
    
    // on fait la somme des coûts et des quantitées des ingrédients de base utilisées pour la préparation
    const total_cost = base.map(ing => {
      let cost =  ing.cost
      ing.quantity_unity = Number(ing.quantity_unity);
      ing.quantity = Number(ing.quantity);
      // on normalise le cout par la quantitée unitaire
      cost = this.getOnlyCostMaterial(ing);
      return cost
    }).reduce((cost, next_cost) => cost + next_cost);
    // si la quantitée après préparation est trop faible alors on recalcule le diviseur
    if(quantity_unity_act * quantity_unity_act < 0.1){
      let square_quant_act = quantity_unity_act * quantity_unity_act;
      let curr = total_cost;
      while(Math.round(curr) > 0) {
        curr = curr/10;
        square_quant_act = square_quant_act * 10;
      }
      square_final_cost = square_quant_act * ingredient_quantity.reduce((ing_prev, ing) => Number(ing_prev) + Number(ing));
    }
    else{
     square_final_cost = quantity_unity_act * quantity_unity_act * ingredient_quantity.reduce((ing_prev, ing) => Number(ing_prev) + Number(ing));
    }
    if (square_final_cost !== 0) {
      return this.ToCentime(total_cost / square_final_cost);
    }
    else {
      return 0
    }
  }
  

  getTotCost(ingredients:Array<TIngredientBase>):number{
    let cost = 0
    if(ingredients !== null){
      cost = ingredients.map((ing) => {
        if(ing !== null){
          return ing.cost
        }
        else{
          return 0
      }}).reduce((prev_cost, next_cost) => prev_cost + next_cost);
    }
    return cost
  }

  ToCentime(quantity:number):number{
    return Math.round(quantity*100)/100;
  }
}
