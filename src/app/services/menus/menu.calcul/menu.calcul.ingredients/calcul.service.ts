import { Injectable } from '@angular/core';
import { CIngredient } from 'src/app/interfaces/ingredient';

@Injectable({
  providedIn: 'root'
})
export class CalculService {

  constructor() { }

  getCostTtcFromCat(categorie_tva:string, cost:number):number{
    let taux_tva = 0;
    const taux_ving_poucent = ["boisson alcholisée"]
    const taux_dix_pourcent = ["produit alimentaire non conditionnée", "fruit de mer coquillage ouvert",  "boisson non alcholisée non conditionnée"];
    const taux_cinq_pourcent = ["pain", "patisserie", "fruit de mer coquillage fermés", "produit alimentaire conditionnée" , "boisson non alcholisée conditionnée"];
    if(taux_ving_poucent.includes(categorie_tva)){
        taux_tva = 20;
    }
    else{
        if(taux_dix_pourcent.includes(categorie_tva)){
             taux_tva = 10;
        }
        else{
            if(taux_cinq_pourcent.includes(categorie_tva)){
              taux_tva = 5.5;
            }
        }
    }
    return cost + cost*(taux_tva/100)
}


getTauxFromCat(categorie_tva:string):number{
  let taux_tva = 0;
  const taux_ving_poucent = ["boisson alcholisée"]
  const taux_dix_pourcent = ["produit alimentaire non conditionnée", "fruit de mer coquillage ouvert",  "boisson non alcholisée non conditionnée"];
  const taux_cinq_pourcent = ["pain", "pâtisserie", "fruit de mer coquillage fermés", "produit alimentaire conditionnée" , "boisson non alcholisée conditionnée"];
  if(taux_ving_poucent.includes(categorie_tva)){
      return 20;
  }
  else{
      if(taux_dix_pourcent.includes(categorie_tva)){
           return 10;
      }
      else{
          if(taux_cinq_pourcent.includes(categorie_tva)){
            return  5.5;
          }
      }
  }
  return 0;
}

getCostTtcFromTaux(taux_tva:number, cost:number):number{
  return cost + cost*(taux_tva/100)
}


getTvaCategorieFromConditionnement(categorie_tva:string, conditionnemnt:boolean):string{
    if((categorie_tva === 'boisson non alcholisée') && conditionnemnt){
      return 'boisson non alcholisée conditionnée'
    }
    if((categorie_tva === 'boisson non alcholisée') && !conditionnemnt){
      return 'boisson non alcholisée non conditionnée'
    }
    if((categorie_tva === 'produit alimentaire') && conditionnemnt){
      return 'produit alimentaire conditionnée'
    }
    if((categorie_tva === 'produit alimentaire') && !conditionnemnt){
      return 'produit alimentaire non conditionnée'
    }
    return categorie_tva
  }


  stringToDate(date_time:string) : Date{
    console.log(date_time);
    let date_time_array = date_time.split(" ")
    let time = date_time_array[1];
    
    let date = date_time_array[0];
    
    const date_array = date.split('/');
    const time_array = time.split(':').map((time) => Number(time));
    
    const date_array_num = date_array.reverse().map((date) => Number(date));
    const date_time_array_num = date_array_num.concat(time_array);

    return new Date(date_time_array_num[0],date_time_array_num[1] - 1,
       date_time_array_num[2], date_time_array_num[3], date_time_array_num[4], date_time_array_num[5]) 
  }

  removeQuantityAftPrepa(not_prep_ing: CIngredient[], base_ing: { name: string; quantity: number; }[],
     quantity_aft_prep:number) {

    if(not_prep_ing.length === base_ing.length){
      not_prep_ing.forEach((ingredient, index:number) => {
        //cas 1 l'aliment est acheté en vrac du coup ingredient.quantity = 0
        if(ingredient.quantity === 0){
          ingredient.quantity_unity = ingredient.quantity_unity - base_ing[index].quantity 
        }
        // cas 2 l'ingrédient n'est pas acheté en vrac
        else{
          ingredient.quantity = ingredient.quantity - base_ing[index].quantity/ingredient.quantity_unity
        }
      })
      console.log(not_prep_ing);
      return not_prep_ing;
    }
    else{
      console.log("les ingrédient récupérés sur le formulaire ne coincide pas avec les ingrédient de base récupéré dans la bdd");
    }
    return null;
  }


  convertQuantity(quantity:number, unity: string): number {
    if(unity === 'g') quantity = quantity * 0.001;
    if(unity === 'ml') quantity = quantity * 0.001;
    if(unity === 'cl') quantity = quantity * 0.01;
    return quantity;
  }

  convertUnity(unity: string, is_full: boolean):string {
    if(is_full){
      if(unity === 'g') return 'g (grame)';
      if(unity === 'kg') return 'kg (kilogramme)';
      if(unity === 'L') return 'L (litre)';
      if(unity === 'ml') return 'ml (millilitre)';
      if(unity === 'cl') return 'cl (centilitre)';
      if(unity === 'p') return 'p (pièce)';
    }
    else{
      if(unity === 'g (grame)') return 'g';
      if(unity === 'kg (kilogramme)') return 'kg';
      if(unity === 'L (litre)') return 'L';
      if(unity === 'ml (millilitre)') return 'ml';
      if(unity === 'cl (centilitre)') return 'cl';
      if(unity === 'p') return 'p (pièce)';
    }
    return ''
  }


