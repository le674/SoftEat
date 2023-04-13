// Se service permet de mutualiser les fonctions communes entre le service facture image et facture pdf 
// la différence réside dans le fait que pour 
import { Injectable } from '@angular/core';
import { TextItem } from 'pdfjs-dist/types/src/display/api';
import { CIngredient } from 'src/app/interfaces/ingredient';
import { TextImg, TextShared } from 'src/app/interfaces/text';

@Injectable({
  providedIn: 'root'
})
export class FactureSharedService {

  public colonne_factures_actual: {
    name: TextShared[],
    description?: TextShared[],
    price: TextShared[],
    quantity: TextShared[],
    tva?: TextShared[],
    total?: TextShared[]
  }[]

  constructor() {
    this.colonne_factures_actual = [{
      name: [],
      price: [],
      quantity: [],
    }];
   }

// le but de cette fonction est de récupérer chacun des lignes du tableau 
  // ATTENTION : dans le cas ou c'est same_length_line qui est la condition d'arrêt et que toute les 
  // ligne ne sont pas a mm distance entre elle. Dans ce cas une ligne est ajouté à all_lines_table
  // sans que celle ci soit une ligne du tableau 
  // la valeur type peut être pdf ou bien iamge
  async getLineTable(items: TextShared[], colonne_factures_pivot:{
    name: TextShared;
    description?: TextShared;
    price: TextShared;
    quantity: TextShared;
    tva?: TextShared;
    total?: TextShared;
}) { 
  
    let same_length_line = true;
    let all_lines_table: Array<Array<TextShared>> = [];
    // on  récupère la coordonnée en y du header en utilisant name par exemple
    let curr_pivot_y = colonne_factures_pivot.name.coordinates[1];
    // on calcul la distance entre cette coordonnée et l'ensemble des ordonnées des autres éléments de la facture
    // on récupère uniquement celle qui sont supérieur à zéro car on veut la ligne du dessous
    let dist_levels = items.map((item) => curr_pivot_y - item.coordinates[1]).filter((dist) => dist > 0);
    //on applique un minimum sur les distance pour trouver la chaine de caractère exactement en dessous
    const first_line_gap = Math.min.apply(Math.min, dist_levels);
    // ont récupère la liste des mots qui sont uniquement en dessous et pas le reste
    // on prend 10 pixel entre le mot et les autres mot de la ligne au cas ou les mots ne sont pas au mm niveau
    let l_next = items.filter((item) => ((curr_pivot_y - item.coordinates[1]) < first_line_gap + 10) && ((curr_pivot_y - item.coordinates[1]) > first_line_gap - 10));
    // on enlève l_next de la liste de mots
    items = items.filter((item) => !l_next.includes(item));
    all_lines_table.push(l_next);
    // ont récupère la distance entre les header et la première ligne (cette méthode ne marche pas forcément)
    let next_pivot_y = curr_pivot_y - first_line_gap;
    let curr_line_gap = first_line_gap;
    // Ont réitère la procédure si dessus à chaque fois l'on recalcul la distance entre la ligne du dessous et celle du dessus 
    // si à un moment 
    //1. cette distance diffère on en déduit que l'on est arrivé à la fin du tableau
    //2. le nombre d'élément de la ligne suivante parsé différe du nombre d'élément des autres ligne
    while ((first_line_gap === curr_line_gap) || same_length_line) {
      curr_pivot_y = next_pivot_y;
      dist_levels = items.map((item) => curr_pivot_y - item.coordinates[1]).filter((dist) => dist > 0);
      curr_line_gap = Math.min.apply(Math.min, dist_levels);
      l_next = items.filter((item) => ((curr_pivot_y - item.coordinates[1]) < curr_line_gap + 10) && ((curr_pivot_y - item.coordinates[1]) > curr_line_gap - 10));
      items = items.filter((item) => !l_next.includes(item));
      all_lines_table.push(l_next);
      next_pivot_y = curr_pivot_y - curr_line_gap;
      curr_line_gap = curr_pivot_y - next_pivot_y;
      //on fait une verification sur la taille de la ligne on s'assure pur cela que la ligne suivantes a autant de mot que la ligne précédente
      // pour cela ont prend la ligne 0 et ont vérifie que chacune de nos lignes à le mm nombre d'éléments.
      same_length_line = all_lines_table.map((line) => line.length)
        .map((line_length) => line_length === all_lines_table[0].length)
        .reduce((prev_bool, next_bool) => prev_bool && next_bool);
    }
    return (all_lines_table);
  }


