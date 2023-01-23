export interface Alerte {
    from:string;
    to:string
    label:string
    read:boolean
    response:Alerte | "" 
    categorie:string
    current: number

}

export class CAlerte implements Alerte{
    date:string
    from: string
    to: string
    label: string
    read: boolean
    response: "" | Alerte
    categorie: string;
    current: number;


    constructor(){
        this.from = "";
        this.to = "";
        this.label = "";
        this.read = false;
        this.response = "";
        this.date ="";
        this.categorie = "";
        this.current = 0;
    }
    
}