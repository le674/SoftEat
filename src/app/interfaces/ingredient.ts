import { Injectable } from "@angular/core";
import { IngredientsInteractionService } from "../services/menus/ingredients-interaction.service";
import { CalculService } from "../services/menus/menu.calcul/menu.calcul.ingredients/calcul.service";
import { Cetape } from "./etape";

export type TIngredientBase = {
    name: string, 
    quantity: number, 
    quantity_unity:number ,
    unity:string, 
    unity_unitary: string,
    cost:number,
    material_cost:number,
    vrac:string,
    taux_tva:number, 
    marge:number,
    supp:boolean

}

export type TConsoBase = {
    name:string,
    quantity:number,
    unity:string,
    cost:number
}


export interface Ingredient {
    "nom": string;
    "categorie_restaurant": string;
    "categorie_tva": string;
    "taux_tva": number;
    "categorie_dico": string;
    "cost": number;
    "quantity": number;
    "quantity_unity": number;
    "total_quantity": number;
    "unity": string;
    "unity_unitary":string;
    "date_reception":Date;
    "dlc": Date;
    "cost_ttc": number;
    "conditionnement": boolean;
    "refrigiree": boolean;
    "gelee": boolean;
    "marge": number;
    "vrac":string;

    getInfoDico(): void;
/*     getValBouchFromNewQauntity(quantity_unity: number): CIngredient; */
    getCostTtcFromCat(): void;
    getNom(): string;
    setNom(nom: string | null): void;
    getCategorieRestaurant(): string;
    setCategorieRestaurant(categorie: string | null): void;
    getCategorieTva(): string;
    setCategorieTva(categorie: string | null): void;
    getTauxTva(): number;
    setTauxTva(taux: number | null): void;
    getCategorieDico(): string;
    setCategorieDico(categorie: string | null): void;
    getCost(): number;
    setCost(cost: number | null): void;
    getQuantity(): number;
    setQuantity(quantity: number | null): void;
    getQuantityUnity(): number;
    setQuantityUniy(quantity: number | null): void;
    getUnity(): string;
    setUnity(unity: string | null): void;
    getUnityUnitary():string;
    setUnityUnitary(unity: string | null):void;
    getDlc(): Date;
    setDlc(val: Date | null): void;
    getDateReception(): Date;
    setDateReception(val: Date | null): void;
    getCostTtc(): number;
    setCostTtc(val: number | null): void;
    getRefrigiree(): boolean;
    setRefrigiree(val: boolean | null): void;
    getCondition(): boolean;
    setCondition(val: boolean | null): void;
    getGel(): boolean;
    setGel(val: boolean | null): void;
    getMarge():number;
    setMarge(marge:number):void;
    getVrac():string;
    setVrac(is_vrac:string):void;

}

export interface Consommable {
    [x: string]: any;
    "name": string;
    "cost": number;
    "quantity": number;
    "unity": string;
    "taux_tva": number;
    "cost_ttc": number;
    "marge": number;
    "date_reception":Date;
    "total_quantity":number;

    getNom(): string;
    setNom(nom: string | null): void;
    getCost(): number;
    setCost(cost: number | null): void;
    getCostTTC(): number;
    setCostTTC(cost: number | null): void;
    getTotalQuantity():number;
    setTotalQuantity(quantity:number):void;
    getTotalQuantity():number;
    getTauxTva(): number;
    setTauxTva(taux: number | null): void;
    getQuantity(): number;
    setQuantity(quantity: number | null): void;
    getUnity(): string;
    setUnity(unity: string | null): void;
    getDateReception():Date;
    setDateReception(val: Date | null):void;
    getMarge():number;
    setMarge(marge:number):void;
}

@Injectable({
    providedIn: 'root'
})
/**
 * @class ingrédient dan la base de donnée 
 * @argument nom nom de l'ingrédient
 * @argument categorie_restaurant catégorie dans lequel le restaurant souhaite ranger l'ingrédient pour le suivie des coûts
 * @argument taux_tva taux de tva à appliquer à 'lingrédient
 * @argument categorie_dico catégorie de dictionnaire dans lequel ont souhaite ranger l'ingrédient
 * @argument cost coût de l'ingrédient
 * @argument quantity nombre de pack d'ingrédient 1 si vrac
 * @argument quantity_unity quantitée pour un pack 
 * @argument total_quantity quantitée total une fois réapprovisionnement afin de contrôler les marges
 * @argument unity unitée de vente du produit ex. huile -> litre
 * @argument unity_unitary cette unitée est utilisez pour les préparation par ex. huile -> c.s
 * @argument date_reception date de récéption de l'aliment 
 * @argument dlc date limite de consommation de l'aliment
 * @argument cost_ttc coût toutes taxes comprisent
 * @argument conditionnement actuellement non utilisé
 * @argument refrigiree actuellement non utilisé
 * @argument gelee actuellement non utilisé
 * @argument marge marge présent sur total_quantity une fois que la quantitée est inférieur à la marge ont prévient le restaurateur d'un problème de stock
 * @argument vrac est ce que l'aliment est en vrac ou non 
 */
