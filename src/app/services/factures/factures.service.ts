import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';
@Injectable({
  providedIn: 'root'
})
export class FacturesService {
  private colonne_factures: {
    name:Array<string>,
    description:Array<string>,
    price: Array<string>,
    quantitee: Array<string>,
    tva:Array<string>,
    total:Array<string>
  }

  private colonne_factures_actual: {
    name:TextItem,
    description?:TextItem,
    price: TextItem,
    quantitee: TextItem,
    tva?:TextItem,
    total?:TextItem
  }

  constructor() {
    const init_item:TextItem = {str: "",
      dir: "",
      transform: [],
      width: 0,
      height: 0,
      fontName: "",
      hasEOL: false
    }
    this.colonne_factures = {
      name: ["nom", "code", "nom/code" ,"description", "produits", "désignation"],
      description: ["description"],
      price: ["prixunitaire", "pu", "puht" ,"montantdû", "prixàl'unité", "prix","prixunitaireht" ],
      quantitee: ["quantité", "qte", "qté"],
      tva: ["tva"],
      total: ["total", "totalht", "prixtotalht"]
    }
    this.colonne_factures_actual = {
      name: init_item,
      price: init_item,
      quantitee: init_item

    }
  }

  // le but de cette fonction est de récupérer chacun des lignes du tableau 
  // ATTENTION : dans le cas ou c'est same_length_line qui est la condition d'arrêt et que toute les 
  // ligne ne sont pas a mm distance entre elle. Dans ce cas une ligne est ajouté à all_lines_table
  // sans que celle ci soit une ligne du tableau 
  async getLineTable(items :TextItem[]){
    let same_length_line = true;
    let all_lines_table:Array<Array<TextItem>> = [];
    // on  récupère la coordonnée en y du header en utilisant name par exemple
    let curr_pivot_y = this.colonne_factures_actual.name.transform[5];
    // on calcul la distance entre cette coordonnée et l'ensemble des ordonnées des autres éléments de la facture
    // on récupère uniquement celle qui sont supérieur à zéro car on veut la ligne du dessous
    let dist_levels = items.map((item) => curr_pivot_y - item.transform[5]).filter((dist) => dist > 0);
    //on applique un minimum sur les distance pour trouver la chaine de caractère exactement en dessous
    const first_line_gap = Math.min.apply(Math.min, dist_levels);
    // ont récupère la liste des mots qui sont uniquement en dessous et pas le reste
    // on prend 10 pixel entre le mot et les autres mot de la ligne au cas ou les mots ne sont pas au mm niveau
    let l_next = items.filter((item) =>  ((curr_pivot_y - item.transform[5]) < first_line_gap + 10) && ((curr_pivot_y - item.transform[5]) > first_line_gap - 10));
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
    while((first_line_gap === curr_line_gap) || same_length_line) {
        curr_pivot_y = next_pivot_y;
        dist_levels = items.map((item) => curr_pivot_y - item.transform[5]).filter((dist) => dist > 0);
        curr_line_gap = Math.min.apply(Math.min, dist_levels);
        l_next = items.filter((item) =>  ((curr_pivot_y - item.transform[5]) < curr_line_gap + 10) && ((curr_pivot_y - item.transform[5]) > curr_line_gap - 10));
        items = items.filter((item) => !l_next.includes(item));
        all_lines_table.push(l_next);
        next_pivot_y = curr_pivot_y - curr_line_gap;
        curr_line_gap = curr_pivot_y - next_pivot_y;
        //on fait une verification sur la taille de la ligne on s'assure pur cela que la ligne suivantes a autant de mot que la ligne précédente
        // pour cela ont prend la ligne 0 et ont vérifie que chacune de nos lignes à le mm nombre d'éléments.
        same_length_line = all_lines_table.map((line) => line.length)
                                           .map((line_length) =>  line_length ===  all_lines_table[0].length)
                                           .reduce((prev_bool, next_bool) => prev_bool && next_bool);
    }
   return(all_lines_table);
  }

