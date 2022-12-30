import { Injectable } from "@angular/core";
import { IngredientsInteractionService } from "../services/menus/ingredients-interaction.service";
import { CalculService } from "../services/menus/menu.calcul/menu.calcul.ingredients/calcul.service";

export interface Ingredient {
    "nom": string;
    "categorie_restaurant": string;
    "categorie_tva": string;
    "categorie_dico": string;
    "cost": number;
    "quantity": number;
    "quantity_unity": number;
    "unity": string;
    "dlc": Date;
    "cost_ttc": number;
    "val_bouch": number;
    "conditionnement": boolean;
    "refrigiree": boolean;
    "gelee": boolean;

    getInfoDico(): void;
    getValBouchFromNewQauntity(quantity_unity: number): CIngredient;
    getCostTtcFromCat(): void;

    getNom(): string;
    setNom(nom: string | null): void;
    getCategorieRestaurant(): string;
    setCategorieRestaurant(categorie: string | null): void;
    getCategorieTva(): string;
    setCategorieTva(categorie: string | null): void;
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
    getCostTtc(): number;
    setCostTtc(val: number | null): void;
    getRefrigiree(): boolean;
    setRefrigiree(val: boolean | null): void;
    getCondition(): boolean;
    setCondition(val: boolean | null): void;
    getGel(): boolean;
    setGel(val: boolean | null): void;

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
    "categorie_dico": string;
    "cost": number;
    "quantity": number;
    "quantity_unity": number;
    "unity": string;
    "dlc": Date;
    "cost_ttc": number;
    "conditionnement": boolean;
    "refrigiree": boolean;
    "gelee": boolean;
    "quantity_bef_prep": number;
    "quantity_after_prep": number;
    "val_bouch": number;

    constructor(private service: CalculService, private db_service: IngredientsInteractionService) {
        this.nom = "";
        this.categorie_restaurant = "";
        this.categorie_tva = "";
        this.cost = 0;
        this.quantity = 0;
        this.quantity_unity = 0;
        this.unity = "";
        this.categorie_tva = "";
        this.categorie_dico = "";
        this.dlc = new Date();
        this.cost_ttc = 0;
        this.val_bouch = 0;
        this.quantity_bef_prep = 0;
        this.quantity_after_prep = 0;
    }

    getValBouchFromNewQauntity() {
        let ingredient = new CIngredient(this.service, this.db_service);
        ingredient = this;
        ingredient.val_bouch = this.service.getValBouchFromBasIng(this, this.quantity_after_prep);
        return ingredient;
    }

    async getInfoDico(): Promise<CIngredient> {
        const Pingredient =  this.db_service.getInfoIngFromDico(this.nom)
        await Pingredient.then((ingredient) => {
            this.categorie_dico = ingredient.categorie_dico;
            this.conditionnement = ingredient.conditionnement;
            // on réecrit la catégori en onction du conditionnement important pour le calcul de tva 
            this.categorie_tva = this.service.getTvaCategorieFromConditionnement(ingredient.categorie_tva, ingredient.conditionnement);
            this.dlc = ingredient.dlc;
            this.gelee = ingredient.gelee;
            this.refrigiree = ingredient.refrigiree;
        })
        return this
    }


    getCostTtcFromCat(): void {
        this.cost_ttc = this.service.getCostTtcFromCat(this.categorie_tva, this.cost);
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

