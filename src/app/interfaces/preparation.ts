import { Etape } from "./etape";
import { Consommable, Ingredient } from "./ingredient";

export interface Preparation {    
    "nom":string;
    "portions":number;
    "ingredients":Array<Ingredient>
    "consommables":Array<Consommable>
    "etapes":Array<Etape>

    getNom():string;
    setNom(nom:string):void;
    getPortion():number;
    setPortions(portion:number):void;
    setIngredients(ingredients:Array<Ingredient>):void;
    getIngredients():Array<Ingredient>;
    setConsommbale(consommables:Array<Consommable>):void;
    getConsommbale():Array<Consommable>;
}

export class Cpreparation implements Preparation {
    "nom": string;
    "portions": number;
    "ingredients": Ingredient[];
    "consommables": Consommable[];
    "etapes": Etape[];
    getNom(): string {
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

}