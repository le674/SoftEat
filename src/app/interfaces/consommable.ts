import { CalculService } from "../services/menus/menu.calcul/menu.calcul.ingredients/calcul.service";
import { InteractionBddFirestore } from "./interaction_bdd";
import { RowConsommableRecette } from "./recette";

export class TConsoBase {
    name: string;
    quantity: number | null;
    unity: string | null;
    id: Array<string>;
    [index:string]:any;
    constructor(name: string, quantity: number | null, unity: string | null) {
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
    public toRowConsoRecette(cost: number): RowConsommableRecette {
        let consommable = new RowConsommableRecette(this.name, cost, this.quantity, this.unity);
        return consommable;
    }
    /**
     * permet à partir d'un conso de base de copier le consommable
     * @param consommable conso que l'on souhaite copier
     * @returns {void}
     */
    public setData(consommable: TConsoBase) {
        this.id = consommable.id;
        this.name = consommable.name;
        this.quantity = consommable.quantity;
        this.unity = consommable.unity;
    }
    /**
     * retourne un consommable que l'on peut ajouter dans la base de donnée
     * @returns {TConsoBase} à ajouter dans la base de donnée
     */
    public getData(id: string | null,attrs:Array<string> | null):any {
        let _attrs = Object.keys(this);
        let object:{[index:string]:any} = {};
        if(attrs){
            _attrs = attrs
        }
        for(let attr of _attrs){
            object[attr] = this[attr];
        }
        return object;
    }

}

export class Cconsommable implements InteractionBddFirestore {
    "categorie_restaurant": string | null;
    "quantity": number;
    "total_quantity": number;
    "name": string;
    "cost": number;
    "unity": string;
    "taux_tva": number;
    "cost_ttc": number;
    "date_reception": Date;
    "marge": number;
    "id": string;
    "proprietary_id": string;
    [x: string]: any;

    constructor(private service: CalculService) {
    }
    /**
     * transformation du consommable pour le stock en consommable pour le recette
     * @returns {TConsoBase} consommable sous forme réduite pour la recette
     */
    public convertToBase(): TConsoBase {
        let consommable = new TConsoBase(this.name, this.quantity, this.unity);
        consommable.id?.push(this.id);
        return consommable;
    }
    /**
      * Permet de récupérer les ingrédients dans une enseigne et une restaurant donné
      * @param proprietary_id identifiant de l'enseigne pour lequel nous voulons récupérer les ingrédients
      * @param  restaurant_id identifiant du restauarnt pour lequel nous voulons récupérer les ingrédients
    */
    public static getPathsToFirestore(proprietary_id: string, restaurant_id: string) {
        return ["proprietaires", proprietary_id, "restaurants", restaurant_id, "consommables"];
    }
   /**
    * permet de retourner une isntance de CIngredient
    * @returns une instance CIngredient
   */
    public getInstance(): InteractionBddFirestore {
        return new Cconsommable(this.service) as Cconsommable;
    }
    /**
     * 
     * @param id identifiant du consommable dans la base de donnée
     * @param prop identifiant d" l'enseigne qui possède le consommable
     * @returns {void}
     */
    public getData(id: string | null,attrs:Array<string> | null): any {
        let _attrs = Object.keys(this);
        let object:{[index:string]:any} = {};
        if(attrs){
            _attrs = attrs
        }
        if(id){
            this.id = id;
        }
        for(let attr of _attrs){
            object[attr] = this[attr];
        }
        return object;
    }
    /**
     * cette fonction permet de construire un consommable à partir du JSON de la
     * base de donnée
     * @param data données à intégrer comme consommable
     */
    public setData(data: Cconsommable | undefined) {
        if (data !== undefined) {
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
            if (typeof data.date_reception === "string") {
                const date_reception = this.service.stringToDate(data.date_reception);
                if (date_reception !== null) {
                    this.date_reception = date_reception;
                }
                else {
                    this.date_reception = new Date();
                }
            }
        }
    }
}

