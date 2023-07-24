import { Consommable, TConsoBase } from "./consommable";
import { Cetape, Etape } from "./etape";
import {TIngredientBase } from "./ingredient";
import { CbasePlat, Plat } from "./plat";
import { CpreparationBase } from "./preparation";

export interface Menu{
    /* on ventile lorsque l'on a une boisson alcholisée dans le menu pour réduire le taux, pareil lorsque on peut bénéficier de taux réduit 
    par example si il y'a du pain dans le menu */
    "name":string;
    "taux_tva":number | null;
    "cost":number;
    "cost_ttc":number | null;
    "consommables":Array<TConsoBase> | null;
    "ingredients":Array<TIngredientBase> | null;
    "etapes":Array<Etape> | null;
    "plats":Array<CbasePlat> | null;

    setData(menu:Cmenu):void;
    getData():void;
}

export class Cmenu implements Menu{
    "id":string;
    "name":string;
    "taux_tva": number | null;
    "cost": number;
    "cost_ttc":number | null;
    "consommables": TConsoBase[] | null;
    "ingredients": TIngredientBase[] | null;
    "etapes": Etape[] | null;
    "plats": CbasePlat[] | null;
    
    public setData(data: Cmenu) {
        let ingredients:Array<TIngredientBase> = [];
        let consommables:Array<TConsoBase> | null = [];
        let etapes:Array<Etape> | null = [];
        let plats:Array<CbasePlat> = [];
        this.id = data.id;
        this.name = data.name;
        this.cost = data.cost;
        this.cost_ttc = data.cost_ttc;
        this.taux_tva = data.taux_tva;
        if(data.ingredients !== null){
            ingredients =  data.ingredients.map((ingredient:TIngredientBase) => {
                let _ingredient = new TIngredientBase(ingredient.name,ingredient.quantity,ingredient.unity);
                _ingredient.setData(ingredient);
                return _ingredient;
             });
        }
        if(data.consommables !== null && data.consommables !== undefined){
            consommables = data.consommables.map((consommable:TConsoBase) => {
                let _consommable = new TConsoBase(consommable.name, consommable.quantity, consommable.unity);
                _consommable.setData(consommable);
                return _consommable;
            })
        }
         else{
            consommables = null;
        }
        if(data.etapes !== null && data.etapes !== undefined){
            etapes = data.etapes.map((etape) => {
                let _etape = new Cetape();
                _etape.setData(etape as Cetape);
                return _etape;
            })
        }
         else{
            etapes = null;
        }
        if(data.plats !== null && data.plats !== undefined){
            plats = data.plats.map((plat) => {
                let _plat = new CbasePlat(plat.name,plat.unity,plat.portions);
                _plat.id = plat.id;
                return _plat;
            })
        }
         
    }
    public getData(){
        let ingredients:null | Array<Object> = null;
        let consommables:null | Array<Object> = null;
        let etapes:null | Array<Object> = null;
        let plats: null | Array<Object> = null;

    }
}

// les classes TMP servent de classe tampon pour les classes principales  
export class TMPmenu {
    "ingredients": Array<{id:string, quantity:number, unity:string}>
    "plats": Array<{id:string, quantity:number, unity:string}>
    "etapes": Array<{id:string,commentaire:string, temps:number}>

    setPlats(plats: Array<{id:string, quantity:number, unity:string}>){
        this.plats = plats;
    }
    getPlats(){
        return this.plats;
    }

    setIngredients(ingredients: Array<{id:string, quantity:number, unity:string}>){
        this.ingredients = ingredients;
    }
    getIngredients(){
        return this.ingredients;
    }
    setEtapes(etapes: Array<{id:string,commentaire:string, temps:number}>){
        this.etapes = etapes;
    }
    getEtapes(){
        return this.etapes
    }

}