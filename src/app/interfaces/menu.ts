import { Etape } from "./etape";
import { Consommable, TIngredientBase } from "./ingredient";
import { Plat } from "./plat";

export interface Menu{
    /* on ventile lorsque l'on a une boisson alcholisée dans le menu pour réduire le taux, pareil lorsque on peut bénéficier de taux réduit 
    par example si il y'a du pain dans le menu */
    "nom":string;
    "taux_tva":number;
    "prix":number;
    "prix_ttc":number;
    "consommables":Array<Consommable>;
    "ingredients":Array<TIngredientBase>;
    "etapes":Array<Etape>;
    "plats":Array<Plat>;


    getNom():string;
    setNom(nom:string):void;
    setPrix(prix:number):void;
    getPrix():number;
    setPrixTtc(prix:number):void;
    getPrixTtc():number;
    setTauxTva(tva:number):void;
    getTauxTva():number;
    setIngredients(ingredients:Array<TIngredientBase>):void;
    getIngredients():Array<TIngredientBase>;
    setConsommbale(consommables:Array<Consommable>):void;
    getConsommbale():Array<Consommable>;
    getEtapes():Array<Etape>;
    setEtapes(etapes:Array<Etape>):void;
    setPlats(ingredients:Array<Plat>):void;
    getPlats():Array<Plat>;
}

export class Cmenu implements Menu{
    "nom":string;
    "taux_tva": number;
    "prix": number;
    "prix_ttc":number;
    "consommables": Consommable[];
    "ingredients": TIngredientBase[];
    "etapes": Etape[];
    "plats": Plat[];
    
    getNom(): string {
        return this.nom
    }
    setNom(nom: string): void {
        this.nom = nom
    }
    getEtapes(): Etape[] {
        return this.etapes;
     }
     setEtapes(etapes: Etape[]): void {
         this.etapes = etapes;
     }
     setPrix(prix: number): void {
         this.prix = prix;
     }
     getPrix(): number {
        return this.prix;
     }
     setPrixTtc(prix: number): void {
        this.prix_ttc = prix;
    }
     getPrixTtc(): number {
       return this.prix_ttc;
    }
     setTauxTva(tva: number): void {
        this.taux_tva = tva;
     }
     getTauxTva(): number {
         return this.taux_tva;
     }
     setIngredients(ingredients: TIngredientBase[]): void {
        this.ingredients = ingredients
    }
    getIngredients(): TIngredientBase[] {
        return this.ingredients
    }
    setPlats(plats: Plat[]): void {
        this.plats = plats
    }
    getPlats():Plat[] {
        return this.plats
    }
    setConsommbale(consommables: Consommable[]): void {
        this.consommables = consommables;
    }
    getConsommbale(): Consommable[] {
       return this.consommables
    }
}

// les classes TMP servent de classe tampon pour les classes principales  
export class TMPmenu {
    "ingredients": Array<{id:string, quantity:number, unity:string}>
    "plats": Array<{id:string, quantity:number, unity:string}>
    "etapes": Array<{id:string,commentaire:string, temps:number}>

    setPlats(plats: Array<{id:string, quantity:number, unity:string}>){
        this.plats = plats;
    }
    getPlats(){
        return this.plats;
    }

    setIngredients(ingredients: Array<{id:string, quantity:number, unity:string}>){
        this.ingredients = ingredients;
    }
    getIngredients(){
        return this.ingredients;
    }
    setEtapes(etapes: Array<{id:string,commentaire:string, temps:number}>){
        this.etapes = etapes;
    }
    getEtapes(){
        return this.etapes
    }

}