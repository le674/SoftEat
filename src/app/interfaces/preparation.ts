import { CalculService } from "../services/menus/menu.calcul/menu.calcul.ingredients/calcul.service";
import { TConsoBase } from "./consommable";
import { Etape } from "./etape";
import { TIngredientBase } from "./ingredient";


export interface AfterPreparation {
    "quantity": number;
    "unity": string
}

export interface Preparation {
    "name": string | null;
    "categorie_restaurant": string;
    "ingredients": Array<TIngredientBase> | null;
    "consommables": Array<TConsoBase> | null;
    "cost": number;
    "quantity": number;
    "quantity_unity": number;
    "total_quantity": number;
    "unity": string;
    "marge": number;
    "vrac": string;
    "dlc": Date;
    "date_reception": Date;
    "id": string;
    "proprietary_id": string;

    getNom(): string | null;
    setNom(nom: string): void;
    getPortion(): number;
    setPortions(portion: number): void;
    setIngredients(ingredients: Array<TIngredientBase> | null): void;
    getIngredients(): Array<TIngredientBase> | null;
    setConsommbale(consommables: Array<TConsoBase> | null): void;
    getConsommbale(): Array<TConsoBase> | null;
}

export class Cpreparation implements Preparation {
    "name": string;
    "categorie_restaurant": string;
    "etapes": Array<Etape> | null;
    "temps": number | null;
    "cost": number;
    "quantity": number;
    "quantity_unity": number;
    "total_quantity": number;
    "unity": string;
    "marge": number;
    "vrac": string;
    "portions": number;
    "dlc": Date;
    "date_reception": Date;
    "ingredients": TIngredientBase[] | null;
    "consommables": TConsoBase[] | null;
    "val_bouch": number | null;
    "prime_cost": number | null;
    "material_cost": number | null;
    "quantity_bef_prep": number | null;
    "quantity_after_prep": number | null;
    "is_similar": number;
    "is_stock": boolean;
    "id": string;
    "proprietary_id": string;

