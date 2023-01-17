import { Etape } from "./etape";
import { Consommable, Ingredient } from "./ingredient";
import { Preparation } from "./preparation";

export interface Plat{
    /* dessert, entrée, plat */
    "type":string
    /* categorie associé à la tva
     5.5% Pain/ viennoiseries et pâtisseries,   Glaces conditionnées , Boissons non alcooliques vendues permettant leur conservation,  fruits de mers coquillage fermé
     10% Glaces non conditionnées, Sandwiches / salades couverts, fruits de mers coquillage ouvert, boissons non alcoolisées, plat/menu
     20% boissons alhcolisées
    */
    "categorie":string;
    "nom":string;
    "portions":number;
    "ingredients":Array<Ingredient>;
    "consommables":Array<Consommable>;
    "etapes":Array<Etape>;
    "preparations":Array<Preparation>;
    "prix":number;
    /* dépend de la catégorie appliquée*/
    "taux_tva":number;

    getType():string;
    setType(type:string):void;
    getCategorie():string;
    setCategorie(categorie:string):void;
    getNom():string;
    setNom(nom:string):void;
    getPortion():number;
    setPortions(portion:number):void;
    setIngredients(ingredients:Array<Ingredient>):void;
    getIngredients():Array<Ingredient>;
    setConsommbale(consommables:Array<Consommable>):void;
    getConsommbale():Array<Consommable>;
    getEtapes():Array<Etape>;
    setEtapes(etapes:Array<Etape>):void;
    getPreparations():Array<Preparation>;
    setPreparations(preparations:Array<Preparation>):void;
    setPrix(prix:number):void;
    getPrix():number;
    setTauxTva(tva:number):void;
    getTauxTva():number;
}

export class Cplat implements Plat{
    "type": string;
    "categorie": string;
    "nom": string;
    "portions": number;
    "ingredients": Ingredient[];
    "consommables": Consommable[];
    "etapes": Etape[];
    "preparations": Preparation[];
    "prix": number;
    "taux_tva": number;
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
    getType(): string {
        return this.type;
    }
    setType(type: string): void {
        this.type = type;
    }
    getCategorie(): string {
       return this.categorie;
    }
    setCategorie(categorie: string): void {
       this.categorie = categorie;
    }
   
    getEtapes(): Etape[] {
       return this.etapes;
    }
    setEtapes(etapes: Etape[]): void {
        this.etapes = etapes;
    }
    getPreparations(): Preparation[] {
        return this.preparations;
    }
    setPreparations(preparations: Preparation[]): void {
        this.preparations = preparations;
    }
    setPrix(prix: number): void {
        this.prix = prix;
    }
    getPrix(): number {
       return this.prix;
    }
    setTauxTva(tva: number): void {
       this.taux_tva = tva;
    }
    getTauxTva(): number {
        return this.taux_tva;
    }

}