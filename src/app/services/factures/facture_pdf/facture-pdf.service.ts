import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';
import { FactureSharedService } from '../facture_shared/facture-shared.service';
import { TextShared } from '../../../../app/interfaces/text';
@Injectable({
  providedIn: 'root'
})
export class FacturePdfService {
  private colonne_factures: {
    name: Array<string>,
    description: Array<string>,
    price: Array<string>,
    quantity: Array<string>,
    tva: Array<string>,
    total: Array<string>
  }
  private colonne_factures_pivot: {
    name: TextItem,
    description?: TextItem,
    price: TextItem,
    quantity: TextItem,
    tva?: TextItem,
    total?: TextItem
  }

  constructor(private shared_service:FactureSharedService) {
    const init_item: TextItem = {
      str: "",
      dir: "",
      transform: [],
      width: 0,
      height: 0,
      fontName: "",
      hasEOL: false
    }
    this.colonne_factures = {
      name: ["nom", "code", "nom/code", "description", "produits", "désignation"],
      description: ["description"],
      price: ["prixunitaire", "pu", "puht", "montantdû", "prixàl'unité", "prix", "prixunitaireht"],
      quantity: ["quantité", "qte", "qté"],
      tva: ["tva"],
      total: ["total", "totalht", "prixtotalht"]
    }
    this.colonne_factures_pivot = {
      name: init_item,
      price: init_item,
      quantity: init_item

    }
  }


  // récupération du contenu du tableau au sein du pdf
  async getTabContentPdf(items: TextItem[]) {
    return this.getColumnName(items).then(() => {
      let factures_pivots: {name:TextShared, price:TextShared, quantity:TextShared, description?:TextShared, total?:TextShared, tva?:TextShared};
      factures_pivots = {
        name: this.shared_service.convertTextItemToTextShared(this.colonne_factures_pivot.name),
        price: this.shared_service.convertTextItemToTextShared(this.colonne_factures_pivot.price),
        quantity: this.shared_service.convertTextItemToTextShared(this.colonne_factures_pivot.quantity)
      }
      if(this.colonne_factures_pivot.description !== undefined){
        Object.assign(factures_pivots, {description: this.shared_service.convertTextItemToTextShared(this.colonne_factures_pivot.description)});
      }
      if(this.colonne_factures_pivot.total !== undefined){
        Object.assign(factures_pivots, {total: this.shared_service.convertTextItemToTextShared(this.colonne_factures_pivot.total)});
      }
      if(this.colonne_factures_pivot.tva !== undefined){
        Object.assign(factures_pivots, {tva: this.shared_service.convertTextItemToTextShared(this.colonne_factures_pivot.tva)});
      }
      // on utilise cette fonction afin de mutualiser les fonctions de traitemnents du parsing des factures entre pdf et images
      const items_shared = this.shared_service.convertTextItemToTextSharedLst(items)
      const parse_line_promise = this.shared_service.getLineTable(items_shared, factures_pivots).then((lines: TextShared[][]) => {
        return this.shared_service.rangeValInCol(lines, factures_pivots).then((parsed_pdf) => {
          return parsed_pdf;
        });
      })
      return parse_line_promise;
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
  async parseFacture(url: string) {
    // ont inscrit le chemin vers le fichier pdf.worker
    //console.log(pdfjsLib.PDFWorker.workerSrc);
    //https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/assets/js/pdf.worker.min.js";
    const pdf_promise = pdfjsLib.getDocument(url).promise;
    return pdf_promise.then((pdf_content) => {
      return pdf_content.getPage(1).then((page) => {
        const getTextContentPromise = page.getTextContent();
        const getDataPromise = pdf_content.getData();
        const parsed_pdf_prom = Promise.all([getTextContentPromise, getDataPromise]).then(([textContent, data]) => {
          const textContentLength = textContent.items.length;
          const dataLength = data.length;
          let text_items = textContent.items.filter((item) => ("str" in item)) as TextItem[];
          if (textContentLength === 0 && dataLength > 0) {
            console.log(`Page 1 contient ${dataLength} octets de données non textuelles`);
          } else {
            console.log(`Page 1 ne contient que du texte`);
          }
          return this.getTabContentPdf(text_items).then((parsed_pdf) => {
            this.shared_service.colonne_factures_actual = [{
              name: [],
              price: [],
              quantity: [],
            }];
            return parsed_pdf;
          });
        });
        return parsed_pdf_prom;
      })
    });
  }

  // On récupère les noms des différentes colonnes composant le tableau ainsi que la position du header
  async getColumnName(items: TextItem[]) {
    let text_items = items.filter((item) => ("str" in item)) as TextItem[];
    const name_col_dico = this.colonne_factures.name.filter((name) => name !== "description");
    // Dans un premier temps on récupère les colonne nom et description du tableau
    const description = text_items.find((item) => item.str.toLowerCase() === "description")
    const name_col = text_items.find((item) => name_col_dico.includes(item.str.toLowerCase().split(" ").join("")));
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
        throw "le tableau doit contenir au moin une colonne pour le nom des produits";
      }
    }
    // On fait pareil pour les colonnes prix , quantitée, tva et total on vérifie aussi que l'on est pas trop loin de name en coorrdonée y  
    //==============prix============ 
    const price = text_items.find((item) => {
      const is_price = this.colonne_factures.price.includes(item.str.toLowerCase().split(" ").join(""));
      const y_max_coord = item.transform[5] < (this.colonne_factures_pivot.name.transform[5] + 20);
      const y_min_coord = (this.colonne_factures_pivot.name.transform[5] - 20) < item.transform[5];
      return (is_price && y_max_coord && y_min_coord)
    });
    if (price !== undefined) {
      this.colonne_factures_pivot.price = price;
    }
    else {
      throw "le tableau doit contenir au moin une colonne pour le prix des produits";
    }
    //==============quantitée============ 
    const quantitee = text_items.find((item) => {
      const is_quant = this.colonne_factures.quantity.includes(item.str.toLowerCase().split(" ").join(""));
      const y_max_coord = item.transform[5] < (this.colonne_factures_pivot.name.transform[5] + 20);
      const y_min_coord = (this.colonne_factures_pivot.name.transform[5] - 20) < item.transform[5];
      return (is_quant && y_max_coord && y_min_coord)
    });
    if (quantitee !== undefined) {
      this.colonne_factures_pivot.quantity = quantitee;
    }
    else {
      throw "le tableau doit contenir au moin une colonne pour la quantitée des produits";
    }
    // ============tva===================
    const tva = text_items.find((item) => {
      const is_tva = this.colonne_factures.tva.includes(item.str.toLowerCase().split(" ").join(""));
      const y_max_coord = item.transform[5] < (this.colonne_factures_pivot.name.transform[5] + 20);
      const y_min_coord = (this.colonne_factures_pivot.name.transform[5] - 20) < item.transform[5];
      return (is_tva && y_max_coord && y_min_coord)
    })
    if (tva !== undefined) {
      this.colonne_factures_pivot.tva = tva;
    }
    // ============total===================
    const total = text_items.find((item) => {
      const is_tot = this.colonne_factures.total.includes(item.str.toLowerCase().split(" ").join(""));
      const y_max_coord = item.transform[5] < (this.colonne_factures_pivot.name.transform[5] + 20);
      const y_min_coord = (this.colonne_factures_pivot.name.transform[5] - 20) < item.transform[5];
      return (is_tot && y_max_coord && y_min_coord)
    });
    if (total !== undefined) {
      this.colonne_factures_pivot.total = total;
    }
  }
}
