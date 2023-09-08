import {TConsoBase } from "./consommable";
import { Cetape, Etape } from "./etape";
import {TIngredientBase } from "./ingredient";
import { InteractionBddFirestore } from "./interaction_bdd";
import { CbasePlat} from "./plat";

export class Cmenu implements InteractionBddFirestore{
    "id":string;
    "name":string;
    "taux_tva": number | null;
    "cost": number;
    "cost_ttc":number | null;
    "consommables": TConsoBase[] | null;
    "ingredients": TIngredientBase[] | null;
    "etapes": Etape[] | null;
    "plats": CbasePlat[] | null;
    [index:string]:any;
    
    /**
     * permet de transformer les donnée JSON récupérer depuis la bdd firestore en objet MENU
     * @param data donnée Json récupérer depuis la base ded onnée firestore
     */
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
            this.ingredients =  data.ingredients.map((ingredient:TIngredientBase) => {
                let _ingredient = new TIngredientBase(ingredient.name,ingredient.quantity,ingredient.unity);
                _ingredient.setData(ingredient);
                return _ingredient;
             });
        }
        if(data.consommables !== null && data.consommables !== undefined){
            this.consommables = data.consommables.map((consommable:TConsoBase) => {
                let _consommable = new TConsoBase(consommable.name, consommable.quantity, consommable.unity);
                _consommable.setData(consommable);
                return _consommable;
            })
        }
         else{
            consommables = null;
        }
        if(data.etapes !== null && data.etapes !== undefined){
            this.etapes = data.etapes.map((etape) => {
                let _etape = new Cetape();
                _etape.setData(etape as Cetape);
                return _etape;
            })
        }
         else{
            etapes = null;
        }
        if(data.plats !== null && data.plats !== undefined){
            this.plats = data.plats.map((plat) => {
                let _plat = new CbasePlat(plat.name,plat.unity,plat.portions);
                _plat.id = plat.id;
                return _plat;
            })
        }
         
    }
    /**
     * permet de récupérer un menu depuis la base de donnée
     * @param id identifiant du menu dans la base de donnée
     * @returns {Object} JSON correspndant au menu 
     */
    public  getData(id: string | null, attrs:Array<string> | null){
        let _attrs = Object.keys(this);
        let ingredients:null | Array<Object> = null;
        let consommables:null | Array<Object> = null;
        let etapes:null | Array<Object> = null;
        let plats: null | Array<Object> = null;
        let object:{[index:string]:any} = {};
        if(this.ingredients !== undefined){
            if(this.ingredients !== null){
                ingredients = this.ingredients.map((ingredient) => ingredient.getData());
            }
        }
        else{
            this.ingredients = null;
        }
        if(this.consommables !== undefined){
            if(this.consommables !== null){
                consommables = this.consommables.map((consommable) => consommable.getData(null, null));
            }
        }
        else{
            this.consommables = null;
        }
        if(this.plats !== undefined){
            if(this.plats !== null){
                plats = this.plats.map((plat) => plat.getData());
            }
        }
        else{
            this.plats = null;
        }
        if(this.etapes !== undefined){
            if(this.etapes !== null){
                etapes = this.etapes.map((etape) => etape.getData());
            }
        }
        else{
            this.etapes = null;
        }
        if(id !== null){
            this.id = id;
        }
        if(attrs){
            _attrs = attrs
        }
        for(let attr of _attrs){
            if(attr === "etapes"){
                object[attr] = etapes;
            }
            else{
                if(attr === "plats"){
                    object[attr] = plats;
                }
                else{
                  if(attr === "ingredients"){
                     object[attr] = ingredients;
                  }
                  else{
                     if(attr === "consommables"){
                        object[attr] = consommables;
                     }
                     else{
                        object[attr] = this[attr]
                     }
                  }
                }
            }
        }
        return object;
    }
    /**
     * chemin vers l'ensemble des menus dans firestore
     * @param prop enseigne pour laquel nous souhaitons récupérer le menu
     */
    public static getPathsToFirestore(proprietary_id: string):string[] {
        return ["proprietaires", proprietary_id, "restaurants"];
    }
    /**
     * permet de construire une instance de la class menu
     * @returns {Cmenu} une instance de menu
     */
    public getInstance(): InteractionBddFirestore {
        return new Cmenu();
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