    constructor(private service: CalculService) {
        this.name = "";
        this.categorie_restaurant = "";
        this.etapes = null;
        this.temps = null;
        this.cost = 0;
        this.quantity = 0;
        this.quantity_unity = 0;
        this.total_quantity = 0;
        this.unity = "";
        this.marge = 0;
        this.vrac = "non";
        this.portions = 0;
        this.dlc = new Date();
        this.date_reception = new Date();
        this.ingredients = null;
        this.consommables = null;
        this.val_bouch = null;
        this.prime_cost = null;
        this.material_cost = null;
        this.quantity_after_prep = null;
        this.quantity_bef_prep = null;
        this.is_similar = 0;
        this.is_stock = true;
        this.id = "";
        this.proprietary_id = "";
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
        return this.name
    }
    setNom(name: string): void {
        this.name = name
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
    getIngredients(): TIngredientBase[] | null {
        return this.ingredients
    }
    setConsommbale(consommables: TConsoBase[]): void {
        this.consommables = consommables;
    }
    getConsommbale(): TConsoBase[] | null {
        return this.consommables
    }
    /**
     * Cette fonction permet dedupliquer une prépartion
     * @param data préparation à ajouter dans la base de donnée
     */
    setData(data: Cpreparation) {
        let ingredients = new Array<TIngredientBase>();
        let consommables = new Array<TConsoBase>();
        if (data.ingredients !== null && data.ingredients !== undefined) {
            ingredients = data.ingredients.map((ingredient) => {
                let _ingredient = new TIngredientBase(
                    ingredient.name,
                    ingredient.quantity,
                    ingredient.unity,
                );
                _ingredient.added_price = ingredient.added_price;
                _ingredient.id = ingredient.id;
                return _ingredient;
            });
        }
        if (data.consommables !== null && data.consommables !== undefined){
            consommables = data.consommables.map((consommable) => {
                let _consommable: TConsoBase = new TConsoBase(
                    consommable.name,
                    consommable.quantity,
                    consommable.unity
                )
                return _consommable;
            })
        }
        if(data.name !== undefined){
            this.name = data.name;
        }
        if(data.categorie_restaurant !== undefined){
            this.categorie_restaurant = data.categorie_restaurant;
        }
        if(data.id !== undefined){
            this.id = data.id;
        }
        if (typeof data.date_reception === "string") {
            const date_reception = this.service.stringToDate(data.date_reception);
            if (date_reception !== null) {
                this.date_reception = date_reception;
            }
            else {
                this.date_reception = new Date();
            }
        }
        else {
            if(data.date_reception !== undefined){
                this.date_reception = data.date_reception;
            }
        }
        if (typeof data.dlc === "string") {
            const dlc = this.service.stringToDate(data.dlc);
            if (dlc !== null) {
                this.dlc = dlc;
            }
            else {
                this.dlc = new Date();
            }
        }
        else {
            if(data.dlc !== undefined){
                this.dlc = data.dlc;
            }
        }
        if(data.etapes !== undefined){
            this.etapes = data.etapes;
        }
        if(data.ingredients !== undefined){
            for(let ingredient of ingredients){
                if(ingredient.added_price === undefined){
                    ingredient.added_price = null;
                }
                if(ingredient.id === undefined){
                    ingredient.id = "";
                }
                if(ingredient.name === undefined){
                    ingredient.name = "";
                }
                if(ingredient.quantity === undefined){
                    ingredient.quantity = null;
                }
                if(ingredient.unity === undefined){
                    ingredient.unity = null;
                }
            }
            this.ingredients = ingredients;
        }
        if(data.consommables !== undefined){
            for(let consommable of consommables){
                if(consommable.id === undefined){
                    consommable.id = null;
                } 
                if(consommable.name === undefined){
                    consommable.name = "";
                }
                if(consommable.quantity === undefined){
                    consommable.quantity = null;
                }
                if(consommable.unity === undefined){
                    consommable.unity = null;
                }
            }
            this.consommables = data.consommables;
        }
        if(data.marge !== undefined){
            this.marge = data.marge;
        }
        if(data.material_cost !== undefined){
            this.material_cost = data.material_cost;
        }
        if(data.portions !== undefined){
            this.portions = data.portions;
        }
        if(data.prime_cost !== undefined){
            this.prime_cost = data.prime_cost;
        }
        if(data.quantity !== undefined){
            this.quantity = data.quantity;
        }
        if(data.unity !== undefined){
            this.unity = data.unity;
        }
        if(data.quantity_after_prep !== undefined){
            this.quantity_after_prep = data.quantity_after_prep;
        }
        if(data.quantity_bef_prep !== undefined){
            this.quantity_bef_prep = data.quantity_bef_prep;
        }
        if(data.total_quantity !== undefined){
            this.total_quantity = data.total_quantity;
        }
        if(data.quantity_unity !== undefined){
            this.quantity_unity = data.quantity_unity;
        }
        if(data.cost !== undefined){
            this.cost = data.cost;
        }
        if(data.val_bouch !== undefined){
            this.val_bouch = data.val_bouch;
        }
        if(data.temps !== undefined){
            this.temps = data.temps;
        }
        if(data.is_stock !== undefined){
            this.is_stock = data.is_stock;
        }
        if(data.is_similar !== undefined){
            this.is_similar = data.is_similar;
        }
    }

    /**
     * permet de récupérer un objet constituant l'ingrédient à écrire en base de donnée
     * @param id identifiant du document que l'on souahite renvoyer pour l'ajout en base de donnée
     * @param prop identifiant du propriétaire 
    */
    getData(id: string | null, prop: string): any {
        let ingredients:null | Array<Object> = null;
        let consommables:null | Array<Object> = null;
        if((this.ingredients !== null) && (this.ingredients !== undefined)){
            ingredients = this.ingredients.map((ingredient) => ingredient.getData());
        }
        if((this.consommables !== null) && (this.ingredients !== undefined)){
            consommables = this.consommables?.map((consommable) => consommable.getData());
        }
        if ((this.proprietary_id === null) || this.proprietary_id === undefined) {
            this.proprietary_id = prop;
        }
        if (id !== null) {
            this.id = id;
        }
        return {
            name: this.name,
            categorie_restaurant: this.categorie_restaurant,
            etapes: this.etapes,
            temps: this.temps,
            cost: this.cost,
            quantity: this.quantity,
            quantity_unity: this.quantity_unity,
            total_quantity: this.total_quantity,
            unity: this.unity,
            marge: this.marge,
            vrac: this.vrac,
            portions: this.portions,
            dlc: this.dlc.toLocaleString(),
            date_reception: this.date_reception.toLocaleString(),
            ingredients: ingredients,
            consommables: consommables,
            val_bouch: this.val_bouch,
            prime_cost: this.prime_cost,
            material_cost: this.material_cost,
            quantity_bef_prep: this.quantity_bef_prep,
            quantity_after_prep: this.quantity_after_prep,
            is_similar: this.is_similar,
            is_stock: this.is_stock,
            proprietary_id: this.proprietary_id,
            id: this.id
        }
    }
    /**
     * Convertion de la préparation en préparation de base
     * @returns {CpreparationBase}
     */
    convertToBase(): CpreparationBase {
        let preparation = new CpreparationBase();
        preparation.portions = this.portions;
        preparation.name = this.name;
        preparation.id = null;
        return preparation;
    }
}

export class CpreparationBase {
    "name": string | null;
    "portions": number;
    "id": string | null;
    constructor() {}
} 