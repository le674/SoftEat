import { IngredientsInteractionService } from "../services/menus/ingredients-interaction.service";
import { CalculService } from "../services/menus/menu.calcul/menu.calcul.ingredients/calcul.service";
import { Consommable, TConsoBase } from "./consommable";
import {Etape } from "./etape";
import {Ingredient, TIngredientBase } from "./ingredient";


export interface AfterPreparation {
    "quantity":number;
    "unity":string
}

export interface Preparation {    
    "nom":string | null;
    "categorie_restaurant": string;
    "ingredients":Array<TIngredientBase>;
    "consommables":Array<TConsoBase>;
    "cost": number;
    "quantity": number;
    "quantity_unity": number;
    "total_quantity":number;
    "unity": string;
    "is_similar":number;
    "marge": number;
    "vrac":string;
    "dlc":Date;
    "date_reception":Date;

    getNom():string | null;
    setNom(nom:string):void;
    getPortion():number;
    setPortions(portion:number):void;
    setIngredients(ingredients:Array<TIngredientBase>):void;
    getIngredients():Array<TIngredientBase>;
    setConsommbale(consommables:Array<TConsoBase>):void;
    getConsommbale():Array<TConsoBase>;
}

export class Cpreparation implements Preparation {
    "nom": string;
    "categorie_restaurant": string;
    "etapes":Array<Etape> | null;
    "temps":number | null;
    "cost": number;
    "quantity": number;
    "quantity_unity": number;
    "total_quantity": number;
    "unity": string;
    "marge": number;
    "vrac": string;
    "portions": number;
    "dlc": Date;
    "date_reception":Date;
    "ingredients": TIngredientBase[];
    "consommables": TConsoBase[];
    "val_bouch": number | null;
    "prime_cost":number | null;
    "material_cost":number | null;
    "quantity_bef_prep": number | null;
    "quantity_after_prep": number | null;
    "is_similar": number;
    "is_stock": boolean;
    "id":string;

    constructor(private service: CalculService){
        this.consommables = [];
        this.nom = "";
        this.categorie_restaurant = "";
        this.cost = 0;
        this.quantity = 0;
        this.quantity_unity = 0;
        this.unity = "";
    }

    // permet d'initialiser certain attributs pour l'objet préparation lorsque celui-ci a des attributs null
    setDefautPrep() {
        this.categorie_restaurant = (this.categorie_restaurant === null) ? "" : this.categorie_restaurant;
        this.cost = (this.cost === null) ? 0 : this.cost;
        this.date_reception = (this.date_reception === null) ? new Date() : this.date_reception;
        this.quantity = (this.quantity === null) ? 0 : this.quantity;
        this.unity = (this.unity === null) ? "" : this.unity;
        this.vrac = (this.vrac === null) ? 'non' : this.vrac;
    }
    getNom(): string | null {
        return this.nom
    }
    setNom(nom: string): void {
        this.nom = nom
    }
    getPortion(): number {
        return this.portions
    }
    setPortions(portion: number): void {
        this.portions = portion
    }
    setIngredients(ingredients: TIngredientBase[]): void {
        this.ingredients = ingredients
    }
    getIngredients(): TIngredientBase[] {
        return this.ingredients
    }
    setConsommbale(consommables: TConsoBase[]): void {
        this.consommables = consommables;
    }
    getConsommbale(): TConsoBase[] {
       return this.consommables
    }
    setData(data: Cpreparation) {
        this.nom = data.nom;
        this.categorie_restaurant = data.categorie_restaurant;
        this.categorie_restaurant = data.categorie_restaurant;
        this.id = data.id;
        this.date_reception = data.date_reception;
        this.dlc = data.dlc;
        this.etapes = data.etapes;
        this.ingredients = data.ingredients;
        this.consommables = data.consommables;
        this.marge = data.marge;
        this.material_cost = data.material_cost;
        this.portions = data.portions;
        this.prime_cost = data.prime_cost;
        this.quantity = data.quantity;
        this.quantity_after_prep = data.quantity_after_prep;
        this.quantity_bef_prep = data.quantity_bef_prep;
        this.total_quantity = data.total_quantity;
        this.cost = data.cost;
        this.id = data.id;
        this.val_bouch = data.val_bouch;
        this.quantity_unity = data.quantity_unity;
        this.temps = data.temps;
        this.is_stock = data.is_stock;
        this.is_similar = data.is_similar;
      }
    convertToBase():CpreparationBase{
        let preparation = new CpreparationBase();
        preparation.consommables = this.consommables;
        preparation.ingredients = this.ingredients;
        preparation.portions = this.portions;
        preparation.nom = this.nom;
        preparation.id_preparation = this.id;
        preparation.id = null;
        preparation.val_bouch = null;
        preparation.unity = null;
        preparation.material_cost = null;
        preparation.prime_cost = null;
        preparation.quantity = null;
        preparation.quantity_unity = null;
        preparation.quantity_bef_prep = null;
        preparation.quantity_after_prep = null;
        preparation.etapes = null;
        preparation.temps = null
        return preparation;
    }  
}

export class CpreparationBase{
    "nom":string | null;
    "portions":number;
    "ingredients":Array<TIngredientBase>;
    "consommables":Array<TConsoBase>;
    "etapes":Array<Etape> | null;
    "temps":number | null;
    "quantity": number | null;
    "quantity_unity": number | null;
    "unity": string | null;
    "val_bouch": number | null;
    "prime_cost":number | null;
    "material_cost":number | null;
    "quantity_bef_prep": number | null;
    "quantity_after_prep": number | null;
    "id_preparation":string;
    "id": string | null;
} 