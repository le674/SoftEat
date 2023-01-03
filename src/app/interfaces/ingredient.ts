import { Injectable } from "@angular/core";
import { IngredientsInteractionService } from "../services/menus/ingredients-interaction.service";
import { CalculService } from "../services/menus/menu.calcul/menu.calcul.ingredients/calcul.service";

export interface Ingredient {
    "nom": string;
    "categorie_restaurant": string;
    "categorie_tva": string;
    "taux_tva": number;
    "categorie_dico": string;
    "cost": number;
    "quantity": number;
    "quantity_unity": number;
    "unity": string;
    "date_reception":Date;
    "dlc": Date;
    "cost_ttc": number;
    "val_bouch": number;
    "conditionnement": boolean;
    "refrigiree": boolean;
    "gelee": boolean;
    "base_ing":Array<string>;


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
    setQuantityAfterPrep(quantity: number | null): void;
    getQuantityAfterPrep(): number;
    setQuantityBefPrep(quantity: number | null): void;
    getQuantityBefPrep(): number;
    getUnity(): string;
    setUnity(unity: string | null): void;
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
    getBaseIng(): Array<string>;
    setBaseIng(names: Array<string> | null): void;

}

export interface Consommable {
    "nom": string;
    "cost": number;
    "quantity": number;
    "quantity_unity": number;
    "unity": string;

    getNom(): string;
    setNom(nom: string | null): void;
    getCost(): number;
    setCost(cost: number | null): void;
    getQuantity(): number;
    setQuantity(quantity: number | null): void;
    getQuantityUnity(): number;
    setQuantityUniy(quantity: number | null): void;
    getUnity(): string;
    setUnity(unity: string | null): void;
}

@Injectable({
    providedIn: 'root'
})
export class CIngredient implements Ingredient {
    "nom": string;
    "categorie_restaurant": string;
    "categorie_tva": string;
    "taux_tva": number;
    "categorie_dico": string;
    "cost": number;
    "quantity": number;
    "quantity_unity": number;
    "unity": string;
    "date_reception":Date;
    "dlc": Date;
    "cost_ttc": number;
    "conditionnement": boolean;
    "refrigiree": boolean;
    "gelee": boolean;
    "base_ing":Array<string>;
    "quantity_bef_prep": number;
    "quantity_after_prep": number;
    "val_bouch": number;
    "is_similar":number;

    constructor(private service: CalculService, private db_service: IngredientsInteractionService) {
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
        this.categorie_dico = "";
        this.dlc = new Date();
        this.date_reception = new Date()
        this.cost_ttc = 0;
        this.val_bouch = 0;
        this.quantity_bef_prep = 0;
        this.quantity_after_prep = 0;
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

        console.log("dlc :", this.dlc);
        
        this.dlc.setHours(this.date_reception.getHours() + 24*Pingredient.dlc);
        this.gelee = Pingredient.gelee;
        this.refrigiree = Pingredient.refrigiree;

        return this
    }


    getCostTtcFromCat(): void {
        this.cost_ttc = this.service.getCostTtcFromCat(this.categorie_tva, this.cost);
    }

    getCostTtcFromTaux():void{
        this.cost_ttc = this.service.getCostTtcFromTaux(this.taux_tva, this.cost)
    }

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

    setQuantityAfterPrep(quantity: number | null): void {
        if (quantity !== null) this.quantity_after_prep = quantity;
    }
    getQuantityAfterPrep(): number {
        return this.quantity_after_prep;
    }
    setQuantityBefPrep(quantity: number | null): void {
        if (quantity !== null) this.quantity_bef_prep = quantity;
    }
    getQuantityBefPrep(): number {
        return this.quantity_bef_prep;
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

    getBaseIng(): Array<string> {
        return this.base_ing;
    }
    setBaseIng(names: Array<string> | null): void {
        if (names !== null) this.base_ing= names;
    }
}


export class Cconsommable implements Consommable {
    "quantity_unity": number;
    "nom": string;
    "cost": number;
    "quantity": number;
    "unity": string;

    constructor() { }

    getNom(): string {
        return this.nom
    }
    setNom(nom: string | null): void {
        if (nom !== null) this.nom = nom;
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
}

