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
    const taux_cinq_pourcent = ["pain", "patisseries", "fruit de mer coquillage fermés", "produit alimentaire conditionnée" , "boisson non alcholisée conditionnée"];
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
    return cost*(taux_tva/100)
}

getValBouchFromBasIng(base: CIngredient, quantity_unity_act:number):number{
  const cost = base.cost * base.quantity_bef_prep;
  const square_final_cost = quantity_unity_act * quantity_unity_act;
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
}