  // Ont détermine les valeurs pivot pour cela on regarde pour la ligne 1 par exemple la valeur (m0) tel que h1 (premier mot du header)
  // vérifie xh1 - xm0 soit inférieur aux autre avec xmi := l'ensemble des abscisse des mots de la première ligne
  // On fait pareil pour les autres lignes.
  // Pour les p ligne on détermine systématiquement n pivots ont a donc une matrice p x n
  async getAllPivots(line :TextItem[]){
    let des_col:number[] = [];
    let tva_col:number[] = [];
    let total_col:number[] = [];
    let p_desc = undefined;
    let p_tva = undefined;
    let p_total = undefined;
    let name_col = line.map((word) => Math.abs(word.transform[4] - this.colonne_factures_actual.name.transform[4]));
    const p_name = line.find((word) => Math.abs(word.transform[4] - this.colonne_factures_actual.name.transform[4]) === Math.min(...name_col));
    let price_col = line.map((word) => Math.abs(word.transform[4] - this.colonne_factures_actual.price.transform[4]));
    const p_price = line.find((word) => Math.abs(word.transform[4] - this.colonne_factures_actual.price.transform[4])  === Math.min(...price_col));
    let quant_col = line.map((word) => Math.abs(word.transform[4] - this.colonne_factures_actual.quantitee.transform[4]));
    const p_quant = line.find((word) => Math.abs(word.transform[4] - this.colonne_factures_actual.quantitee.transform[4])  === Math.min(...quant_col));
    if(this.colonne_factures_actual.description !== undefined){
       const descriptions = this.colonne_factures_actual.description
       des_col = line.map((word) => Math.abs( word.transform[4] - descriptions.transform[4]));
       p_desc = line.find((word) => Math.abs( word.transform[4] - descriptions.transform[4]) === Math.min(...des_col));
    } 
    if(this.colonne_factures_actual.tva !== undefined){
      const tva = this.colonne_factures_actual.tva
      tva_col = line.map((word) => Math.abs(word.transform[4] - tva.transform[4]));
      p_tva = line.filter((word) => Math.abs(word.transform[4] - tva.transform[4]) === Math.min(...tva_col));
    }
    if(this.colonne_factures_actual.total !== undefined){
      const total = this.colonne_factures_actual.total
      total_col = line.map((word) => Math.abs(word.transform[4] - total.transform[4]));
      p_total = line.filter((word) => Math.abs(word.transform[4] - total.transform[4]) === Math.min(...total_col));
    }
    return {
            p_name: p_name,
            p_price: p_price,
            p_desc: p_desc,
            p_tva: p_tva,
            p_quant: p_quant,
            p_total: p_total
          }
  }

  //pour chacune des lignes de pivots on calcul la distance en x du pivot à chacun des autres mots de la ligne
  //on contruit donc à nouveau une matrice m x n avec m qui est le nombre de mots de la ligne 
  //pour la première ligne par exemple on determine  le minimum de cette matrice e_i0j0  
  //donne mi00 -> colonne 0 
  async rangeValInCol(lines:TextItem[][]){
    const parsed_doc = lines.map((line) => {
      this.getAllPivots(line).then(() => {

      })
    })
  }

  // récupération du contenu du tableau au sein du pdf
  async getTabContentPdf(items :TextItem[]){
    await this.getColumnName(items).then(() => {
      this.getLineTable(items).then((lines:TextItem[][]) => {
      })
    });
  }


