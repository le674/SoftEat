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

getValBouchFromBasIng(base: CIngredient[], ingredient_act:CIngredient):number{
  if(base.length === 0){
    return 0;
  }
  // on fait la somme des coûts et des quantitées des ingrédients de base utilisées pour la préparation
  const sum_all_cost = base.map(ing => ing.cost).reduce((cost, next_cost) => cost + next_cost);
  const sum_all_quantity = ingredient_act.base_ing.map(ing => ing.quantity).reduce((quantity, next_quantity) => quantity + next_quantity);


  const cost = sum_all_cost * sum_all_quantity;
  const square_final_cost = ingredient_act.quantity_unity * ingredient_act.quantity_unity;
  if(square_final_cost !== 0) {
    return cost/square_final_cost; 
  }
  else{
    return 0
  }
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
    let base_ing_name = base_ing.map((ing) => ing.name);
    let ingredients = not_prep_ing.filter((ingredient) => base_ing_name.includes(ingredient.nom));

    // on trie les liste pour s'assurer d'avoir les même objet 
    base_ing = base_ing.sort((a,b) => {
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

    ingredients.sort((a,b) => {
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

    if(ingredients.length === base_ing.length){
      ingredients.forEach((ingredient, index:number) => {
        // on récupère le plus petit entier supérieur à la quantitée de l'ingrédient de base par unitée
        // le choix de la partie entière supérieur est fait car il vaut mieux être large 

        //cas 1 l'aliment est acheté en vrac du coup
        if(ingredient.quantity === 0){
          ingredient.quantity_unity = ingredient.quantity_unity - base_ing[index].quantity 
        }
        // cas 2 l'ingrédient n'est pas acheté en vrac
        else{
          ingredient.quantity = ingredient.quantity - base_ing[index].quantity/ingredient.quantity_unity
        }
      })
      console.log(ingredients);
      return ingredients;
    }
    else{
      console.log("les ingrédient récupérés sur le formulaire ne coincide pas avec les ingrédient de base récupéré dans la bdd");
    }
    return null;
  }


/* 
  stringToDate(date_time_bdd:string): Date{

    return date_time_bdd
  } */



}
