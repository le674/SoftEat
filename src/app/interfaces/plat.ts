import {TConsoBase} from "./consommable";
import {Cetape, Etape} from "./etape";
import {TIngredientBase} from "./ingredient";
import { InteractionBddFirestore } from "./interaction_bdd";
import {CpreparationBase} from "./preparation";

export class Cplat implements InteractionBddFirestore{
    "unity": string;
    "type": string;
    "category": string;
    "categorie_restaurant":string | null;
    "name": string;
    "portions": number;
    "ingredients": TIngredientBase[];
    "consommables": TConsoBase[] | null;
    "etapes": Etape[] | null;
    "preparations": CpreparationBase[] | null;
    "cost": number;
    "taux_tva": number | null;
    "prime_cost": number | null;
    "material_cost": number | null;
    "portion_cost": number | null;
    "material_ratio": number | null;
    "time":number | null;
    "proprietary_id":string;
    "id":string;

    constructor(){
        this.unity = '';
        this.type = '';
        this.category = '';
        this.categorie_restaurant = '';
        this.name = '';
        this.portions = 0;
        this.cost = 0;
        this.taux_tva = 0;
        this.material_cost = 0;
        this.portion_cost = 0;
        this.material_ratio = 0;
        this.prime_cost = 0;
        this.time = 0;
        this.ingredients = [];
        this.consommables = [];
        this.etapes = [];

    }
    /**
     * Cette fonction peremet de construire un objet plat à partir du JSON de la
     * base de donnée
     * @param data données à intégrer comme plat
    */
    public setData(data: Cplat) {
     let ingredients:Array<TIngredientBase> = [];
     let consommables:Array<TConsoBase> | null = [];
     let etapes:Array<Etape> | null = [];
     let preparations:Array<CpreparationBase> | null = [];
     ingredients =  data.ingredients.map((ingredient:TIngredientBase) => {
      let _ingredient = new TIngredientBase(ingredient.name,ingredient.quantity,ingredient.unity);
      _ingredient.setData(ingredient);
      return _ingredient;
   });
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
   if(data.preparations !== null && data.preparations !== undefined){
      preparations = data.preparations.map((preparation:CpreparationBase) => {
          let _preparation = new CpreparationBase();
          _preparation.setData(preparation);
          return _preparation;
      });
   }
   else{
      this.preparations = null;
   }
     this.name = data.name;
     this.category = data.category;
     this.cost = data.cost;
     this.id = data.id;
     this.proprietary_id = data.proprietary_id
     this.portions = data.portions;
     this.unity = data.unity;
     this.type = data.type;
     this.ingredients = ingredients;
     this.consommables = consommables;
     this.preparations = preparations;
     this.etapes = etapes;
     if(data.taux_tva !== undefined){
        this.taux_tva = data.taux_tva;
     }
     else{
        this.taux_tva = null;
     }
     if(data.time !== undefined){
        this.time = data.time
     }
     else{
        this.time = null;
     }
     if(data.material_ratio !== undefined){
        this.material_ratio = data.material_ratio;
     }
     else{
        this.material_ratio = null;
     }
     if(data.material_cost !== undefined){
        this.material_cost = data.material_cost;
     }
     else{
        this.material_cost = null;
     }
     if(data.prime_cost !== undefined){
        this.prime_cost = data.prime_cost;
     }
     else{
        this.prime_cost = null;
     }
     if(data.portion_cost !== undefined){
        this.portion_cost = data.portion_cost;
     }
     else{
        this.portion_cost = null;
     }
     if(data.categorie_restaurant !== undefined){
        this.categorie_restaurant = data.categorie_restaurant;
     }
     else{
        this.categorie_restaurant = null;
     }

    }
    /**
     * permet de convertir cette instance de Cplat en un objet 
     * @param id id du plat si aucun null
     * @param prop id de l'enseigne
     * @returns {Object} objet qui représente le plat
    */
    public getData(id:string | null): Object {
        let preparations:null | Array<Object> = null;
        let ingredients:null | Array<Object> = null;
        let consommables:null | Array<Object> = null;
        let etapes:null | Array<Object> = null;
        if((this.ingredients !== null) && (this.ingredients !== undefined)){
            ingredients = this.ingredients.map((ingredient) => ingredient.getData());
        }
        if((this.consommables !== null) && (this.ingredients !== undefined)){
            consommables = this.consommables?.map((consommable) => consommable.getData());
        }
        if((this.etapes !== null) && (this.etapes !== undefined)){
            etapes = this.etapes.map((etape) => etape.getData());
        }
        if((this.preparations !== null) && (this.preparations !== undefined)){
         preparations = this.preparations.map((preparation) => preparation.getData());
        }
        if (id !== null) {
            this.id = id;
        }   
        return {
            name: this.name,
            categorie_restaurant: this.categorie_restaurant,
            etapes: etapes,
            ingredients: ingredients,
            consommables: consommables,
            preparations: preparations,
            time: this.time,
            cost: this.cost,
            portions: this.portions,
            unity: this.unity,
            category: this.category,
            taux_tva: this.taux_tva,
            type: this.type,
            portion_cost: this.portion_cost,
            material_ratio: this.material_ratio,
            prime_cost: this.prime_cost,
            material_cost: this.material_cost,
            proprietary_id: this.proprietary_id,
            id: this.id
        }
    }
   /**
    * permet de générer une autre instance de l'objet plat
    * @returns une instance de plat
    */
   getInstance(): InteractionBddFirestore {
      return new Cplat();
   }
   public static getPathsToFirestore(proprietary_id:string){
      return ["proprietaires", proprietary_id, "plats"]
   }
}
export class CbasePlat{
   "name":string;
   "portions":number | null;
   "unity":string;
   "id":string | null;
   constructor(name:string, unity:string, portions:number | null){
       this.name = name;
       this.unity = unity;
       this.portions = portions;
       this.id = null;
   }
   public getData(){
      return {
         name:this.name,
         portions: this.portions,
         unity: this.unity,
         id: this.id
      }
   }
}


export class Mplat{
    "name":string;
    "quantity":number | null;
    "price":number;
    constructor(name:string, price:number){
        this.name = name;
        this.price = price;
        this.quantity = null;
    }
}