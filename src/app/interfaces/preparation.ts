import { DocumentSnapshot, SnapshotOptions } from "@angular/fire/firestore";
import { CalculService } from "../services/menus/menu.calcul/menu.calcul.ingredients/calcul.service";
import { TConsoBase } from "./consommable";
import { Etape } from "./etape";
import { TIngredientBase } from "./ingredient";
import { InteractionBddFirestore } from "./interaction_bdd";


export interface AfterPreparation {
    "quantity": number;
    "unity": string
}


export class Cpreparation implements InteractionBddFirestore {
    "name": string;
    "categorie_restaurant": string;
    "etapes": Array<Etape> | null;
    "temps": number | null;
    "cost": number;
    "quantity": number;
    "quantity_unity": number;
    "total_quantity": number;
    "unity": string;
    "marge": number;
    "vrac": string;
    "portions": number;
    "dlc": Date;
    "date_reception": Date;
    "ingredients": TIngredientBase[] | null;
    "consommables": TConsoBase[] | null;
    "val_bouch": number | null;
    "prime_cost": number | null;
    "material_cost": number | null;
    "quantity_bef_prep": number | null;
    "quantity_after_prep": number | null;
    "is_similar": number;
    "is_stock": boolean;
    "id": string;
    "proprietary_id": string;
    [index: string]: any

    constructor(public service: CalculService) {
        this.name = "";
        this.categorie_restaurant = "";
        this.etapes = null;
        this.temps = null;
        this.cost = 0;
        this.quantity = 0;
        this.quantity_unity = 0;
        this.total_quantity = 0;
        this.unity = "";
        this.marge = 0;
        this.vrac = "non";
        this.portions = 0;
        this.dlc = new Date();
        this.date_reception = new Date();
        this.ingredients = null;
        this.consommables = null;
        this.val_bouch = null;
        this.prime_cost = null;
        this.material_cost = null;
        this.quantity_after_prep = null;
        this.quantity_bef_prep = null;
        this.is_similar = 0;
        this.is_stock = true;
        this.id = "";
        this.proprietary_id = "";
    }
    /**
     * permet de retourner une isntance de Cpreparation
     * @returns une instance Cpreparation
    */
    getInstance() {
        return new Cpreparation(this.service) as Cpreparation;
    }
    // permet d'initialiser certain attributs pour l'objet préparation lorsque celui-ci a des attributs null
    public setDefautPrep() {
        this.categorie_restaurant = (this.categorie_restaurant === null) ? "" : this.categorie_restaurant;
        this.cost = (this.cost === null) ? 0 : this.cost;
        this.date_reception = (this.date_reception === null) ? new Date() : this.date_reception;
        this.quantity = (this.quantity === null) ? 0 : this.quantity;
        this.unity = (this.unity === null) ? "" : this.unity;
        this.vrac = (this.vrac === null) ? 'non' : this.vrac;
    }
    /**
     * Cette fonction permet de récupérer un chemin vers les préparations dans firestore
     * @param prop enseigne qui possède les préparations
     * @param restaurant restaurant qui possède les préparations
     */
    public static getPathsToFirestore(proprietary_id: string, restaurant_id: string): string[] {
        return ["proprietaires", proprietary_id, "restaurants", restaurant_id, "preparations"];
    }
    /**
     * Cette fonction permet dedupliquer une prépartion
     * @param data préparation à ajouter dans la base de donnée
     */
    public setData(data: Cpreparation): void {
        let ingredients = new Array<TIngredientBase>();
        let consommables = new Array<TConsoBase>();
        if (data.ingredients !== null && data.ingredients !== undefined) {
            ingredients = data.ingredients.map((ingredient) => {
                let _ingredient = new TIngredientBase(
                    ingredient.name,
                    ingredient.quantity,
                    ingredient.unity,
                );
                _ingredient.added_price = ingredient.added_price;
                _ingredient.id = ingredient.id;
                return _ingredient;
            });
        }
        if (data.consommables !== null && data.consommables !== undefined) {
            consommables = data.consommables.map((consommable) => {
                let _consommable: TConsoBase = new TConsoBase(
                    consommable.name,
                    consommable.quantity,
                    consommable.unity
                )
                return _consommable;
            })
        }
        if (data.name !== undefined) {
            this.name = data.name;
        }
        if (data.categorie_restaurant !== undefined) {
            this.categorie_restaurant = data.categorie_restaurant;
        }
        if (data.id !== undefined) {
            this.id = data.id;
        }
        if (typeof data.date_reception === "string") {

            const date_reception = this.service.stringToDate(data.date_reception);
            if (date_reception !== null) {
                this.date_reception = date_reception;
            }
            else {
                this.date_reception = new Date();
            }
        }
        else {
            if (data.date_reception !== undefined) {
                this.date_reception = data.date_reception;
            }
        }
        if (typeof data.dlc === "string") {
            const dlc = this.service.stringToDate(data.dlc);
            if (dlc !== null) {
                this.dlc = dlc;
            }
            else {
                this.dlc = new Date();
            }
        }
        else {
            if (data.dlc !== undefined) {
                this.dlc = data.dlc;
            }
        }
        if (data.etapes !== undefined) {
            this.etapes = data.etapes;
        }
        if (data.ingredients !== undefined) {
            for (let ingredient of ingredients) {
                if (ingredient.added_price === undefined) {
                    ingredient.added_price = null;
                }
                if (ingredient.id === undefined) {
                    ingredient.id = [];
                }
                if (ingredient.name === undefined) {
                    ingredient.name = "";
                }
                if (ingredient.quantity === undefined) {
                    ingredient.quantity = null;
                }
                if (ingredient.unity === undefined) {
                    ingredient.unity = null;
                }
            }
            this.ingredients = ingredients;
        }
        if (data.consommables !== undefined) {
            for (let consommable of consommables) {
                if (consommable.id === undefined) {
                    consommable.id = [];
                }
                if (consommable.name === undefined) {
                    consommable.name = "";
                }
                if (consommable.quantity === undefined) {
                    consommable.quantity = null;
                }
                if (consommable.unity === undefined) {
                    consommable.unity = null;
                }
            }
            this.consommables = consommables;
        }
        if (data.marge !== undefined) {
            this.marge = data.marge;
        }
        if (data.material_cost !== undefined) {
            this.material_cost = data.material_cost;
        }
        if (data.portions !== undefined) {
            this.portions = data.portions;
        }
        if (data.prime_cost !== undefined) {
            this.prime_cost = data.prime_cost;
        }
        if (data.quantity !== undefined) {
            this.quantity = data.quantity;
        }
        if (data.unity !== undefined) {
            this.unity = data.unity;
        }
        if (data.quantity_after_prep !== undefined) {
            this.quantity_after_prep = data.quantity_after_prep;
        }
        if (data.quantity_bef_prep !== undefined) {
            this.quantity_bef_prep = data.quantity_bef_prep;
        }
        if (data.total_quantity !== undefined) {
            this.total_quantity = data.total_quantity;
        }
        if (data.quantity_unity !== undefined) {
            this.quantity_unity = data.quantity_unity;
        }
        if (data.cost !== undefined) {
            this.cost = data.cost;
        }
        if (data.val_bouch !== undefined) {
            this.val_bouch = data.val_bouch;
        }
        if (data.temps !== undefined) {
            this.temps = data.temps;
        }
        if (data.is_stock !== undefined) {
            this.is_stock = data.is_stock;
        }
        if (data.is_similar !== undefined) {
            this.is_similar = data.is_similar;
        }
    }