  //pour chacune des lignes de pivots on calcul la distance en x du pivot à chacun des autres mots de la ligne
  //on contruit donc à nouveau une matrice m x n avec m qui est le nombre de mots de la ligne 
  //pour la première ligne par exemple on determine  le minimum de cette matrice e_i0j0  
  //donne mi00 -> colonne 0 
  async rangeValInCol(lines: TextShared[][], colonne_factures_pivot:{
    name: TextShared;
    description?: TextShared;
    price: TextShared;
    quantity: TextShared;
    tva?: TextShared;
    total?: TextShared;
}) {
    //On initialise this.colonne_factures_actual en fonction de la présence ou non des colonnes tva, total, description 
    if (colonne_factures_pivot.description !== undefined) {
      Object.assign(this.colonne_factures_actual[0], { description: [] })
    }
    if (colonne_factures_pivot.total !== undefined) {
      Object.assign(this.colonne_factures_actual[0], { total: [] })
    }
    if (colonne_factures_pivot.tva !== undefined) {
      Object.assign(this.colonne_factures_actual[0], { tva: [] })
    }
    // On parcours l'ensemble des lignes du tableau
    for (let line_index = 0; line_index < lines.length; line_index++) {
      let line = lines[line_index];
      // On récupère le pivot pour la ligne associée
      const all_pivots = this.getAllPivots(line, colonne_factures_pivot);
      let pivot: TextShared | undefined;
      let categories_min: TextShared | undefined;
      let all_columns: number[][] = [];
      let full_min: number;
      // On supprime les mot de la ligne pour les ranger dans les ensembles Nom, Quantitée, Description, ect...
      while (line.length !== 0) {
        // pour chacune des colonne du tableau à priorie pivot sera toujours définie 
        for (let column of Object.keys(all_pivots)) {
          pivot = all_pivots[column as keyof typeof all_pivots]
          // On calcule une matrice l1 = (m00 - p0) ... (mn0 - p0), l2 = (m00 - p1) ... (mn0 - p1)
          if (pivot !== undefined) {
            const define_pivot = pivot;
            all_columns.push(line.map((word) => Math.abs(word.coordinates[0] - define_pivot.coordinates[0])))
          }
        }
        // on détermine le minimum de cette matrice  c'est le minimum global min(l1, ..., ln) = eij
        // puis on range mi0 dans la colonne j 
        full_min = Math.min(...all_columns.flat());
        for (let column of Object.keys(all_pivots)) {
          pivot = all_pivots[column as keyof typeof all_pivots];
          if (pivot !== undefined) {
            const define_pivot2 = pivot;
            categories_min = line.find((word) => Math.abs(word.coordinates[0] - define_pivot2.coordinates[0]) === full_min);
            line = line.filter((word) => word !== categories_min);           
            if (categories_min !== undefined) {
              this.colonne_factures_actual[line_index][column as keyof typeof all_pivots]?.push(categories_min);
            }
          }
        }
        // On n'oublie pas de remettre la matrice vide pour itérer la procédure
        all_columns = [];
      }
      // Commme on le fait pour chaque ligne il faut donc ajouter pour chaque ligne
      // un nouvelle ensemble de colonne sur lequel appliquer la procédure plus haut
      // on fait bien attention à ajouter les champs optionnel si il éxiste dans notre tableau
      let to_add_colonne_factures = {
        name: [],
        quantity: [],
        price: []
      }
      if (colonne_factures_pivot.description !== undefined) {
        Object.assign(to_add_colonne_factures, { description: [] })
      }
      if (colonne_factures_pivot.total !== undefined) {
        Object.assign(to_add_colonne_factures, { total: [] })
      }
      if (colonne_factures_pivot.tva !== undefined) {
        Object.assign(to_add_colonne_factures, { tva: [] })
      }
      this.colonne_factures_actual.push(to_add_colonne_factures)
    }

    return this.convertColumnSetToPdf(this.colonne_factures_actual);
  }

 // cette fonction permet de convertire un objet contenant chacun des mots rangé dans la bonne colonne 
  //en les lignes à ajouter dans l'inventaire
  convertColumnSetToPdf(column_set: {
    name: TextShared[];
    description?: TextShared[] | undefined;
    price: TextShared[];
    quantity: TextShared[];
    tva?: TextShared[] | undefined;
    total?: TextShared[] | undefined;
  }[]) {
    return column_set.map((line) => {
      let parsed_pdf = {};
      //On concatène tout les attributs nom des différents mots du pdf 
      if((line.name.length > 0) && (line.name.length !== undefined)){
        Object.assign(parsed_pdf, {
          name: line.name.map((words) => words.text)
                         .reduce((prev_word, next_word) => prev_word + next_word)
        });
      }
      //On concatène tout les attributs prix des différents mots du pdf et quantitée ont fait de meme pour les attributs optionnels
      if((line.price.length > 0) && (line.price.length !== undefined)){
        Object.assign(parsed_pdf, {
          price: Number(line.price.map((words) => words.text)
            .reduce((prev_word, next_word) => prev_word + next_word)
            .match("^[0-9]+"))
        });
      }
      if((line.quantity.length > 0) && (line.quantity.length !== undefined)){
        Object.assign(parsed_pdf, {
          quantity: Number(line.quantity.map((words) => words.text)
            .reduce((prev_word, next_word) => prev_word + next_word)
            .match("^[0-9]+"))
        });
      }
      if((line.description !== undefined) && (line.description.length > 0)) {
        Object.assign(parsed_pdf, {
          description: line.description.map((words) => words.text)
            .reduce((prev_word, next_word) => prev_word + next_word)
        })
      }
      else{
        Object.assign(parsed_pdf, {description: undefined})
      }
      if((line.tva !== undefined) && (line.tva.length > 0)){
        Object.assign(parsed_pdf, {
          tva: Number(line.tva.map((words) => words.text)
            .reduce((prev_word, next_word) => prev_word + next_word)
            .match("^[0-9]+"))
        })
      }
      else{
        Object.assign(parsed_pdf, {tva: undefined})
      }
      if((line.total !== undefined) && (line.total.length > 0)) {
        Object.assign(parsed_pdf, {
          total: Number(line.total.map((words) => words.text)
            .reduce((prev_word, next_word) => prev_word + next_word)
            .match("^[0-9]+"))
        })
      }
      else{
        Object.assign(parsed_pdf, {total: undefined})
      }
      return parsed_pdf as {
        name: string;
        description?: string | undefined;
        price: number;
        quantity: number;
        tva?: number | undefined;
        total?: number | undefined;
      }
    })
  }