export class CIngredient implements Ingredient {
    "nom": string;
    "categorie_restaurant": string;
    "categorie_tva": string;
    "taux_tva": number;
    "categorie_dico": string;
    "cost": number;
    "quantity": number;
    "quantity_unity": number;
    "total_quantity": number;
    "unity": string;
    "unity_unitary":string;
    "date_reception":Date;
    "dlc": Date;
    "cost_ttc": number;
    "conditionnement": boolean;
    "refrigiree": boolean;
    "gelee": boolean;
    "is_similar":number;
    "marge": number;
    "vrac": string;
    constructor(private service: CalculService, private db_service: IngredientsInteractionService) {
        this.nom = "";
        this.categorie_restaurant = "";
        this.categorie_tva = "";
        this.taux_tva = 0;
        this.cost = 0;
        this.quantity = 0;
        this.quantity_unity = 0;
        this.unity = "";
        this.categorie_tva = "";
        this.categorie_dico = "";
        this.dlc = new Date();
        this.date_reception = new Date()
        this.cost_ttc = 0;
    }

  /*   getValBouchFromNewQauntity(quantity_unity: number): CIngredient {
        throw new Error("Method not implemented.");
    } */


    async getInfoDico(): Promise<CIngredient> {
        const Pingredient = await this.db_service.getInfoIngFromDico(this.nom);
        this.categorie_dico = Pingredient.categorie_dico;
        this.conditionnement = Pingredient.conditionnement;
        // on réecrit la catégori en onction du conditionnement important pour le calcul de tva
        if((this.categorie_tva=== "") || (this.categorie_tva === undefined)){
            this.categorie_tva = this.service.getTvaCategorieFromConditionnement(Pingredient.categorie_tva, Pingredient.conditionnement);
        }    
        if(typeof this.dlc !== "string"){
            this.dlc.setHours(this.date_reception.getHours() + 24*Pingredient.dlc);
        }
        else{
            this.dlc = new Date(this.dlc);
        }

        if(typeof this.date_reception === 'string'){
            this.date_reception = new Date(this.date_reception);
        }
        this.gelee = Pingredient.gelee;
        this.refrigiree = Pingredient.refrigiree;
        return this
    }

    /**
     * Permet de convertire un ingrédient en ingrédient_base qui contiennent moins d'information 
     * que les ingrédients et qui sont donc plus légées
     * @returns {TIngredientBase} une instance d'un ingrédient de base
     */
    convertToBase(): any {
        let ingredient:TIngredientBase = {
            name:this.nom,
            quantity: this.quantity,
            quantity_unity: this.quantity_unity,
            unity_unitary: this.unity_unitary,
            unity: this.unity,
            cost: this.cost, 
            material_cost: 0,
            vrac: this.vrac,
            taux_tva: this.taux_tva,
            marge: this.marge,
            supp: false
        };
        return ingredient
      }

    /**
     * permet de récupérer le cout ttc d'un ingrédient à partir de la catégorie de tva et du cout
     */
    getCostTtcFromCat(): void {
        this.cost_ttc = this.service.getCostTtcFromCat(this.categorie_tva, this.cost);
    } 

    /**
     * permet de récupérer le cout ttc d'un ingrédient à partir du taux de tva et du cout
    */
    getCostTtcFromTaux():void{
        this.cost_ttc = this.service.getCostTtcFromTaux(this.taux_tva, this.cost)
    }

    /**
     * permet de récupérer la date de récéption de l'ingrédient
    */
    getDateReception(): Date {
        return this.date_reception;
    }
    setDateReception(val: Date | null): void {
        if (val !== null) this.date_reception = val;
    }

    getDlc(): Date {
        return this.dlc
    }
    setDlc(val: Date | null): void {
        if (val !== null) this.dlc = val;
    }
    getCostTtc(): number {
        return this.cost_ttc
    }
    setCostTtc(val: number | null): void {
        if (val !== null) this.cost_ttc = val;
    }

