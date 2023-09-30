import { Injectable } from '@angular/core';
import {TextShared } from 'src/app/interfaces/text';
import * as Tesseract from 'tesseract.js';
import { FactureSharedService } from '../facture_shared/facture-shared.service';
import { configue_facture_parser } from '../facture_configue';
import { FactureColumns, FactureColumnsFull, FacturePivotsFull } from 'src/app/interfaces/facture';


@Injectable({
  providedIn: 'root'
})
export class FactureImgService {
  private output:Tesseract.OutputFormats;
  private parsed_doc: TextShared[];
  private colonne_factures: FactureColumns;
  private colonne_factures_actual: FactureColumnsFull[]

  private colonne_factures_pivot: FacturePivotsFull

  constructor(private shared_service:FactureSharedService){
    this.output = {
      text: true,
      blocks: true,
      hocr: false,
      tsv: false,
      box: false,
      unlv: false,
      osd: false,
      pdf: false,
      imageColor: false,
      imageGrey: false,
      imageBinary: false,
      debug: false,
      layoutBlocks:false
    }

    const init_item: TextShared = {
      text: "",
      coordinates: []
    }
    this.colonne_factures = {
      name: ["nom", "code", "nom/code", "description", "produits", "désignation"],
      description: ["description"],
      price: ["prixunitaire", "pu", "puht", "prixht" ,"montantdû", "prixàl'unité", "prix", "prixunitaireht"],
      quantity: ["quantité", "qte", "qté"],
      tva: ["tva"]
    }
    this.colonne_factures_pivot = {
      name: init_item,
      price: init_item,
      quantity: init_item

    }
    this.colonne_factures_actual = [{
      name: [],
      price: [],
      quantity: [],
    }];
    this.parsed_doc = [];
  }

  //  On applique le même algorithme que pour les pdf
  // Si rien n'est reconnu on retourne null
  async parseFacturesImg(url_img:string){
    const psm:Tesseract.PSM = Tesseract.PSM.SPARSE_TEXT;
    const Worker = await Tesseract.createWorker();
    await Worker.loadLanguage('fra');
    await Worker.initialize('fra');
    await Worker.setParameters({
      tessedit_pageseg_mode: psm,
      tessjs_create_box: '1',
      preserve_interword_spaces: "1"
    })
    const { data: {blocks} } = await Worker.recognize(url_img, undefined, this.output);
    Worker.terminate();
    if(blocks !== null){
      const parsed_txt = this.getTextShared(blocks)
      const tab_content = this.getTabContentImg(parsed_txt);
      return tab_content.then((parsed_pdf) => {
          this.shared_service.colonne_factures_actual = [{
            name: [],
            price: [],
            quantity: [],
          }];
          return parsed_pdf;
      })
    }
    else{
      return null;
    }
  }

