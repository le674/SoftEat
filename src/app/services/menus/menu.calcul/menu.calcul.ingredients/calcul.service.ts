import { Injectable } from '@angular/core';
import { CIngredient, TIngredientBase } from '../../../../../app/interfaces/ingredient';

@Injectable({
  providedIn: 'root'
})
export class CalculService {

  constructor() { }

  getCostTtcFromCat(categorie_tva: string | null, cost: number): number | null {
    console.log("getCostTtcFromCat");
    if(categorie_tva !== null){
      let taux_tva = 0;
      const taux_ving_poucent = ["boisson alcholisée"]
      const taux_dix_pourcent = ["produit alimentaire non conditionnée", "fruit de mer coquillage ouvert", "boisson non alcholisée non conditionnée"];
      const taux_cinq_pourcent = ["pain", "patisserie", "fruit de mer coquillage fermés", "produit alimentaire conditionnée", "boisson non alcholisée conditionnée"];
      if (taux_ving_poucent.includes(categorie_tva)) {
        taux_tva = 20;
      }
      else {
        if (taux_dix_pourcent.includes(categorie_tva)) {
          taux_tva = 10;
        }
        else {
          if (taux_cinq_pourcent.includes(categorie_tva)) {
            taux_tva = 5.5;
          }
        }
      }
      return this.ToCentime(cost + cost * (taux_tva / 100));
    }
    else{
      return null;
    }
  }


  getTauxFromCat(categorie_tva: string): number {
    let taux_tva = 0;
    const taux_ving_poucent = ["boisson alcholisée"]
    const taux_dix_pourcent = ["produit alimentaire non conditionnée", "fruit de mer coquillage ouvert", "boisson non alcholisée non conditionnée"];
    const taux_cinq_pourcent = ["pain", "pâtisserie", "fruit de mer coquillage fermés", "produit alimentaire conditionnée", "boisson non alcholisée conditionnée"];
    if (taux_ving_poucent.includes(categorie_tva)) {
      return 20;
    }
    else {
      if (taux_dix_pourcent.includes(categorie_tva)) {
        return 10;
      }
      else {
        if (taux_cinq_pourcent.includes(categorie_tva)) {
          return 5.5;
        }
      }
    }
    return 0;
  }

  getCostTtcFromTaux(taux_tva: number | null, cost: number): number | null{
    if(taux_tva !== null){
      return this.ToCentime(cost + cost * (taux_tva / 100));
    }
    else{
      return null;
    }
  }


  getTvaCategorieFromConditionnement(categorie_tva: string, conditionnemnt: boolean): string {
    if ((categorie_tva === 'boisson non alcholisée') && conditionnemnt) {
      return 'boisson non alcholisée conditionnée'
    }
    if ((categorie_tva === 'boisson non alcholisée') && !conditionnemnt) {
      return 'boisson non alcholisée non conditionnée'
    }
    if ((categorie_tva === 'produit alimentaire') && conditionnemnt) {
      return 'produit alimentaire conditionnée'
    }
    if ((categorie_tva === 'produit alimentaire') && !conditionnemnt) {
      return 'produit alimentaire non conditionnée'
    }
    return categorie_tva
  }