    getNom(): string {
        return this.nom
    }
    setNom(nom: string | null): void {
        if (nom !== null) this.nom = nom
    }
    getCategorieRestaurant(): string {
        return this.categorie_restaurant
    }
    setCategorieRestaurant(categorie: string | null): void {
        if (categorie !== null) this.categorie_restaurant = categorie;
    }
    getCategorieTva(): string {
        return this.categorie_tva
    }
    setCategorieTva(categorie: string | null): void {
        if (categorie !== null) this.categorie_tva = categorie;
    }
    getTauxTva(): number {
        return this.taux_tva;
    }
    setTauxTva(taux: number | null): void {
        if (taux !== null) this.taux_tva = taux;
    }
    getCategorieDico(): string {
        return this.categorie_dico
    }
    setCategorieDico(categorie: string | null): void {
        if (categorie !== null) this.categorie_dico = categorie;
    }
    getCost(): number {
        return this.cost
    }
    setCost(cost: number | null): void {
        if (cost !== null) this.cost = cost
    }
    getQuantity(): number {
        return this.quantity
    }
    setQuantity(quantity: number | null): void {
        if (quantity !== null) this.quantity = quantity
    }

    getIsSimilar(): number {
        return this.is_similar
    }
    setIsSimilar(coeff: number | null): void {
        if (coeff !== null) this.is_similar = coeff
    }

    getQuantityUnity(): number {
        return this.quantity_unity
    }
    setQuantityUniy(quantity: number | null): void {
        if (quantity !== null) this.quantity_unity = quantity
    }
    getUnity(): string {
        return this.unity
    }
    setUnity(unity: string | null): void {
        if (unity !== null) this.unity = unity
    }

    getUnityUnitary(): string {
       return this.unity_unitary;
    }
    setUnityUnitary(unity: string | null): void {
        if(unity !== null) {
            this.unity_unitary = unity;
        }
        else{
            this.unity_unitary = "";
        }
    }

    getRefrigiree(): boolean {
        return this.refrigiree
    }
    setRefrigiree(val: boolean | null): void {
        if (val !== null) this.refrigiree = val;
    }
    getCondition(): boolean {
        return this.conditionnement
    }
    setCondition(val: boolean | null): void {
        if (val !== null) this.conditionnement = val;
    }
    getGel(): boolean {
        return this.gelee
    }
    setGel(val: boolean | null): void {
        if (val !== null) this.gelee = val;
    }

    
    getMarge(): number {
       return this.marge
    }
    setMarge(marge: number): void {
        this.marge = marge;
    }
    getVrac(): string {
        return this.vrac;
    }
    setVrac(is_vrac: string): void {
       this.vrac = is_vrac
    }
}


export class Cconsommable implements Consommable {
    "quantity": number;
    "total_quantity":number;
    "name": string;
    "cost": number;
    "unity": string;
    "taux_tva": number;
    "cost_ttc": number;
    "date_reception": Date;
    "marge": number;
    
    constructor() { 
    }

    getNom(): string {
        return this.name
    }
    setNom(nom: string | null): void {
        if (nom !== null) this.name = nom;
    }
    getCost(): number {
        return this.cost
    }
    setCost(cost: number | null): void {
        if (cost !== null) this.cost = cost
    }
    
    getCostTTC(): number {
        return this.cost_ttc
    }

    setCostTTC(cost: number | null): void {
        if (cost !== null) this.cost_ttc = cost
    }

    getTauxTva(): number {
        return this.taux_tva;
    }
    setTauxTva(taux: number | null): void {
        if (taux !== null) this.taux_tva = taux;
    }

    getQuantity(): number {
        return this.quantity
    }
    setQuantity(quantity: number | null): void {
        if (quantity !== null) this.quantity = quantity;
    }
    setTotalQuantity(quantity:number):void{
        this.total_quantity = quantity;
    }
    getTotalQuantity():number{
        return this.total_quantity;
    }
    getUnity(): string {
        return this.unity
    }
    setUnity(unity: string | null): void {
        if (unity !== null) this.unity = unity
    }
    getDateReception(): Date {
        return this.date_reception;
    }
    setDateReception(val: Date | null): void {
        if (val !== null) this.date_reception = val;
    }
    getMarge(): number {
       return this.marge;
    }
    setMarge(marge: number): void {
       this.marge = marge;
    }
}