  getTextShared(blocks:Tesseract.Block[]): TextShared[]{
    let items:TextShared[];
    const max_height =  this.getImageMaxHeight(blocks)
    items = blocks.map((block) => {
      const coordinates = [block.bbox.x0, max_height - block.bbox.y0];
      return {text: block.text.split('\n').join(""), coordinates: coordinates}
    });
    return items
  }
  getTabContentImg(items_img:TextShared[]){
    this.getColumnNameImg(items_img);
    const parse_line_promise = this.shared_service.getLineTable(items_img, this.colonne_factures_pivot, 1).then((lines: TextShared[][]) => {
      
      return this.shared_service.rangeValInCol(lines, this.colonne_factures_pivot).then((parsed_pdf) => {
        return parsed_pdf;
      });
    });
    //const lines = this.getLinesTable()
    return parse_line_promise;
  }
  // On récupère les noms des différentes colonnes composant le tableau ainsi que la position du header
  // l'idée c'est que lors de la récupération des colonnes
  getColumnNameImg(items_img: TextShared[]){
    const name_col_dico = this.colonne_factures.name.filter((name) => name !== "description");
    //Dans un premier temps on récupère les colonne nom et description du tableau
    const description = items_img.find((item) => this.testSimilarityCol(item.text.toLowerCase(),"description" ));
    const name_col = items_img.find((item) => this.testSimilarityColArray(name_col_dico,item.text.toLowerCase().split(" ").join("")));
    if (name_col !== undefined) {
      this.colonne_factures_pivot.name = name_col;
      if (description !== undefined) {
        this.colonne_factures_pivot.description = description;
      }
    }
    else {
      if (description !== undefined) {
        this.colonne_factures_pivot.name = description;
      }
      else {
        throw "le tableau doit contenir au moins une colonne pour le nom des produits";
      }
    }
    const price = items_img.find((item) => {
      const is_price = this.testSimilarityColArray(this.colonne_factures.price, item.text.toLowerCase().split(" ").join(""));
      const y_max_coord =  item.coordinates[1] < (this.colonne_factures_pivot.name.coordinates[1] + configue_facture_parser.error_row_dist);
      const y_min_coord = (this.colonne_factures_pivot.name.coordinates[1] - configue_facture_parser.error_row_dist) < item.coordinates[1];
      return (is_price && y_max_coord && y_min_coord)
    });
    if (price !== undefined) {
      this.colonne_factures_pivot.price = price;
    }
    else {
      throw "le tableau doit contenir au moins une colonne pour le prix des produits";
    }
    const quantitee = items_img.find((item) => {
      const is_quant = this.testSimilarityColArray(this.colonne_factures.quantity, item.text.toLowerCase().split(" ").join(""));
      const y_max_coord = item.coordinates[1] < (this.colonne_factures_pivot.name.coordinates[1] + configue_facture_parser.error_row_dist);
      const y_min_coord = (this.colonne_factures_pivot.name.coordinates[1] - configue_facture_parser.error_row_dist) < item.coordinates[1];
      return (is_quant && y_max_coord && y_min_coord)
    });
    if (quantitee !== undefined) {
      this.colonne_factures_pivot.quantity = quantitee;
    }
    else {
      throw "le tableau doit contenir au moins une colonne pour la quantitée des produits";
    }
    // ============tva===================
    const tva = items_img.find((item) => {
      const is_tva =  this.testSimilarityColArray(this.colonne_factures.tva, item.text.toLowerCase().split(" ").join(""));
      const y_max_coord = item.coordinates[1] < (this.colonne_factures_pivot.name.coordinates[1] + configue_facture_parser.error_row_dist);
      const y_min_coord = (this.colonne_factures_pivot.name.coordinates[1] - configue_facture_parser.error_row_dist) < item.coordinates[1];
      return (is_tva && y_max_coord && y_min_coord)
    })
    if (tva !== undefined) {
      this.colonne_factures_pivot.tva = tva;
    }
  }

  //soit m0 un nom de colonne récupéré en dur
  // et m1 le mot récupéré depuis l'OCR ont fait m0 est m1 si et seulement si
  // le taux de similarité  est vérifié entre m0 et m1 est > 50%
  // le nombre de caractère entre les deux mots est identiques
  // Attention : en utilisant cette technique il ne faut jamais avoir comme nonm de colonne 
  // deux nom avec une similaritée > 50% et de même taille  par exemple les mots quelle et quette seront confondus
  testSimilarityCol(word:string, _word:string){
    const word_array = word.split("");
    const _word_array = _word.split(""); 
    if(word_array.length === _word_array.length){
      const _is_same_coeff = word_array.map((character, index_char) => character === _word_array[index_char])
                .map((is_same) => is_same ? 1 : 0 as number)
                .reduce((sum, sum_next) => sum + sum_next);
      const is_same_pourcent = (_is_same_coeff/word_array.length)*100;
      if(is_same_pourcent > configue_facture_parser.same_pourcent){
        return true;
      }
      else{
        return false;
      }
    }
    return false;
  }

   //soit m0 un nom de colonne récupéré en dur
  // et m1 le mot récupéré depuis l'OCR ont fait m0 est m1 si et seulement si
  // le taux de similarité  est vérifié entre m0 et m1 est > 50%
  // le nombre de caractère entre les deux mots est identiques
  // Attention : en utilisant cette technique il ne faut jamais avoir comme nom de colonne 
  // deux nom avec une similaritée > 50% et de même taille  par exemple les mots quelle et quette seront confondus
  testSimilarityColArray(words:string[], _word:string){
    return words.map((character) => this.testSimilarityCol(character, _word))
         .reduce((is_same, is_next_same) => is_same || is_next_same);  
  }

  getImageMaxHeight(document:Tesseract.Block[]){
  let y_coords = document.map((word) => word.bbox.y0);
  return 2*Math.max(...y_coords);
  }


}
