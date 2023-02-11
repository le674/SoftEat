export interface Etape {
    "nom":string;
    "commentaire":string | null;
    "temps":number;

    getNom():string;
    setNom(nom:string):void;
    getComentaire():string | null;
    setComentaire(commentaire:string | null):void;
    getTemps():number;
    setTemps(temps:number):void;
}

export class Cetape implements Etape{
    "nom": string;
    "commentaire": string | null;
    "temps": number;

    constructor(){
        this.nom = "";
        this.commentaire = "";
        this.temps = 0;
    }

    getNom(): string {
        return this.nom
    }
    setNom(nom: string): void {
        this.nom = nom
    }
    getComentaire(): string | null{
        return this.commentaire;
    }
    setComentaire(commentaire: string): void {
       this.commentaire = commentaire
    }
    getTemps(): number {
      return this.temps
    }
    setTemps(temps: number): void {
        this.temps = temps
    }

}