import { Injectable } from '@angular/core';
import { Cetape } from '../../../../../app/interfaces/etape';
import { CIngredient, TIngredientBase } from '../../../../../app/interfaces/ingredient';
import { RestaurantService } from '../../../../../app/services/restaurant/restaurant.service';
import { CalculService } from '../menu.calcul.ingredients/calcul.service';
import { Cconsommable, TConsoBase } from 'src/app/interfaces/consommable';
import { MiniConsommable } from 'src/app/interfaces/recette';

@Injectable({
  providedIn: 'root'
})
export class CalculPrepaService {
  private prime_cost: number;
  constructor(private calcul_service: CalculService, private restau_service: RestaurantService) {
    this.prime_cost = 0;
  }

  getCostMaterial(ingredients: Array<CIngredient>, _ingredients: Array<TIngredientBase>): Array<CIngredient> {
    let ingredient_return: Array<CIngredient> = [];
    let c_ingredients = ingredients.filter((ingredient) => _ingredients.map((_ingredient) => _ingredient.name)
      .includes(ingredient.name))
    c_ingredients.forEach((ingredient) => {
      let _ingredient = _ingredients.find((_ingredient) => _ingredient.name === ingredient.name);
      if (_ingredient !== undefined && _ingredient.quantity !== null) {
        ingredient.quantity = _ingredient.quantity;
      }
      if (_ingredient !== undefined && _ingredient.unity !== null) {
        ingredient.unity = _ingredient.unity;
      }
      let cost_matiere = 0;
      // on peut considérer les ingrédients sur plusieurs aspects
      // 1. un ingrédient est définie par un prix unitaire et une quantitée pour le plat dans ce cas il suffit de faire prix * quantitée plat
      // 2. un ingrédient est difinie plus précisément avec une unitée dans se cas c'est le calcul 1 qu'il faut faire
      // à priorie lorsuq eon récupère les ingrédients des factures ont tombe souvent dan le cas 1. 
      // au restaurateur de voir si il préfère modifier l'unitée p par une autre unitée.
      // dans le cas d'ingrédient en vrac il ne faut pas que le restaurateur puisse choisir p dans les unitée pour son plat/préparation pour ses ingrédients 
      // dans la partie stock si le restaurateur choisit de faire du vrac en pièce exemple : quantitée unitaire 6 tomates -> unitée p -> 9€
      // alors il vaut mieux remplir : quantitée unitaire de 1 -> unitée p -> cost 1.50 -> quantitée 6 
      cost_matiere = this.getOnlyCostMaterial(ingredient);
      ingredient.material_cost = cost_matiere;
      ingredient_return.push(ingredient)
    })
    return ingredient_return
  }

  getOnlyCostMaterial(ing: CIngredient): number {
    let cost_matiere = 0;
    // dans un premier temps ont calcule la quantitée pas par pièce dans un seconbd temps ont pren en compte l'unitée par pièce
    if (ing.vrac === "oui") {
      if ((ing.quantity_unity !== null) && (ing.unity !== null)) {
        cost_matiere = ing.cost / this.calcul_service.convertQuantity(ing.quantity_unity, ing.unity);
      }
    }
    else {
      if (ing.unity !== "p" || ((ing.unity === "p") && (ing.unity === "p"))) {
        if ((ing.quantity !== null) && (ing.unity !== null) && (ing.quantity_unity !== null)) {
          cost_matiere = this.calcul_service.convertQuantity(ing.quantity, ing.unity) * (ing.cost / this.calcul_service.convertQuantity(ing.quantity_unity, ing.unity));
        }
      }
      else {
        if (ing.quantity !== null) cost_matiere = ing.quantity * ing.cost;
      }
    }

    return this.ToCentime(cost_matiere);
  }

