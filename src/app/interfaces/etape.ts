export interface Etape {
    "nom":string;
    "commentaire":string;
    "temps":number;

    getNom():string;
    setNom(nom:string):void;
    getComentaire():string;
    setComentaire(commentaire:string):void;
    getTemps():number;
    setTemps(temps:number):void;
}

export class Cetape implements Etape{
    "nom": string;
    "commentaire": string;
    "temps": number;
    getNom(): string {
        return this.nom
    }
    setNom(nom: string): void {
        this.nom = nom
    }
    getComentaire(): string {
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