    // Ont détermine les valeurs pivot pour cela on regarde pour la ligne 1 par exemple la valeur (m0) tel que h1 (premier mot du header)
  // vérifie xh1 - xm0 soit inférieur aux autre avec xmi := l'ensemble des abscisse des mots de la première ligne
  // On fait pareil pour les autres lignes.
  // Pour les p ligne on détermine systématiquement n pivots ont a donc une matrice p x n
  getAllPivots(line: TextShared[], colonne_factures_pivot:{
    name: TextShared;
    description?: TextShared;
    price: TextShared;
    quantity: TextShared;
    tva?: TextShared;
    total?: TextShared;
}) {
    let des_col: number[] = [];
    let tva_col: number[] = [];
    let total_col: number[] = [];
    let p_desc = undefined;
    let p_tva = undefined;
    let p_total = undefined;
    let name_col = line.map((word) => Math.abs(word.coordinates[0] - colonne_factures_pivot.name.coordinates[0]));
    const p_name = line.find((word) => Math.abs(word.coordinates[0] - colonne_factures_pivot.name.coordinates[0]) === Math.min(...name_col));
    let price_col = line.map((word) => Math.abs(word.coordinates[0] - colonne_factures_pivot.price.coordinates[0]));
    const p_price = line.find((word) => Math.abs(word.coordinates[0] - colonne_factures_pivot.price.coordinates[0]) === Math.min(...price_col));
    let quant_col = line.map((word) => Math.abs(word.coordinates[0] - colonne_factures_pivot.quantity.coordinates[0]));
    const p_quant = line.find((word) => Math.abs(word.coordinates[0] - colonne_factures_pivot.quantity.coordinates[0]) === Math.min(...quant_col));
    if (colonne_factures_pivot.description !== undefined) {
      const descriptions = colonne_factures_pivot.description
      des_col = line.map((word) => Math.abs(word.coordinates[0] - descriptions.coordinates[0]));
      p_desc = line.find((word) => Math.abs(word.coordinates[0] - descriptions.coordinates[0]) === Math.min(...des_col));
    }
    if (colonne_factures_pivot.tva !== undefined) {
      const tva = colonne_factures_pivot.tva
      tva_col = line.map((word) => Math.abs(word.coordinates[0] - tva.coordinates[0]));
      p_tva = line.find((word) => Math.abs(word.coordinates[0] - tva.coordinates[0]) === Math.min(...tva_col));
    }
    if (colonne_factures_pivot.total !== undefined) {
      const total = colonne_factures_pivot.total
      total_col = line.map((word) => Math.abs(word.coordinates[0] - total.coordinates[0]));
      p_total = line.find((word) => Math.abs(word.coordinates[0] - total.coordinates[0]) === Math.min(...total_col));
    }
    return {
      name: p_name,
      price: p_price,
      description: p_desc,
      tva: p_tva,
      quantity: p_quant,
      total: p_total
    }
  }


  //Attention pour TextItem le point (x0, y0) représente le point dans le coin en bas à gauche du mots
  // alors que pour (x0, y0) dans le cadre de TextImg c'est le point en haut à gauche. Cependant cela ne change 
  // en rien les traitment qui vont suivre coilà pourquoi l'on construit 
  convertTextItemToTextShared(items:TextItem): TextShared {
   return {
    text:items.str,
    coordinates:[items.transform[4], items.transform[5]]
   }
  }
  convertTextItemToTextSharedLst(items: TextItem[]):TextShared[]{
    return items.map((item) => this.convertTextItemToTextShared(item));
  }

  convertParsedLstToIngs():Array<CIngredient>{
    return []
  }
}
