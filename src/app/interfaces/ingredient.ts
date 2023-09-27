import { DocumentSnapshot, SnapshotOptions } from "@angular/fire/firestore";
import { CalculService } from "../services/menus/menu.calcul/menu.calcul.ingredients/calcul.service";
import { InteractionBddFirestore } from "./interaction_bdd";
import { Injectable } from "@angular/core";

/**
 * @class ingrédient utilisé pour la recette d'un plat 
 * @argument name nom de l'ingrédient
 * @argument taux_tva taux de tva à appliquer à 'lingrédient
 * @argument cost coût de l'ingrédient
 * @argument quantity nombre de pack d'ingrédient 1 si vrac
 * @argument quantity_unity quantitée pour un pack 
 * @argument unity unitée de vente du produit ex. huile -> litre
 * @argument material_cost cout matière de l'ingrédient
 * @argument vrac est ce que l'aliment est en vrac ou non 
 * @argument marge marge présent sur total_quantity une fois que la quantitée est inférieur à la marge ont prévient le restaurateur d'un problème de stock
 * @argument added_price prix à ajouter dans le cas d'un supplément au plat
 * @argument supp si l'ingrédient est un supplément ou pas
 * @argument ingredient_id identifiant de l'ingrédient dans l'inventaire
 * @argument id identifiant de l'ingrédient de base utilisé dans la recette
 */
export class TIngredientBase {
    "name": string;
    "quantity": number | null;
    "unity": string | null;
    "added_price": number | null;
    "id": Array<string>;
    constructor(name: string, quantity: number | null, unity: string | null) {
        this.name = name;
        this.quantity = quantity;
        this.unity = unity;
        this.added_price = null;
        this.id = [];
    }
    /**
     * Permet de récupérer de l'ingrédient de base un ingrédient affichable
     * @returns {Object<{name:string, quntity:number}>}
    */
    public toMinimalIng(): { name: string, quantity: number, unity: string } {
        let unity = "";
        let quantity = 0;
        if (this.unity !== null) unity = this.unity;
        if (this.quantity !== null) quantity = this.quantity;
        return { name: this.name, quantity: quantity, unity: unity };
    }
    /**
     * permet de transformer un ingrédient en ingrédient de base
     * @param ingredient ingrédient que l'on ajoute à un ingrédient de base
     */
    public setIngredient(ingredient: CIngredient) {
        this.name = ingredient.name;
        this.added_price = null;
        this.quantity = null;
        this.unity = null;
        this.id?.push(ingredient.id);
    }
    /**
     * On retourne l'ingréfdient de base mais uniquement les attributs de celui-ci
     * @returns {TIngredientBase} ingrédient de base avec uniquement les attributs
     */
    public getData(): { name: string, quantity: number | null, unity: string | null, added_price: number | null, id: Array<string> | null } {
        return {
            name: this.name,
            quantity: this.quantity,
            unity: this.unity,
            added_price: this.added_price,
            id: this.id
        }
    }
    /**
     * on copie un autre ingrédient de base dans cette objet
     * @param ingredient ingrédient que l'on souhaite copier
     */
    public setData(ingredient: TIngredientBase) {
        this.name = ingredient.name;
        this.id = ingredient.id;
        this.added_price = ingredient.added_price;
        this.quantity = ingredient.quantity;
        this.unity = ingredient.unity;
    }
    /**
    * Cette fonction permet de retourner un objet  qui permet l'intéraction entre la base de donnée et l'objet  ingrédient
    * @returns {any} convertisseur de ingrédient pour l'ajout en base 
    */
    public static getConverter(): any {
        return {
            toFirestore: (ingredient: TIngredientBase) => {
                return ingredient;
            },
            fromFirestore: (snapshot: DocumentSnapshot<TIngredientBase>, options: SnapshotOptions) => {
                const data = snapshot.data(options);
                if (data !== undefined) {
                    let ingredient = new TIngredientBase(data.name, data.quantity, data.unity);
                    ingredient.id = data.id;
                    ingredient.added_price = data.added_price;
                    return ingredient;
                }
                else {
                    return null;
                }
            }
        }
    }
}
/**
 * @class ingrédient dan la base de donnée 
 * @argument name nom de l'ingrédient
 * @argument categorie_restaurant catégorie dans lequel le restaurant souhaite ranger l'ingrédient pour le suivie des coûts
 * @argument categorie_tva catégorie de tva pour l'application du taux de tva
 * @argument taux_tva taux de tva à appliquer à 'lingrédient
 * @argument cost coût de l'ingrédient
 * @argument quantity nombre de pack d'ingrédient 1 si vrac
 * @argument quantity_unity quantitée pour un pack 
 * @argument total_quantity quantitée total une fois réapprovisionnement afin de contrôler les marges
 * @argument unity unitée de vente du produit ex. huile -> litre
 * @argument date_reception date de récéption de l'aliment 
 * @argument dlc date limite de consommation de l'aliment
 * @argument cost_ttc coût toutes taxes comprisent
 * @argument is_similar
 * @argument marge marge présent sur total_quantity une fois que la quantitée est inférieur à la marge ont prévient le restaurateur d'un problème de stock
 * @argument vrac est ce que l'aliment est en vrac ou non
 * @argument base_ingredient_id liste des identifiants des ingrédients utilisée dans les plats
 * @argument id identifiant unique de l'ingrédient dans le stock
 * @argument proprietary_id identifiant du propriétaire des restaurants
 */
