import { IngredientsInteractionService } from "../services/menus/ingredients-interaction.service";
import { CalculService } from "../services/menus/menu.calcul/menu.calcul.ingredients/calcul.service";

export interface Ingredient {
    "name": string;
    "categorie_restaurant": string | null;
    "categorie_tva": string | null;
    "taux_tva": number | null;
    "cost": number;
    "material_cost":number;
    "quantity": number;
    "quantity_unity": number;
    "total_quantity": number;
    "unity": string;
    "date_reception":Date | string;
    "dlc": Date | null | string;
    "cost_ttc": number | null;
    "marge": number | null;
    "vrac":string;
    "base_ingredient_id":Array<string> | null;
    "id":string;

/*     getValBouchFromNewQauntity(quantity_unity: number): CIngredient; */
    getCostTtcFromCat(): void;
    getNom(): string;
    setNom(nom: string | null): void;
    getCategorieRestaurant(): string | null;
    setCategorieRestaurant(categorie: string | null): void;
    getCategorieTva(): string | null;
    setCategorieTva(categorie: string | null): void;
    getTauxTva(): number | null;
    setTauxTva(taux: number | null): void;
    getCost(): number;
    setCost(cost: number | null): void;
    getQuantity(): number;
    setQuantity(quantity: number | null): void;
    getQuantityUnity(): number;
    setQuantityUniy(quantity: number | null): void;
    getUnity(): string;
    setUnity(unity: string | null): void;
    getDlc(): Date | null | string;
    setDlc(val: Date | null | string): void;
    getDateReception(): Date | string;
    setDateReception(val: Date | null | string): void;
    getCostTtc(): number | null;
    setCostTtc(val: number | null): void;
    getMarge():number | null;
    setMarge(marge:number):void;
    getVrac():string;
    setVrac(is_vrac:string):void;

}

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
export class TIngredientBase{
    "name": string;
    "quantity": number | null; 
    "unity":string | null;
    "added_price":number | null;
    "id":Array<string>;
    constructor(name:string, quantity:number | null, unity:string | null){
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
    public toMinimalIng(): {name:string, quantity:number, unity:string} {
        let unity = "";
        let quantity = 0;
        if(this.unity !== null) unity = this.unity;
        if(this.quantity !== null) quantity = this.quantity;
        return {name: this.name, quantity: quantity, unity:unity};
    }
    /**
     * permet de transformer un ingrédient en ingrédient de base
     * @param ingredient ingrédient que l'on ajoute à un ingrédient de base
     */
    public setIngredient(ingredient:CIngredient){
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
    public getData():{name:string, quantity:number | null, unity:string | null, added_price:number | null, id:Array<string> | null}{
        
        return {
            name: this.name,
            quantity:this.quantity,
            unity: this.unity,
            added_price:this.added_price,
            id:this.id
        }
    }
    /**
     * on copie un autre ingrédient de base dans cette objet
     * @param ingredient ingrédient que l'on souhaite copier
     */
    public setData(ingredient:TIngredientBase){
        this.name = ingredient.name;
        this.id = ingredient.id;
        this.added_price = ingredient.added_price;
        this.quantity = ingredient.quantity;
        this.unity = ingredient.unity;
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
export class CIngredient implements Ingredient {
    "name": string;
    "categorie_restaurant": string | null;
    "categorie_tva": string | null;
    "taux_tva": number | null;
    "cost": number;
    "material_cost":number;
    "quantity": number;
    "quantity_unity": number;
    "total_quantity": number;
    "unity": string;
    "date_reception":Date | string;
    "dlc": Date | null | string;
    "cost_ttc": number | null;
    "marge": number | null;
    "vrac": string;
    "base_ingredient_id":Array<string> | null;
    "id":string;
    "proprietary_id":string;
    constructor(private service: CalculService) {
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
    convertToBase(): TIngredientBase {
        let ingredient:TIngredientBase = new TIngredientBase(this.name, this.quantity, this.unity);
        return ingredient
      }
    /**
     * permet de récupérer le cout ttc d'un ingrédient à partir de la catégorie de tva et du cout
     */
    getCostTtcFromCat(): void {
        const cost_ttc = this.service.getCostTtcFromCat(this.categorie_tva, this.cost);
        if(cost_ttc){
            this.cost_ttc = cost_ttc
        }
    } 

    /**
     * permet de récupérer le cout ttc d'un ingrédient à partir du taux de tva et du cout
    */
    getCostTtcFromTaux():void{
       const cost_ttc = this.service.getCostTtcFromTaux(this.taux_tva, this.cost);
       if(cost_ttc !== null){
        this.cost_ttc = cost_ttc;
       }
    }

    /**
     * permet de récupérer la date de récéption de l'ingrédient
    */
    getDateReception(): Date | string {
        return this.date_reception;
    }
    setDateReception(val: Date | null): void {
        if (val !== null) this.date_reception = val;
    }

    getDlc(): Date | null | string{
        return this.dlc
    }
    setDlc(val: Date | null): void {
        if (val !== null) this.dlc = val;
    }
    getCostTtc(): number | null {
        return this.cost_ttc
    }
    setCostTtc(val: number | null): void {
        if (val !== null) this.cost_ttc = val;
    }

    getNom(): string {
        return this.name
    }
    setNom(name: string | null): void {
        if (name !== null) this.name = name
    }
    getCategorieRestaurant(): string | null {
        return this.categorie_restaurant
    }
    setCategorieRestaurant(categorie: string | null): void {
        if (categorie !== null) this.categorie_restaurant = categorie;
    }
    getCategorieTva(): string | null {
        return this.categorie_tva
    }
    setCategorieTva(categorie: string | null): void {
        if (categorie !== null) this.categorie_tva = categorie;
    }
    getTauxTva(): number | null {
        return this.taux_tva;
    }
    setTauxTva(taux: number | null): void {
        if (taux !== null) this.taux_tva = taux;
    }
    getCost(): number {
        return this.cost
    }
    setCost(cost: number | null): void {
        if (cost !== null) this.cost = cost
    }
    getQuantity(): number {
        return this.quantity
    }
    setQuantity(quantity: number | null): void {
        if (quantity !== null) this.quantity = quantity
    }

    getQuantityUnity(): number {
        return this.quantity_unity
    }
    setQuantityUniy(quantity: number | null): void {
        if (quantity !== null) this.quantity_unity = quantity
    }
    getUnity(): string {
        return this.unity
    }
    setUnity(unity: string | null): void {
        if (unity !== null) this.unity = unity
    }  
    getMarge(): number | null{
       return this.marge
    }
    setMarge(marge: number): void {
        this.marge = marge;
    }
    getVrac(): string {
        return this.vrac;
    }
    setVrac(is_vrac: string): void {
       this.vrac = is_vrac
    }
    /**
     * Cette fonction peremet de construire un objet ingrédient à partir du JSON de la
     * base de donnée
     * @param data données à intégrer comme ingrédient
     */
    setData(data: CIngredient | undefined) {
        if(data !== undefined){
            this.name = data.name;
            this.cost = data.cost;
            this.cost_ttc = data.cost_ttc;
            this.id = data.id;
            this.base_ingredient_id = data.base_ingredient_id;
            this.categorie_restaurant = data.categorie_restaurant;
            this.categorie_tva = data.categorie_tva;
            this.taux_tva= data.taux_tva;
            if(typeof data.date_reception === "string"){
                const date_reception = this.service.stringToDate(data.date_reception);
                if(date_reception !== null){
                    this.date_reception = date_reception;
                }
                else{
                    this.date_reception = new Date();
                }
            }
            else{
                this.date_reception = data.date_reception;
            }
            if(typeof data.dlc === "string"){
                this.dlc  = this.service.stringToDate(data.dlc);
            }
            else{
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
     * @param id identifiant du document que l'on souahite renvoyer pour l'ajout en base de donnée
     * @param proprietary_id identifiant du propriétaire 
     * @returns {Object} ingrédient sous forme d'objet
    */
    getData(id:string | null, proprietary_id:string): any {
        if((this.proprietary_id === null) || this.proprietary_id === undefined){
            this.proprietary_id = proprietary_id;
        }
        if(this.base_ingredient_id === undefined){
            this.base_ingredient_id = null;
        }
        if(id !== null){
            this.id = id;
        }
        return {
           name: this.name,
           cost: this.cost,
           cost_ttc: this.cost_ttc,
           id: this.id,
           base_ingredient_id: this.base_ingredient_id,
           categorie_restaurant: this.categorie_restaurant,
           categorie_tva: this.categorie_tva,
           taux_tva: this.taux_tva,
           date_reception: this.date_reception.toLocaleString(),
           dlc: this.dlc?.toLocaleString(),
           marge: this.marge,
           quantity: this.quantity,
           unity: this.unity,
           total_quantity: this.total_quantity,
           quantity_unity: this.quantity_unity,
           proprietary_id: this.proprietary_id,
           vrac: this.vrac
        }
    }
}