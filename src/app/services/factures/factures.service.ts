import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
@Injectable({
  providedIn: 'root'
})
export class FacturesService {

  private colonne_factures: {
    nom?:Array<string>,
    description?:Array<string>,
    prix?: Array<string>,
    quantitee?: Array<string>,
    tva?:Array<string>,
    total?:Array<string>
  }

  constructor() {
    this.colonne_factures = {
      nom: ["nom", "code", "description", "produits", "désignation"],
      description: ["description"],
      prix: ["prix unitaire", "pu", "montant dû", "prix à l'unitée"],
      quantitee: ["quantité", "qte", "qté"],
      tva: ["tva"],
      total: ["montant", "total"]
    }
   }

 // chacun des éléments de la liste récupérer via getTextContent est organisez comme suis
 // 1. str:<chaine de caractère>
 //2 transforme: [a,b,c,d,e,f]
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
 async parseFacture(url:string){
    // ont inscrit le chemin vers le fichier pdf.worker
    //console.log(pdfjsLib.PDFWorker.workerSrc);
    //https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.js
    pdfjsLib.GlobalWorkerOptions.workerSrc =  "/assets/js/pdf.worker.min.js";
    console.log(url);
    const pdf_promise = pdfjsLib.getDocument(url).promise;
    await pdf_promise.then((pdf_content) => {
      const page = pdf_content.getPage(1);
      page.then((page) => {
         console.log(`coordonnées pdf : ${page.view}`);
         page.getTextContent().then((content) => {
         content.items.forEach((item) => {

          })
        })
      })
    })
  }
}