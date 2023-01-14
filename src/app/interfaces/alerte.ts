export interface Alerte {
    from:string;
    to:string
    label:string
    read:boolean
    response:Alerte | "" 


}

export class CAlerte implements Alerte{
    from: string
    to: string
    label: string
    read: boolean
    response: "" | Alerte


    constructor(){
        this.from = "";
        this.to = "";
        this.label = "";
        this.read = false;
        this.response = "";
    }
    
}