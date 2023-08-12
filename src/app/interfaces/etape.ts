export interface Etape {
    getData(): any;
    "name":string;
    "commentary":string | null;
    "time":number;

    getNom():string;
    setNom(nom:string):void;
    getComentaire():string | null;
    setComentaire(commentaire:string | null):void;
    getTemps():number;
    setTemps(temps:number):void;
}

export class Cetape implements Etape{
    "name": string;
    "commentary": string | null;
    "time": number;

    constructor(){
        this.name = "";
        this.commentary = "";
        this.time = 0;
    }
    /**
     * permet de retourner un json de l'objet Cetape
     * @returns {Object} json qui représente l'objet Cetape
     */
    getData() {
        return {
            name: this.name,
            commentary: this.commentary,
            time: this.time
        }
    }
    /**
     * Permet de copier un objet Cetape dans cette instance de la classe
     * @param objet etape que l'on copie dans cette instance
     * @returns {void}
     */
    setData(etape:Cetape){
        this.name = etape.name;
        this.commentary = etape.commentary;
        this.time = etape.time;
    }
    getNom(): string {
        return this.name
    }
    setNom(nom: string): void {
        this.name = nom
    }
    getComentaire(): string | null{
        return this.commentary;
    }
    setComentaire(commentaire: string): void {
       this.commentary = commentaire
    }
    getTemps(): number {
      return this.time
    }
    setTemps(temps: number): void {
        this.time = temps
    }

}