  getValBouchFromBasIng(base: CIngredient[], ingredient_act:CIngredient):number{
  
    if(base.length === 0){
      return 0;
    }
    // comme les objet son passez par réferance on fait une "deep copy"
    let tmp_base_ing = JSON.parse(JSON.stringify(ingredient_act.base_ing));
    const quantity_unity_act = this.convertQuantity(ingredient_act.quantity_unity, ingredient_act.unity);
    base.forEach((ingredient: CIngredient, index:number) => {
      const obj_ele =  ingredient_act.base_ing.filter((ing) => ing.name === ingredient.nom)[0]; 
      obj_ele.quantity = this.convertQuantity(obj_ele.quantity, ingredient.unity);
    })
    // on renvoie 0 pour signifier que des ingrédient de base pour la préparation n'on pas été ajouté en base de donnée
    if(base.length < ingredient_act.base_ing.length){
      ingredient_act.base_ing = tmp_base_ing;
      return 0;
    }
    // on fait la somme des coûts et des quantitées des ingrédients de base utilisées pour la préparation
    const moy_cost = base.map(ing => ing.cost).reduce((cost, next_cost) => cost + next_cost)/base.length;
    const moy_quantity = ingredient_act.base_ing
                             .map(ing => ing.quantity)
                             .reduce((quantity, next_quantity) => Number(quantity) + Number(next_quantity))/ingredient_act.base_ing.length;
    const moy_total_cost = moy_cost * moy_quantity;
    const square_final_cost = quantity_unity_act * quantity_unity_act;
    ingredient_act.base_ing = tmp_base_ing;
    if(square_final_cost !== 0) {
      return moy_total_cost/square_final_cost; 
    }
    else{
      return 0
    }
  }

  calcCostIngPrep(not_prep: CIngredient[], ingredient: { 
    cuisinee: string;
    nom: string;
    categorie: string;
    quantity: number;
    quantity_unity: number;
    unity: string;
    unitary_cost: number;
    dlc: number;
    date_reception: string;
    base_ing: { name: string; quantity: number; }[];
    not_prep: CIngredient[];
    quantity_after_prep: number; 
  }): number {

    // comme les objet son passez par réferance on fait une "deep copy"
    let tpm_ing_base = JSON.parse(JSON.stringify(ingredient.base_ing));

    // on trie les liste pour s'assurer d'avoir les même objet 
    this.sortTwoListStringByName(not_prep, ingredient.base_ing);

    let _cost_per_quantity = not_prep.map((prev_val: CIngredient, curr_index:number) => {
      // on normalise les unitée 
      let prev_quantity = this.convertQuantity(prev_val.quantity_unity, prev_val.unity);
      let curr_quantity = this.convertQuantity(tpm_ing_base[curr_index].quantity, prev_val.unity)
      return prev_val.cost*(curr_quantity/prev_quantity);
    })
    return _cost_per_quantity.reduce((prev_cost:number, curr_cost) => prev_cost + curr_cost);
  }

  sortTwoListStringByName(l1:Array<CIngredient>, l2:{ name: string; quantity: number; }[]){
    l1 = l1.sort((a,b) => {
      const nameA = a.nom.toLocaleUpperCase();
      const nameB = b.nom.toLocaleUpperCase();
      if(nameA < nameB){
        return -1
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0
    })

    l2.sort((a,b) => {
      const nameA = a.name.toLocaleUpperCase();
      const nameB = b.name.toLocaleUpperCase();
      if(nameA < nameB){
        return -1
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0
    })
  }

// on trie les deux liste pour qu'elle contienne les même éléments par example la fonction doit agir comme ceci
// 1.  this.data.ingredient.base_ing = [{name: "tomate", quantity: 12}, {name: "cerise", quantity: 5}]
// 2.  this.base_ing_full = [{nom: "cerise", ...}]
// -> ["", {nom: "cerise", ...}]
paralleleTwoList(base_ing_full : Array<"" | CIngredient>, base_ing: {
  name: string;
  quantity: number;
}[]){
  return Array(base_ing.length).fill("").map((value:any, index:number) => {
    const base_ing_name_only = base_ing_full.map((base) => {
      if(typeof base !== 'string'){
        return base.nom
      }
      else{
        return ""
      }
    })
    if(base_ing_name_only.includes(base_ing[index].name)){
      const ing = base_ing_full.filter((base_ing_filtre) => {
        if(typeof base_ing_filtre !== 'string'){
          return base_ing_filtre.nom === base_ing[index].name;
        }
        else{
          return false
        }
      })[0] 
      return ing;
    }
    else{
      return ""
    }
  })
  }

/* 
  stringToDate(date_time_bdd:string): Date{

    return date_time_bdd
  } */



}