  async getPrimCost(etapes: Array<Cetape>, ingredients: Array<CIngredient>,
    _ingredients: Array<TIngredientBase>, consommables: Array<Cconsommable> | Array<MiniConsommable>) {
    
      let sum_cost_ing = 0;
    let sum_cost_conso = 0;
    let second_salary = 0;
    let full_time = 0;
    let full_cost_quant_ing: Array<number> = [0];
    let full_cost_quant_conso: Array<number> = [0];
    ingredients = ingredients.map((ingredient) => {
      let base_ingredient = _ingredients.find((_ingredient) => {
        if(_ingredient.id !== null){
          return _ingredient.id.includes(ingredient.id);
        }
        return false;
      });
      if (base_ingredient !== undefined) {
        if (base_ingredient.quantity !== null) {
          ingredient.quantity = base_ingredient.quantity;
        }
        else {
          ingredient.quantity = 0;
        }
        if (base_ingredient.unity !== null) {
          ingredient.unity = base_ingredient.unity;
        }
      }
      return ingredient;
    })
    if (ingredients !== null) {
      if (ingredients.length > 0) {
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
    if (consommables !== null) {
      if (consommables.length > 0) {
        let cost = 0;
        let is_mini_conso = consommables.some((consommable) => consommable instanceof MiniConsommable)
        if (is_mini_conso) {
          full_cost_quant_conso = (consommables as Array<MiniConsommable>)
            .filter((conso: MiniConsommable) => (conso !== null) && (conso !== undefined))
            .filter((conso: MiniConsommable) => (conso.cost !== null) && (conso.cost !== undefined))
            .filter((conso: MiniConsommable) => (conso.quantity !== null) && (conso.quantity !== undefined))
            .map((conso: MiniConsommable) => {
              if (conso.cost !== null) {
                cost = conso.cost;
              }
              if (conso.quantity !== null) {
                cost = cost * conso.quantity;
              }
              return cost
            })
        }
        else {
          full_cost_quant_conso = (consommables as Array<Cconsommable>)
            .filter((conso: Cconsommable) => (conso !== null) && (conso !== undefined))
            .filter((conso: Cconsommable) => (conso.cost !== null) && (conso.cost !== undefined))
            .filter((conso: Cconsommable) => (conso.quantity !== null) && (conso.quantity !== undefined))
            .map((conso: Cconsommable) => {
              if (conso.cost !== null) {
                cost = conso.cost;
              }
              if (conso.quantity !== null) {
                cost = cost * conso.quantity;
              }
              return cost
            })
        }
      }
    }
    if (etapes !== null) {
      if (etapes.length > 0) {
        const times = etapes
          .filter((etape) => (etape !== null) && (etape !== undefined))
          .filter((etape) => (etape.time !== null) && (etape.time !== undefined))
          .map((etape) => etape.time)
          .filter((time) => (time !== null) && (time !== undefined));
        if (times.length > 0) {
          full_time = times.reduce((curr_tmps, next_tmps) => curr_tmps + next_tmps);
        }
      }
    }
    if (full_cost_quant_ing.length > 0) {
      sum_cost_ing = full_cost_quant_ing.reduce((curr_cost, next_cost) => curr_cost + next_cost);
    }
    if (full_cost_quant_conso.length > 0) {
      sum_cost_conso = full_cost_quant_conso.reduce((curr_cost, next_cost) => curr_cost + next_cost)
    }
    this.prime_cost = this.ToCentime(sum_cost_conso + sum_cost_ing);
    /* await this.restau_service.getSalaryCuisiniee(prop, restaurant).then((salary) => {
    // 35 nombr d'heur travaillé par semaine en fonction du nombre de semaine dans un mois
    const mensuel_work_hour = 4.34524*35;
    if((salary !== null) && (salary !== undefined)){
      second_salary = salary/(mensuel_work_hour * 3600);
    }
    else{
      console.log("veuillez entrer le salaire dans la base de donnée");
      
    }
    
    this.prime_cost = this.ToCentime(second_salary*full_time + this.prime_cost);
  }); */
    return this.prime_cost;
  }
  getFullTheoTimeFromSec(etapes: Array<Cetape>): string {
    if ((etapes !== undefined) && (etapes !== null)) {
      let full_time_sec = etapes.reduce((prev_etape: Cetape, suiv_etape: Cetape) => {
        const tmp_etape = new Cetape();
        tmp_etape.time = prev_etape.time + suiv_etape.time;
        return tmp_etape
      }).time;
      const heure = Math.trunc(full_time_sec / 3600);
      const min = Math.trunc(full_time_sec % 3600 / 60);
      const sec = full_time_sec % 60;
      return `${heure}h ${min}min ${sec}sec`
    }
    else {
      return "0h 0min 0sec"
    }
  }

  getFullTheoTimeSec(etapes: Array<Cetape>): number {
    if (etapes !== null) {
      if (etapes.length > 0) {
        let full_time_sec = etapes.reduce((prev_etape: Cetape, suiv_etape: Cetape) => {
          const tmp_etape = new Cetape();
          tmp_etape.time = prev_etape.time + suiv_etape.time;
          return tmp_etape
        }).time;
        return full_time_sec;
      }
      else {
        return 0;
      }
    }
    else {
      return 0
    }
  }

  // convertion des secondes en chaine de caractère
  SecToString(full_time: number) {
    const heure = Math.trunc(full_time / 3600);
    const min = Math.trunc(full_time % 3600 / 60);
    const sec = full_time % 60;
    return `${heure}h ${min}min ${sec}sec`
  }


  // convertion des secondes en chaine de caractère
  SecToArray(full_time: number) {
    const heure = Math.trunc(full_time / 3600);
    const min = Math.trunc(full_time % 3600 / 60);
    const sec = full_time % 60;
    return [heure, min, sec]
  }

  // convertion de l'heure en seconde 
  StringToSec(time_str: string) {
    let hour = 0;
    let minute = 0;
    let sec = 0;

    let hours = time_str.match(/[0-9]+h/);
    let minutes = time_str.match(/[0-9]+min/);
    let seconds = time_str.match(/[0-9]+sec/);

    if ((hours !== null) && (minutes !== null) && (seconds !== null)) {
      hour = Number(hours[0].replace('h', '')) * 60 * 60;
      minute = Number(minutes[0].replace('min', '')) * 60;
      sec = Number(seconds[0].replace('sec', ''));
    }
    return hour + minute + sec;
  }

  // quand la quantitée finale est précise on applique le calcul normal de la valeur bouchère en revanche quand la quantitée finale 
  // est exprimé en pièce alors le coût pour une préparation
  // on néglige les préparations qui ont une quantitée inférieure à 100g car alors ont divise le quotient
  // par une puissance de 10 de sorte à avoir une valeur bouchère de l'ordre de grandeur du total des coûts 
  // des ingrédients de base.
  /**
   * 
   * @param base ingrédients pour lesquelles nous voulons récupérer la valeurs bouchère
   * @param ingredients ensemble des ingrédients de la base de donnée
   * @param quantity_aft_prep quantitée après préaparation 
   * @param unity_aft_prep unitée utilisé pour la préparation
   * @returns {number} valeur bouchère de la préaparation 
   */
  getValBouchFromBasIng(base: TIngredientBase[], ingredients: CIngredient[], quantity_aft_prep: number, unity_aft_prep: string): number {
    let t_ingredients = ingredients.filter((ingredient) => base.flatMap((_ingredient) => _ingredient.id)
      .includes(ingredient.id));
    let ingredient_quantity: Array<number> = [];
    let square_final_cost = 0;
    if (base.length === 0) {
      return 0;
    }

    quantity_aft_prep = Number(quantity_aft_prep);
    const quantity_unity_act = this.calcul_service.convertQuantity(Number(quantity_aft_prep), unity_aft_prep);

    t_ingredients.forEach((ingredient: CIngredient) => {
      if (ingredient.unity !== null) {
        ingredient.quantity = Number(ingredient.quantity);
        ingredient_quantity.push(this.calcul_service.convertQuantity(ingredient.quantity, ingredient.unity));
      }
    });

    // on fait la somme des coûts et des quantitées des ingrédients de base utilisées pour la préparation
    const total_cost = t_ingredients.map(ing => {
      let cost = ing.cost
      ing.quantity_unity = Number(ing.quantity_unity);
      ing.quantity = Number(ing.quantity);
      // on normalise le cout par la quantitée unitaire
      cost = this.getOnlyCostMaterial(ing);
      return cost
    }).reduce((cost, next_cost) => cost + next_cost);
    // si la quantitée après préparation est trop faible alors on recalcule le diviseur
    if (quantity_unity_act * quantity_unity_act < 0.1) {
      let square_quant_act = quantity_unity_act * quantity_unity_act;
      let curr = total_cost;
      while (Math.round(curr) > 0) {
        curr = curr / 10;
        square_quant_act = square_quant_act * 10;
      }
      square_final_cost = square_quant_act * ingredient_quantity.reduce((ing_prev, ing) => Number(ing_prev) + Number(ing));
    }
    else {
      square_final_cost = quantity_unity_act * quantity_unity_act * ingredient_quantity.reduce((ing_prev, ing) => Number(ing_prev) + Number(ing));
    }
    if (square_final_cost !== 0) {
      return this.ToCentime(total_cost / square_final_cost);
    }
    else {
      return 0
    }
  }


  getTotCost(ingredients: Array<CIngredient>, _ingredients: Array<TIngredientBase>): number {
    let t_ingredients = ingredients.filter((ingredient) => _ingredients.flatMap((ingredient) => ingredient.id).includes(ingredient.id));
    let cost = 0
    if (ingredients !== null) {
      cost = t_ingredients.map((ing) => {
        if (ing !== null) {
          return ing.cost
        }
        else {
          return 0
        }
      }).reduce((prev_cost, next_cost) => prev_cost + next_cost);
    }
    return cost
  }

  ToCentime(quantity: number): number {
    return Math.round(quantity * 100) / 100;
  }

}