 // chacun des éléments de la liste récupérer via getTextContent est organisez comme suis
 // 1. str:<chaine de caractère>
 // 2. transforme: [a,b,c,d,e,f]
 //La signification de chaque élément est la suivante :
 //   a : échelle horizontale
 //   b : inclinaison horizontale
 //   c : inclinaison verticale
 //   d : échelle verticale
 //   e : position horizontale
 //   f : position verticale  
 // Ont utilise l'attribut "colonne factures" pour déterminer les noms des différentes colonnes
 // Attention : il faut prendre en compte l'agencmeent "logique entre les noms de colonne"
 // Si je trouve le mot description et pas le mot nom, code, produits, désignation
 // j'en déduit que ma description concerne le nom sinon c'est dans description.
 // trouver les autres lien logiques entre les colonnes.
 // Attention pas toute les polices sont prisent en charge dans le cas ou une police n'est pas prise en charge demander
 // au fournisseur de fournir des pdfs avec des polices prisent en charges 
 async parseFacture(url:string){
    // ont inscrit le chemin vers le fichier pdf.worker
    //console.log(pdfjsLib.PDFWorker.workerSrc);
    //https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.js
    pdfjsLib.GlobalWorkerOptions.workerSrc =  "/assets/js/pdf.worker.min.js";
    console.log(url);
    const pdf_promise = pdfjsLib.getDocument(url).promise;
    pdf_promise.then((pdf_content) => {
      pdf_content.getPage(1).then((page) => {
        console.log(page._pageInfo);
        const getTextContentPromise = page.getTextContent();
        const getDataPromise = pdf_content.getData();
        Promise.all([getTextContentPromise, getDataPromise]).then(([textContent, data]) => {
          const textContentLength = textContent.items.length;
          const dataLength = data.length;
          const init_item:TextItem = {str: "", dir: "", transform: [], width: 0, height: 0, fontName: "", hasEOL: false}
          let text_items = textContent.items.filter((item) => ("str" in item)) as TextItem[];
          if (textContentLength === 0 && dataLength > 0) {
            console.log(`Page 1 contient ${dataLength} octets de données non textuelles`);
          } else {
            console.log(`Page 1 ne contient que du texte`);
          }
          this.getTabContentPdf(text_items).then(() => {
            return(textContent.items)
          });
        });
      })
    });
  }

  // On récupère les noms des différentes colonnes composant le tableau ainsi que la position du header
  async getColumnName(items :TextItem[]){
    const init_item:TextItem = {str: "", dir: "", transform: [], width: 0, height: 0, fontName: "", hasEOL: false}
    let text_items = items.filter((item) => ("str" in item)) as TextItem[];
    const name_col_dico = this.colonne_factures.name.filter((name) => name !== "description");
    // Dans un premier temps on récupère les colonne nom et description du tableau
    const description = text_items.find((item) => item.str.toLowerCase() === "description")
    const name_col = text_items.find((item) => name_col_dico.includes(item.str.toLowerCase().split(" ").join("")));
    if(name_col !== undefined){
      this.colonne_factures_actual.name = name_col;
      if(description !== undefined){
        this.colonne_factures_actual.description = description;
      }
    }
    else{
      if(description !== undefined){
        this.colonne_factures_actual.name = description;
      }
      else{
        throw "le tableau doit contenir au moin une colonne pour le nom des produits";
      }
    }
   // On fait pareil pour les colonnes prix , quantitée, tva et total
   //==============prix============ 
   const price = text_items.find((item) => this.colonne_factures.price.includes(item.str.toLowerCase().split(" ").join("")));
   if(price !== undefined){
    this.colonne_factures_actual.price = price;
   }
   else{
    throw "le tableau doit contenir au moin une colonne pour le prix des produits";
   }
   //==============quantitée============ 
   const quantitee = text_items.find((item) => this.colonne_factures.quantitee.includes(item.str.toLowerCase().split(" ").join("")));
   if(quantitee !== undefined){
    this.colonne_factures_actual.quantitee = quantitee;
   }
   else{
    throw "le tableau doit contenir au moin une colonne pour la quantitée des produits";
   }
   // ============tva===================
   const tva = text_items.find((item) => this.colonne_factures.tva.includes(item.str.toLowerCase().split(" ").join("")));
   if(tva !== undefined){
    this.colonne_factures_actual.tva = tva;
   }
   // ============total===================
   const total = text_items.find((item) => this.colonne_factures.total.includes(item.str.toLowerCase().split(" ").join("")));
   if(total !== undefined){
   this.colonne_factures_actual.total = total;
   }
  }

}