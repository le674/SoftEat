import { CIngredient } from "./ingredient";
import { Cpreparation } from "./preparation";

/**
 * @class Cette classe est utilisé pour afficher les ingrédients dans le tableau stock
 * @argument id identifiant de l'ingrédient que l'on affiche
 * @argument name nom de l'ingrédient
 * @argument categorie_tva categorie de tva du produit
 * @argument cost coût de l'ingrédient
 * @argument cost_ttc coût toute taxes comprise
 * @argument quantity nombre de pack d'ingrédient 1 si vrac
 * @argument quantity_unity quantitée pour un pack 
 * @argument date_reception date de récéption de l'ingrédient
 * @argument dlc date limite de consommation de l'ingrédient
 * @argument unity unitée de vente du produit ex. huile -> litre
 * @argument vrac est ce que l'aliment est en vrac ou non 
 * @argument marge marge présent sur total_quantity une fois que la quantitée est inférieur à la marge ont prévient le restaurateur d'un problème de stock
 */
export class RowIngredient{
    public id:string;
    public name:string;
    public categorie_tva: string | null;
    public cost:number;
    public cost_ttc:number | null;
    public quantity:number;
    public quantity_unity:number;
    public unity:string;
    public date_reception:string | null;
    public dlc:string | null;
    public marge: number | null;
    public vrac: string | null;
    constructor(name:string, cost:number, quantity:number, quantity_unity:number, unity:string, id:string){
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.quantity = quantity;
        this.quantity_unity = quantity_unity;
        this.unity = unity;
        this.categorie_tva = null;
        this.cost_ttc = null;
        this.date_reception = null;
        this.dlc = null;
        this.marge = null;
        this.vrac = null;
    }
    public setIngredient(ingredient: CIngredient) {
        this.cost_ttc = ingredient.cost_ttc;
        this.quantity = ingredient.quantity;
        this.quantity_unity = ingredient.quantity_unity;
        this.unity = ingredient.unity;
        this.date_reception = ingredient.date_reception.toLocaleString();  
        this.marge = ingredient.marge;
        this.vrac = ingredient.vrac; 
        if(ingredient.dlc !== null){
            this.dlc =  ingredient.dlc.toLocaleString();
        }
        else{
            this.dlc = "";
        }
        if((ingredient.categorie_tva !== null) && (ingredient.categorie_tva !== undefined)){
            this.categorie_tva =  ingredient.categorie_tva.split(' ').join('<br>');
        }
        else{
            this.categorie_tva =  "";
        }
    }
}
/**
 * @class Cette classe est utilisé pour afficher les consommable dans le tableau stock
 * @argument id identifiant du consommable que l'on affiche
 * @argument name nom de la préparation
 * @argument cost coût de la préparation
 * @argument cost_ttc coût toute taxes comprise
 * @argument quantity nombre de pack de la préparation
 * @argument unity quantitée pour un pack 
 * @argument date_reception date de récéption de la préparation
 * @argument marge marge présent sur total_quantity une fois que la quantitée est inférieur à la marge ont prévient le restaurateur d'un problème de stock
 */
export class RowConsommable{
    public id:string;
    public name: string;
    public cost: number;
    public cost_ttc:number | null;
    public quantity:number;
    public unity:string;
    public date_reception: string;
    public marge:number
    constructor(name:string, cost:number, cost_ttc:number | null, quantity:number, unity:string, date_reception:string, marge:number, id:string){
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.cost_ttc = cost_ttc;
        this.quantity = quantity;
        this.unity = unity;
        this.date_reception = date_reception;
        this.marge = marge;
    }
}
/**
 * @class Cette classe est utilisé pour afficher les prépartions dans le tableau stock
 * @argument id identiffiant de la préparation que l'on affiche 
 * @argument name nom de la préparation
 * @argument cost coût de la préparation
 * @argument quantity nombre de pack de la préparation
 * @argument quantity_unity quantitée pour un pack 
 * @argument date_reception date de récéption de la préparation
 * @argument dlc date limite de consommation de la préparation
 * @argument unity unitée de vente du produit ex. huile -> litre
 * @argument vrac est ce que l'aliment est en vrac ou non 
 * @argument marge marge présent sur total_quantity une fois que la quantitée est inférieur à la marge ont prévient le restaurateur d'un problème de stock
 */
export class RowPreparation{
    public id:string;
    public name: string;
    public cost: number;
    public quantity:number;
    public quantity_unity:number;
    public unity:string;
    public date_reception:string | null;
    public dlc:string | null;
    public marge:number | null;
    public vrac:string;
    constructor(name:string, cost:number, quantity:number, quantity_unity:number, unity:string, id:string){
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.quantity = quantity;
        this.quantity_unity = quantity_unity;
        this.unity = unity;
        this.date_reception = null;
        this.dlc = null;
        this.marge = null;
        this.vrac = "non";
    }
    setRowPreparation(preparation:Cpreparation){
        this.date_reception = preparation.date_reception.toLocaleString();
        this.dlc = preparation.dlc.toLocaleString();
        this.marge = preparation.marge;
    }
}
