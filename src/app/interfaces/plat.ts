import {TConsoBase} from "./consommable";
import {Etape} from "./etape";
import {TIngredientBase} from "./ingredient";
import {CpreparationBase} from "./preparation";

export interface Plat{
    "unity":string;
    /* dessert, entrée, plat */
    "type":string
    /* categorie associé à la tva
     5.5% Pain/ viennoiseries et pâtisseries,   Glaces conditionnées , Boissons non alcooliques vendues permettant leur conservation,  fruits de mers coquillage fermé
     10% Glaces non conditionnées, Sandwiches / salades couverts, fruits de mers coquillage ouvert, boissons non alcoolisées, plat/menu
     20% boissons alhcolisées
    */
    "categorie":string
    "nom":string;
    "portions":number;
    "ingredients":Array<TIngredientBase>;
    "consommables":Array<TConsoBase>;
    "etapes":Array<Etape>;
    "preparations":Array<CpreparationBase>;
    "prix":number;
    /* dépend de la catégorie appliquée*/
    "taux_tva":number;
    "prime_cost":number;
    "material_cost":number;
    "portion_cost":number;
    "material_ratio":number;
    "temps":number;

    getType():string;
    setType(type:string):void;
    getNom():string;
    setNom(nom:string):void;
    getPortion():number;
    setPortions(portion:number):void;
    setIngredients(ingredients:Array<TIngredientBase>):void;
    getIngredients():Array<TIngredientBase>;
    setConsommbale(consommables:Array<TConsoBase>):void;
    getConsommbale():Array<TConsoBase>;
    getEtapes():Array<Etape>;
    setEtapes(etapes:Array<Etape>):void;
    getPreparations():Array<CpreparationBase>;
    setPreparations(preparations:Array<CpreparationBase>):void;
    setPrix(prix:number):void;
    getPrix():number;
    setTauxTva(tva:number):void;
    getTauxTva():number;
    getUnity():string;
    setUnity(unity:string):void;
}

export class Cplat implements Plat{
    "unity": string;
    "type": string;
    "categorie": string;
    "nom": string;
    "portions": number;
    "ingredients": TIngredientBase[];
    "consommables": TConsoBase[];
    "etapes": Etape[];
    "preparations": CpreparationBase[];
    "prix": number;
    "taux_tva": number;
    "prime_cost": number;
    "material_cost": number;
    "portion_cost": number;
    "material_ratio": number;
    "temps":number;

    constructor(){
        this.unity = '';
        this.type = '';
        this.categorie = '';
        this.nom = '';
        this.portions = 0;
        this.prix = 0;
        this.taux_tva = 0;
        this.material_cost = 0;
        this.portion_cost = 0;
        this.material_ratio = 0;
        this.prime_cost = 0;
        this.temps = 0;
        this.ingredients = [];
        this.consommables = [];
        this.etapes = [];

    }


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
    setCategorie(categorie: string) {
       this.categorie = categorie;
    }
    getCategorie(categorie: string) {
        return categorie;
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
    getType(): string {
        return this.type;
    }
    setType(type: string): void {
        this.type = type;
    }
   
    getEtapes(): Etape[] {
       return this.etapes;
    }
    setEtapes(etapes: Etape[]): void {
        this.etapes = etapes;
    }
    getPreparations(): CpreparationBase[] {
        return this.preparations;
    }
    setPreparations(preparations: CpreparationBase[]): void {
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
    getUnity(): string {
        return this.unity;
    }
    setUnity(unity: string): void {
       this.unity = unity;
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