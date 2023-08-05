import { TextItem } from "pdfjs-dist/types/src/display/api"
import { TextShared } from "./text"

export interface FactureColumns {
    name: Array<string>;
    description: Array<string>;
    price: Array<string>;
    quantity: Array<string>;
    tva: Array<string>;
}

export interface FactureColumnsPdf {
    name: Array<string>;
    description: Array<string>;
    price: Array<string>;
    quantity: Array<string>;
    tva: Array<string>;
    total: Array<string>;
}

export interface FactureColumnsFull {
    name: TextShared[];
    description?: TextShared[];
    price: TextShared[];
    quantity: TextShared[];
    tva?: TextShared[];
    total?: TextShared[];
}

export interface FacturePivotsFull {
    name: TextShared;
    description?: TextShared;
    price: TextShared;
    quantity: TextShared;
    tva?: TextShared;
    total?: TextShared;
}


export interface FacturePivotsFullPdf {
    name: TextItem;
    description?: TextItem;
    price: TextItem;
    quantity: TextItem;
    tva?: TextItem;
    total?: TextItem
}

export interface FacturePrintedResult {
    name: string;
    description?: string | undefined;
    price: number;
    quantity: number;
    tva?: number | undefined;
    total?: number | undefined;
}

export class Facture{
    date_reception:string;
    day:number;
    month:number;
    year:number;
    is_read:boolean;
    extension:string | null;
    id:string | null;
    restaurant_id:string | null;
    path:string | null;
    name:string;

    constructor(date_reception:string, is_read:boolean | null){
        if(is_read === null) is_read = false;
        if(date_reception === null){
            this.date_reception = new Date().toISOString();
        }
        else{
            this.date_reception = date_reception;
        }
        const curr_date = new Date(date_reception);
        this.day = curr_date.getDay();
        this.month = curr_date.getMonth();
        this.year = curr_date.getFullYear();
        this.is_read = is_read;
        this.restaurant_id = null;
        this.extension = null;
        this.id = null;
        this.path = null;
        this.name = "";
    }
    /**
     * Cette fonction permet de copier un objet facture dans une instance de facture
     * @param facture JSON facture obtenu depuis la base de donnée que l'on copie dans une instance de Facture
     */
    setData(facture:Facture){
        this.date_reception = facture.date_reception;
        this.day = facture.day;
        this.month = facture.month;
        this.year = facture.year; 
        this.extension = facture.extension;
        this.is_read = facture.is_read;
        this.id = facture.id;
        this.restaurant_id = facture.restaurant_id;
        this.path = facture.path;
        this.name = facture.name;
    }
    /**
     * Cette fonction permet de récupérer l'objet facture sous forme d'un JSON 
     * @returns JSON constituant l'objet facture
     */
    getData(){
        return {
            date_reception: this.date_reception,
            day: this.day,
            month: this.month,
            year: this.year,
            extension: this.extension,
            is_read: this.is_read,
            id: this.id,
            restaurants_id: this.restaurant_id, 
            path: this.path,
            name:this.name
        }
    }
    /**
     * permet de construire le chemin vers storage de la facture
     * @param prop_id identifiant du propriétaire qui possède la facture
     */
    public creatPath(prop_id:string | null){
        const month_full = this.monthMapping(this.month);
        if(prop_id !== null && this.id !== null){
            this.path = "factures/" + prop_id + "/" + this.year.toString() + '/' + month_full
            return true;
        }
        return false;
    }

    /**
     * Cette fonction permet de récupérer l'ensemble des extensions possibles pour les documents
    */
    public static getExtension():Array<string>{
        return ["pdf", "png", "jpeg", "jpg"];
    }
    /**
     * permet de mapper les mois de l'année sous forme numérique avec des chaines de caractères 
     * @param month_number indice du mois pour lequel nous vounlons récupérer la version literral de celui-ci
     * @returns {string} mois sous forme littéral par rapprt au mois passé en argument
    */
    public monthMapping(month_number:number):string{
        const _months=  ["janvier", "fevrier", "mars", "avril", "mai", "juin", "juillet", "aout", "septembre", "octobre", "decembre"];
        return _months[month_number];
    }
}