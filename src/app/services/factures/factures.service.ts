import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import { TextItem, TextMarkedContent } from 'pdfjs-dist/types/src/display/api';
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
      name: ["nom", "code", "description", "produits", "désignation"],
      description: ["description"],
      price: ["prix unitaire", "pu", "montant dû", "prix à l'unité", "prix", "dû"],
      quantitee: ["quantité", "qte", "qté"],
      tva: ["tva"],
      total: ["total"]
    }
    this.colonne_factures_actual = {
      name: init_item,
      price: init_item,
      quantitee: init_item

    }
  }

  // récupération du contenu du tableau au sein du pdf
  async getTabContentPdf(items :(TextItem | TextMarkedContent)[]){
    let text_items = items.filter((item) => ("str" in item)) as TextItem[];
    const name_col_dico = this.colonne_factures.name.filter((name) => name !== "description");
    // Dans un premier temps on récupère les colonne nom et description du tableau
    const description = text_items.find((item) => item.str.toLowerCase() === "description")
    const name_col = text_items.find((item) => name_col_dico.includes(item.str.toLowerCase()));
    if(name_col !== undefined){
      this.colonne_factures_actual.name = name_col;
    }
    if(description !== undefined){
      this.colonne_factures_actual.description = description;
    }
    if((description === undefined) && (name_col === undefined)) throw "le tableau doit contenir au moin une colonne pour le nom des produits";
   // On fait pareil pour les colonnes prix , quantitée, tva et total
   //==============prix============ 
   const price = text_items.find((item) => this.colonne_factures.price.includes(item.str.toLowerCase()));
   if(price !== undefined){
    this.colonne_factures_actual.price = price;
   }
   else{
    throw "le tableau doit contenir au moin une colonne pour le prix des produits";
   }
   //==============quantitée============ 
   const quantitee = text_items.find((item) => this.colonne_factures.quantitee.includes(item.str.toLowerCase()));
   if(quantitee !== undefined){
    this.colonne_factures_actual.quantitee = quantitee;
   }
   else{
    throw "le tableau doit contenir au moin une colonne pour la quantitée des produits";
   }
   // ============tva===================
   const tva = text_items.find((item) => this.colonne_factures.tva.includes(item.str.toLowerCase()));
   if(tva !== undefined){
    this.colonne_factures_actual.tva = tva;
   }
   // ============total===================
   const total = text_items.find((item) => this.colonne_factures.total.includes(item.str.toLowerCase()));
   if(total !== undefined){
   this.colonne_factures_actual.total = total;
   }
   console.log(this.colonne_factures_actual);
   
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
    pdfjsLib.GlobalWorkerOptions.workerSrc =  "/assets/js/pdf.worker.js";
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
          if (textContentLength === 0 && dataLength > 0) {
            console.log(`Page 1 contient ${dataLength} octets de données non textuelles`);
          } else {
            console.log(`Page 1 ne contient que du texte`);
          }
          this.getTabContentPdf(textContent.items).then(() => {
            return(textContent.items)
          });
        });
      })
    });
  }
}