    /**
     * permet de récupérer un objet constituant l'ingrédient à écrire en base de donnée
     * @param id identifiant de l'objet à ajouter en base de donnée
     * @returns {any} json de l'objet Cpreparation
    */
    public getData(id: string | null, attrs: Array<string> | null): any {
        let _attrs = Object.keys(this);
        let object: { [index: string]: any } = {};
        if (id !== null) {
            this.id = id;
        }
        let ingredients: null | Array<Object> = null;
        let consommables: null | Array<Object> = null;
        let etapes: null | Array<Object> = null;
        if ((this.ingredients !== null) && (this.ingredients !== undefined)) {
            ingredients = this.ingredients.map((ingredient) => ingredient.getData());
        }
        if ((this.consommables !== null) && (this.consommables !== undefined)) {
            consommables = this.consommables?.map((consommable) => consommable.getData(null, null));
        }
        if ((this.etapes !== null) && (this.etapes !== undefined)) {
            etapes = this.etapes.map((etape) => etape.getData());
        }
        if (attrs) {
            _attrs = attrs
        }
        for (let attr of _attrs) {
            if (attr === "etapes") {
                object[attr] = etapes;
            }
            else {
                if (attr === "ingredients") {
                    object[attr] = ingredients;
                }
                else {
                    if (attr === "consommables") {
                        object[attr] = consommables;
                    }
                    else {
                        if(attr === "dlc"){
                            object[attr] = this.dlc.toISOString();
                        }
                        else{
                            object[attr] = this[attr]
                        }
                    }
                }
            }
        }
        return object;
    }
    /**
     * Convertion de la préparation en préparation de base
     * @returns {CpreparationBase}
     */
    public convertToBase(): CpreparationBase {
        let preparation = new CpreparationBase();
        preparation.portions = this.portions;
        preparation.name = this.name;
        preparation.id = null;
        return preparation;
    }

    /**
     * Cette fonction permet de retourner un objet  qui permet l'intéraction entre la base de donnée et l'objet  
     * @returns {any} convertisseur de la preparation pour l'ajout en base 
     */
    public static getConverter(service: CalculService): any {
        return {
            toFirestore: (preparation: Cpreparation) => {
                return preparation;
            },
            fromFirestore: (snapshot: DocumentSnapshot<Cpreparation>, options: SnapshotOptions) => {
                const data = snapshot.data(options);
                if (data !== undefined) {
                    let preparation = new Cpreparation(service);
                    preparation.setData(data)
                    return preparation;
                }
                else {
                    return null;
                }
            }
        }
    }
}

export class CpreparationBase {
    "name": string | null;
    "portions": number | null;
    "id": Array<string> | null;
    /**
     * permet de convertir l'instance de la classe en objet pour ajout dans la bdd
     * @returns {Object} objet CpreparationBase
     */
    public getData(): Object {
        return {
            name: this.name,
            portions: this.portions,
            id: this.id
        }
    }
    /**
     * permet de copier une instance de la classe CpreparationBase à cette instance
     * @param preparation préparationque l'on copie
     */
    public setData(preparation: CpreparationBase) {
        if (preparation.id !== undefined) {
            this.id = preparation.id;
        }
        else {
            this.id = null;
        }
        if (preparation.name !== undefined) {
            this.name = preparation.name;
        }
        else {
            this.name = null;
        }
        if (preparation.portions !== undefined) {
            this.portions = preparation.portions;
        }
        else {
            this.portions = null;
        }
    }
    constructor() {
        this.name = null;
        this.id = [];
        this.portions = null;
    }
} 