export class CIngredient implements InteractionBddFirestore {
    "name": string;
    "categorie_restaurant": string | null;
    "categorie_tva": string | null;
    "taux_tva": number | null;
    "cost": number;
    "material_cost": number;
    "quantity": number;
    "quantity_unity": number;
    "total_quantity": number;
    "unity": string;
    "date_reception": Date | string;
    "dlc": Date | null | string;
    "cost_ttc": number | null;
    "marge": number | null;
    "vrac": string;
    "base_ingredient_id": Array<string> | null;
    "id": string;
    "proprietary_id": string;
    [index:string]:any;
    constructor() {
        this.name = "";
        this.categorie_restaurant = "";
        this.categorie_tva = "";
        this.taux_tva = 0;
        this.cost = 0;
        this.quantity = 0;
        this.quantity_unity = 0;
        this.unity = "";
        this.categorie_tva = "";
        this.dlc = new Date();
        this.date_reception = new Date()
        this.cost_ttc = 0;
        this.base_ingredient_id = null;

    }
    /**
     * Permet de convertire un ingrédient en ingrédient_base qui contiennent moins d'information 
     * que les ingrédients et qui sont donc plus légées
     * @returns {TIngredientBase} une instance d'un ingrédient de base
     */
    public convertToBase(): TIngredientBase {
        let ingredient: TIngredientBase = new TIngredientBase(this.name, this.quantity, this.unity);
        return ingredient
    }
    /**
     * Permet de récupérer les ingrédients dans une enseigne et une restaurant donné
     * @param proprietary_id identifiant de l'enseigne pour lequel nous voulons récupérer les ingrédients
     * @param  restaurant_id identifiant du restauarnt pour lequel nous voulons récupérer les ingrédients
     */
    public static getPathsToFirestore(proprietary_id:string, restaurant_id:string){
        return ["proprietaires",proprietary_id, "restaurants", restaurant_id, "ingredients"]
    }
    /**
     * permet de retourner une isntance de CIngredient
     * @returns une instance CIngredient
     */
    public getInstance(){
        return new CIngredient() as CIngredient;
    }
    /**
     * permet de récupérer le cout ttc d'un ingrédient à partir de la catégorie de tva et du cout
     */
    public getCostTtcFromCat(): void {
        const  service = new CalculService();
        const cost_ttc = service.getCostTtcFromCat(this.categorie_tva, this.cost);
        if (cost_ttc) {
            this.cost_ttc = cost_ttc
        }
    }

    /**
     * permet de récupérer le cout ttc d'un ingrédient à partir du taux de tva et du cout
    */
    public getCostTtcFromTaux(): void {
        const  service = new CalculService();
        const cost_ttc = service.getCostTtcFromTaux(this.taux_tva, this.cost);
        if (cost_ttc !== null) {
            this.cost_ttc = cost_ttc;
        }
    }
    /**
     * Cette fonction peremet de construire un objet ingrédient à partir du JSON de la
     * base de donnée
     * @param data données à intégrer comme ingrédient
     */
    setData(data: CIngredient | undefined) {
        const service = new CalculService();
        console.log("service");
        console.log(service); 
        if (data !== undefined) {
            this.name = data.name;
            this.cost = data.cost;
            this.cost_ttc = data.cost_ttc;
            this.id = data.id;
            this.base_ingredient_id = data.base_ingredient_id;
            this.categorie_restaurant = data.categorie_restaurant;
            this.categorie_tva = data.categorie_tva;
            this.taux_tva = data.taux_tva;
            if (typeof data.date_reception === "string") {
                const date_reception = service.stringToDate(data.date_reception);
                if (date_reception !== null) {
                    this.date_reception = date_reception;
                }
                else {
                    this.date_reception = new Date();
                }
            }
            else {
                this.date_reception = data.date_reception;
            }
            if (typeof data.dlc === "string") {
                this.dlc = service.stringToDate(data.dlc);
            }
            else {
                this.dlc = data.dlc;
            }
            this.marge = data.marge;
            this.quantity = data.quantity;
            this.unity = data.unity;
            this.total_quantity = data.total_quantity;
            this.quantity_unity = data.quantity_unity;
            this.proprietary_id = data.proprietary_id;
            this.vrac = data.vrac;
        }
    }

    /**
     * permet de récupérer un objet constituant l'ingrédient à écrire en base de donnée
     * @returns {Object} ingrédient sous forme d'objet
    */
    public getData(id: string | null, attrs:Array<string> | null): any {
        let _attrs = Object.keys(this);
        let date_reception = "";
        let dlc = "";
        let object:{[index:string]:any} = {};
        if(this.date_reception instanceof Date){
            date_reception = this.date_reception.toISOString();
        }
        if(this.dlc instanceof Date){
             dlc = this.dlc.toISOString();
        }
        if(id !== null){
            this.id = id;
        }
        if(attrs){
            _attrs = attrs
        }
        for(let attr of _attrs){
            if(attr === "date_reception"){
                object[attr] = date_reception;
            }
            else{
                if(attr === "dlc"){
                    object[attr] = dlc;
                }
                else{
                    object[attr] = this[attr];
                }
            }
        }
        return object;
    }
    /**
     * Cette fonction permet de retourner un objet  qui permet l'intéraction entre la base de donnée et l'objet  ingrédient
     * @returns {any} convertisseur de ingrédient pour l'ajout en base 
    */
    public static getConverter(): any {
        return {
            toFirestore: (ingredient: CIngredient) => {
                return ingredient;
            },
            fromFirestore: (snapshot: DocumentSnapshot<CIngredient>, options: SnapshotOptions) => {
                const data = snapshot.data(options);
                if (data !== undefined) {
                    let ingredient = new CIngredient();
                    ingredient.setData(data)
                    return ingredient;
                }
                else {
                    return null;
                }
            }
        }
    }
}