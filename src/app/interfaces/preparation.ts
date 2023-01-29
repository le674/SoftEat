import { IngredientsInteractionService } from "../services/menus/ingredients-interaction.service";
import { CalculService } from "../services/menus/menu.calcul/menu.calcul.ingredients/calcul.service";
import { Etape } from "./etape";
import { Consommable, Ingredient } from "./ingredient";


export interface Preparation {    
    "nom":string | null;
    "categorie_restaurant": string;
    "categorie_tva": string;
    "taux_tva": number;
    "portions":number;
    "ingredients":Array<Ingredient>;
    "consommables":Array<Consommable>;
    "etapes":Array<Etape>;
    "temps":number;
    "cost": number;
    "quantity": number;
    "quantity_unity": number;
    "unity": string;
    "cost_ttc": number;
    "val_bouch": number;
    "base_ing":Array<{
        name:string,
        quantity:number,
        quantity_unity: number,
        unity: string,
        cost:number,
        vrac:boolean
    }>;
    "quantity_bef_prep": number;
    "quantity_after_prep": number;
    "is_similar":number;
    "marge": number;
    "vrac":boolean;
    "is_stock":boolean;
    "dlc":Date;
    "date_reception":Date;

    getNom():string | null;
    setNom(nom:string):void;
    getPortion():number;
    setPortions(portion:number):void;
    setIngredients(ingredients:Array<Ingredient>):void;
    getIngredients():Array<Ingredient>;
    setConsommbale(consommables:Array<Consommable>):void;
    getConsommbale():Array<Consommable>;
    getTime():number;
    setTime(time:number):void;
}

export class Cpreparation implements Preparation {
    "nom": string | null;
    "categorie_restaurant": string;
    "categorie_tva": string;
    "taux_tva": number;
    "cost": number;
    "quantity": number;
    "quantity_unity": number;
    "unity": string;
    "cost_ttc": number;
    "val_bouch": number;
    "base_ing": { name: string; quantity: number; quantity_unity: number; unity: string; cost: number; vrac: boolean; marge:number; }[];
    "marge": number;
    "vrac": boolean;
    "portions": number;
    "dlc": Date;
    "date_reception":Date;
    "ingredients": Ingredient[];
    "consommables": Consommable[];
    "etapes": Etape[];
    "temps":number;
    "quantity_bef_prep": number;
    "quantity_after_prep": number;
    "is_similar": number;
    "is_stock": boolean;

    constructor(private service: CalculService){
        this.consommables = [];
        this.etapes = []
        this.base_ing = [];
        this.nom = "";
        this.categorie_restaurant = "";
        this.categorie_tva = "";
        this.taux_tva = 0;
        this.cost = 0;
        this.quantity = 0;
        this.quantity_unity = 0;
        this.unity = "";
        this.categorie_tva = "";
        this.cost_ttc = 0;
        this.val_bouch = 0;
        this.quantity_bef_prep = 0;
        this.quantity_after_prep = 0;
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
    setIngredients(ingredients: Ingredient[]): void {
        this.ingredients = ingredients
    }
    getIngredients(): Ingredient[] {
        return this.ingredients
    }
    setConsommbale(consommables: Consommable[]): void {
        this.consommables = consommables;
    }
    getConsommbale(): Consommable[] {
       return this.consommables
    }
    getTime(): number {
        return this.temps;
    }
    setTime(time: number): void {
        this.temps = time;
    }
    getCostTtcFromCat(): void {
        this.cost_ttc = this.service.getCostTtcFromCat(this.categorie_tva, this.cost);
    } 

    getCostTtcFromTaux():void{
        this.cost_ttc = this.service.getCostTtcFromTaux(this.taux_tva, this.cost)
    }   

}