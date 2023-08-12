import { CalculService } from "../services/menus/menu.calcul/menu.calcul.ingredients/calcul.service";
import { RowConsommableRecette } from "./recette";

export class TConsoBase {
    name:string;
    quantity:number | null;
    unity:string | null;
    id:Array<string>;
    constructor(name:string, quantity:number | null, unity:string | null){
        this.name = name;
        this.quantity = quantity;
        this.unity = unity;
        this.id = [];
    }
    /**
     * convertion du consommable en ligne du tableau d'affichage des consommables de la section stock
     * @param cost cout du consommable
     * @returns {RowConsommableRecette} ligne de la section stock d'affichage des consommables
     */
    public toRowConsoRecette(cost:number): RowConsommableRecette {
        let consommable = new RowConsommableRecette(this.name, cost, this.quantity,this.unity);
        return consommable;
    }
    /**
     * permet à partir d'un conso de base de copier le consommable
     * @param consommable conso que l'on souhaite copier
     * @returns {void}
     */
    public setData(consommable:TConsoBase){
        this.id = consommable.id;
        this.name = consommable.name;
        this.quantity = consommable.quantity;
        this.unity = consommable.unity;
    }
    /**
     * retourne un consommable que l'on peut ajouter dans la base de donnée
     * @returns {TConsoBase} à ajouter dans la base de donnée
     */
    public getData():{name:string, quantity:number | null, unity:string | null, id:Array<string> | null}{
        return {
            name:this.name,
            quantity: this.quantity,
            unity: this.unity,
            id: this.id
        }
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
    "categorie_restaurant":string | null;
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
    "proprietary_id":string;
    
    constructor(private service: CalculService) { 
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
    /**
     * transformation du consommable pour le stock en consommable pour le recette
     * @returns {TConsoBase} consommable sous forme réduite pour la recette
     */
    convertToBase():TConsoBase {
        let consommable = new TConsoBase(this.name, this.quantity, this.unity);
        consommable.id?.push(this.id);
        return consommable;
    }

    /**
     * 
     * @param id identifiant du consommable dans la base de donnée
     * @param prop identifiant d" l'enseigne qui possède le consommable
     * @returns {void}
     */
    getData(id: string | null, prop: string): any {
        if((this.proprietary_id === null) || this.proprietary_id === undefined){
            this.proprietary_id = prop;
        }
        if(id !== null){
            this.id = id;
        }
        return {
            categorie_restaurant: this.categorie_restaurant,
            name: this.name,
            cost: this.cost,
            cost_ttc: this.cost_ttc,
            id: this.id,
            proprietary_id: this.proprietary_id,
            taux_tva: this.taux_tva,
            date_reception: this.date_reception.toLocaleString(),
            marge: this.marge,
            quantity: this.quantity,
            unity: this.unity,
            total_quantity: this.total_quantity,
         }
    }
    /**
     * cette fonction permet de construire un consommable à partir du JSON de la
     * base de donnée
     * @param data données à intégrer comme consommable
     */
    setData(data: Cconsommable | undefined){
        if(data !== undefined){
            this.categorie_restaurant = data.categorie_restaurant;
            this.id = data.id;
            this.proprietary_id = data.proprietary_id;
            this.marge = data.marge;
            this.unity = data.unity;
            this.name = data.name;
            this.categorie_restaurant = data.categorie_restaurant;
            this.quantity = data.quantity;
            this.total_quantity = data.total_quantity;
            this.cost = data.cost;
            this.taux_tva = data.taux_tva;
            this.cost_ttc = data.cost_ttc;
            if(typeof data.date_reception === "string"){
                const date_reception = this.service.stringToDate(data.date_reception);
                if(date_reception !== null){
                    this.date_reception = date_reception;
                }
                else{
                    this.date_reception = new Date();
                }
            }
        }
    }
}

