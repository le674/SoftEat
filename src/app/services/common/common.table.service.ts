import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonTableService {
  constructor() { 

  }
  /**
   * Cette fonction permet de convertir une liste de liste en chaine de caractère représentant le tableau 
   * @param array liste de liste que nous convertissons en chaine de caractères représentant un tableau
   * @returns {string} chaine de caractères qui représente le tableau
   */
  public arrayToTab(array:Array<Array<string>>){
    let max_vector = this.getMaxLength(array);
    const array_format = this.paddArray(max_vector, array);
    const sub_array_format = array_format.map((sub_array) => sub_array.join(""));
    const tab_string = sub_array_format.join("\n");
    return tab_string;
  }

  /**
   * Cette fonction permet de récupérer pour chaque chaine de carctères contenu dans les sous listes 
   * @param array liste de liste pour laquel nous récupérons le maximum de la taille des sous chaines de caractères
   */
  public getMaxLength(array:Array<Array<string>>){
    let index = 0;
    let max_vector = [];
    const row_length = array.map((sub_array, index) => sub_array.length);
    const unique_ele = Array.from(new Set(row_length));
    if(unique_ele.length > 1){
      throw new Error("les lignes ne font pas tous la même taille");
    }
    while (index < array[0].length) {
      const num_lst = array.map((sub_array) => {
        let rev_ele = sub_array[index];
        return rev_ele.length; 
      });
      max_vector.push(Math.max(...num_lst));
      index= index + 1;
    }
    return max_vector;
  }
  /**
   * Cette fonction permet de récupérer toute les colonnes et d'ajouter à celle-ci un padding
   * @param array liste de liste pour laquel nous récupérons le maximum de la taille des sous chaines de caractères
  */
  public paddArray( lengths:Array<number>, array:Array<Array<string>>){
    let tab:Array<Array<string>>  = [];
    let reversed_tab:Array<Array<string>> = [];
    let index = 0;
    while (index < array[0].length) {
      const rev_lst = array.map((sub_array, _index) => {
        let rev_ele = this.paddWord(lengths[index], sub_array[index], false); 
        if(index === array[0].length - 1){
          rev_ele = this.paddWord(lengths[index], sub_array[index], true); 
        }
        return rev_ele;
      });
      reversed_tab.push(rev_lst);
      index = index + 1;
    }
    index = 0;
    while(index < reversed_tab[0].length){
      const lst = reversed_tab.map((sub_array) => sub_array[index]);
      tab.push(lst);
      index = index + 1;
    }
    return tab;
  }
  /**
   * Cette fonction permet d'ajouter à un mot du padding pour celui-ci
   * @param word cette fonction permet d'ajouter du padding à un mot
  */
  public paddWord(length:number,word:string, latest:boolean){
    const tot_length =  length - word.length;
    let _word = word + "|";
    if(latest){
      _word = word;
    }
    return _word;
  }
  public getSiren(siret: string){
    const siret_part = siret.split(" "); 
    return siret_part[0] + siret_part[1] + siret_part[2];
  }
}
