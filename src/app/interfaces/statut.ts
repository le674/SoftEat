export class Statut {
    is_prop:boolean
    stock:string
    analyse:string
    budget:string
    facture:string
    planning:string

    constructor(){
        this.is_prop = false;
        this.stock = "";
        this.analyse = "";
        this.budget = "";
        this.facture = "";
        this.planning = "";
    }
}