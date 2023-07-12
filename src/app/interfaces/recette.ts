import { CIngredient, TIngredientBase } from "./ingredient";
import { Cpreparation, CpreparationBase } from "./preparation";


/**
 * @class Cette classe est utilisé pour afficher les prépartions dans le tableau stock
 * @argument name nom de la préparation
 * @argument cost coût de la préparation
 * @argument quantity nombre de pack de la préparation
 * @argument quantity_unity quantitée pour un pack 
 * @argument unity unitée utilisée dans la préparation pour le plat
 * @argument cost_material coût matière utilisé dans la préparation
 */
export class RowIngredientRecette{
    public name: string;
    public cost: number;
    public quantity:number;
    public quantity_unity:number;
    public unity:string;
    public cost_material:number;
    constructor(name:string, cost:number | null, quantity:number | null, quantity_unity:number | null, unity:string | null){
        this.cost = 0;
        this.quantity = 0;
        this.unity = "";
        this.quantity_unity = 0;
        this.name = name;
        if(cost !== null) this.cost = cost;
        if(quantity !== null) this.quantity = quantity;
        if(quantity_unity !== null) this.quantity_unity = quantity_unity;
        if(unity !== null) this.unity = unity;
        this.cost_material = 0;
    }
    setRowIngredient(ingredient:TIngredientBase){
        if(ingredient.material_cost !== null){
            this.cost_material = ingredient.material_cost;
        }
    }
}


/**
 * @class Cette classe est utilisé pour afficher les prépartions dans le tableau stock
 * @argument name nom de la préparation
 * @argument cost coût de la préparation
 * @argument quantity nombre de pack de la préparation
 * @argument quantity_unity quantitée pour un pack 
 * @argument unity unitée utilisée dans la préparation pour le plat
 * @argument cost_material coût matière utilisé dans la préparation
 */
export class RowPreparationRecette{
    public name: string;
    public cost: number;
    public val_bouch:number;
    constructor(name:string, cost:number | null, val_bouch:number | null){
        this.cost = 0;
        this.val_bouch = 0;
        this.name = name;
        if(cost !== null) this.cost = cost;
        if(val_bouch !== null) this.val_bouch = val_bouch;
    }
}

/**
 * @class Cette classe est utilisé pour afficher les consommables dans le tableau recettes
 * @argument name nom du consommable
 * @argument cost coût du consommable
 * @argument quantity quantitée du consommable
 * @argument unity unitée du consommable
 */
export class RowConsommableRecette{
    public name: string;
    public cost: number;
    public quantity:number;
    public unity:string;
    constructor(name:string, cost:number | null, quantity:number | null, unity: string | null){
        this.cost = 0;
        this.quantity = 0;
        this.name = name;
        this.unity = "";
        if(cost !== null) this.cost = cost;
        if(quantity !== null) this.quantity = quantity;
        if(unity !== null) this.unity = unity;
    }
}
/**
 * @class Cette classe est utilisé pour afficher les ingrédient dans le formulaire d'ajout d'une recette
 * @argument name nom du consommable
 * @argument cost coût du consommable
 * @argument quantity quantitée du consommable
 * @argument unity unitée du consommable
 */
export class MiniIngredient{
    "name":string;
    "quantity":number | null;
    "unity":string | null;
    "cost":number | null;
    constructor(name:string){
        this.name = name;
        this.quantity = null;
        this.unity = null;
        this.cost =null;
    }
}

/**
 * @class Cette classe est utilisé pour afficher les consommables dans le formulaire d'ajout d'une recette
 * @argument name nom du consommable
 * @argument cost coût du consommable
 * @argument quantity quantitée du consommable
 * @argument unity unitée du consommable
 */
export class MiniConsommable{
    "name":string;
    "quantity":number | null;
    "unity":string | null;
    "cost":number | null;
    constructor(name:string){
        this.name = name;
        this.quantity = null;
        this.unity = null;
        this.cost =null;
    }
}