  stringToDate(date_time: string): Date | null{
    console.log(date_time);
    let date_time_array = date_time.split(" ")
    let time = date_time_array[1];
    let date = date_time_array[0];
    if(date !== undefined && time !== undefined){
      const date_array = date.split('/');
      const time_array = time.split(':').map((time) => Number(time));
      if(date_array !== undefined && time_array !== undefined){
        const date_array_num = date_array.reverse().map((date) => Number(date));
        const date_time_array_num = date_array_num.concat(time_array);
    
        return new Date(date_time_array_num[0], date_time_array_num[1] - 1,
          date_time_array_num[2], date_time_array_num[3], date_time_array_num[4], date_time_array_num[5])
      }
      return null;
    }
    return null;
  }
/* 
  removeQuantityAftPrepa(not_prep_ing: CIngredient[], base_ing: { name: string; quantity: number; }[],
    quantity_bef_add: number, quantity_aft_add: number, is_vrac: boolean) {
    if (not_prep_ing.length === base_ing.length) {
      not_prep_ing.forEach((ingredient, index: number) => {
        // on applique la réduction uniquement dans le cas le nombre d'ingrédients préparés est plus important
        if (quantity_aft_add > quantity_bef_add) {
          //cas 1 l'aliment est acheté en vrac du coup ingredient.quantity = 0
          if (is_vrac && (ingredient.quantity_unity !== null)) {
            ingredient.quantity_unity = ingredient.quantity_unity - base_ing[index].quantity * (quantity_aft_add - quantity_bef_add);
          }
          // cas 2 l'ingrédient n'est pas acheté en vrac
          else {
            if((ingredient.quantity !== null) && (ingredient.quantity_unity !== null)){
              ingredient.quantity = ingredient.quantity - (base_ing[index].quantity / ingredient.quantity_unity) * (quantity_aft_add - quantity_bef_add);
            }
          }
        }
      })
      return not_prep_ing;
    }
    else {
      console.log("les ingrédient récupérés sur le formulaire ne coincide pas avec les ingrédient de base récupéré dans la bdd");
    }
    return null;
  } */


  convertQuantity(quantity: number, unity: string): number {
    if(unity === 'g') quantity = quantity * 0.001;
    if(unity === 'mg') quantity = quantity * 0.0001;
    if(unity === 'ml') quantity = quantity * 0.001;
    if(unity === 'cl') quantity = quantity * 0.01;
    if(unity === 'cm') quantity = quantity * 0.01;
    if(unity === 'c.c') quantity = quantity * 0.005;
    if(unity === 'c.s') quantity = quantity * 0.015;
    if(unity === 'noisette')  quantity = quantity * 0.005;
    if(unity === 'noix')  quantity = quantity * 0.015;
    if(unity === 'pince') quantity = quantity * 0.004;
    if(unity === 'pointe') quantity = quantity * 0.005;
    if(unity === 'verre') quantity = quantity * 0.2;
    return quantity;
  }

  convertUnity(unity: string, is_full: boolean): string {
    if (is_full) {
      if (unity === 'g') return 'g (grame)';
      if (unity === 'kg') return 'kg (kilogramme)';
      if (unity === 'L') return 'L (litre)';
      if (unity === 'ml') return 'ml (millilitre)';
      if (unity === 'cl') return 'cl (centilitre)';
      if (unity === 'p') return 'p (pièce)';
    }
    else {
      if (unity === 'g (grame)') return 'g';
      if (unity === 'kg (kilogramme)') return 'kg';
      if (unity === 'L (litre)') return 'L';
      if (unity === 'ml (millilitre)') return 'ml';
      if (unity === 'cl (centilitre)') return 'cl';
      if (unity === 'p') return 'p (pièce)';
    }
    return unity
  }


  calcCostIngPrep(base_ing: { name: string; quantity_unity: number; quantity: number; unity: string; cost: number }[]): number {

    // comme les objet son passez par réferance on fait une "deep copy"
    let tpm_ing_base = JSON.parse(JSON.stringify(base_ing));


    let _cost_per_quantity = base_ing.map((ing: {
      name: string;
      quantity: number;
      unity: string;
      quantity_unity: number;
      cost: number;
    }, curr_index: number) => {
      // on normalise les unitée 
      let prev_quantity = this.convertQuantity(ing.quantity_unity, ing.unity);
      let curr_quantity = this.convertQuantity(ing.quantity, ing.unity)
      return ing.cost * (curr_quantity / prev_quantity);
    })
    base_ing = tpm_ing_base;
    return this.ToCentime(_cost_per_quantity.reduce((prev_cost: number, curr_cost) => prev_cost + curr_cost));
  }

  sortTwoListStringByName(l1: Array<CIngredient>, l2: { name: string; quantity: number; unity: string; quantity_unity: number; cost: number }[]) {
    l1 = l1.sort((a, b) => {
      const nameA = a.name.toLocaleUpperCase();
      const nameB = b.name.toLocaleUpperCase();
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0
    })

    l2.sort((a, b) => {
      const nameA = a.name.toLocaleUpperCase();
      const nameB = b.name.toLocaleUpperCase();
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0
    })
  }

  ToCentime(quantity:number):number{
    return Math.round(quantity*100)/100;
  }

}
