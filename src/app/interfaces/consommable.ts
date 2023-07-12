import { RowConsommableRecette } from "./recette";

export class TConsoBase {
    name:string;
    quantity:number | null;
    unity:string | null;
    cost:number | null;
    id_consommable:string | null;
    constructor(name:string, quantity:number, unity:string){
        this.name = name;
        this.quantity = quantity;
        this.unity = unity;
        this.cost = null;
        this.id_consommable = null;
    }
    toRowConsoRecette(): RowConsommableRecette {
        let consommable = new RowConsommableRecette(this.name, this.cost, this.quantity,this.unity);
        return consommable;
    }
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
    "id":string;
    
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
    convertToBase():TConsoBase {
        let consommable = new TConsoBase(this.name, this.quantity, this.unity);
        consommable.id_consommable = this.id;
        return consommable;
    }
}

