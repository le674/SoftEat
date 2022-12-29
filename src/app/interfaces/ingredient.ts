export interface Ingredient {
    "nom":string;
    "categorie_restaurant": string;
    "categorie_tva":string;
    "categorie_dico": string;
    "cost": number;
    "quantity": number;
    "quantity_unity": number;
    "unity":string
    "val_bouch":number
    "dlc":Date
    "cost_ttc":number

    getNom():string;
    setNom(nom:string | null):void;
    getCategorieRestaurant():string;
    setCategorieRestaurant(categorie:string | null):void;
    getCategorieTva():string;
    setCategorieTva(categorie:string | null):void;
    getCategorieDico():string;
    setCategorieDico(categorie:string | null):void;
    getCost():number;
    setCost(cost:number | null):void;
    getQuantity():number;
    setQuantity(quantity:number | null):void;
    getQuantityUnity():number;
    setQuantityUniy(quantity:number | null):void;
    getUnity():string;
    setUnity(unity:string | null):void;
    getValBouch():number;
    setValBouch(val:number | null):void;
    getDlc():Date;
    setDlc(val:Date | null):void;
    getCostTtc():number;
    setCostTtc(val:number | null):void;
}

export interface Consommable{
    "nom":string;
    "cost":number;
    "quantity":number;
    "quantity_unity": number;
    "unity":string;

    getNom():string;
    setNom(nom:string | null):void;
    getCost():number;
    setCost(cost:number | null):void;
    getQuantity():number;
    setQuantity(quantity:number | null):void;
    getQuantityUnity():number;
    setQuantityUniy(quantity:number | null):void;
    getUnity():string;
    setUnity(unity:string | null):void;
}

export class CIngredient implements Ingredient {
    "nom": string;
    "categorie_restaurant": string;
    "categorie_tva": string;
    "categorie_dico": string;
    "cost": number;
    "quantity": number;
    "quantity_unity": number;
    "unity": string;
    "val_bouch": number;
    "dlc": Date;
    "cost_ttc": number;
    
    constructor(){
        this.nom = "";
        this.categorie_restaurant = "";
        this.categorie_tva = "";
        this.cost = 0;
        this.quantity = 0;
        this.quantity_unity = 0;
        this.unity = "";
        this.categorie_tva = "";
        this.categorie_dico = "";    
        this.val_bouch = 0;
        this.dlc = new Date();
        this.cost_ttc = 0;
    }
 
    

    getValBouch(): number {
       return this.val_bouch
    }
    setValBouch(val: number | null): void {
        if(val !== null) this.val_bouch = val;
    }
    getDlc(): Date {
        return this.dlc
    }
    setDlc(val: Date | null): void {
        if(val !== null) this.dlc = val;
    }
    getCostTtc(): number {
        return this.cost_ttc
    }
    setCostTtc(val: number | null): void {
        if(val !== null) this.cost_ttc = val;
    }

    getNom(): string {
        return this.nom
    }
    setNom(nom:string | null): void {
        if(nom !== null) this.nom = nom
    }
    getCategorieRestaurant(): string {
        return this.categorie_restaurant
    }
    setCategorieRestaurant(categorie:string | null): void {
        if(categorie !== null) this.categorie_restaurant = categorie;
    }
    getCategorieTva(): string {
        return this.categorie_tva
    }
    setCategorieTva(categorie:string | null): void {
        if(categorie !== null) this.categorie_tva = categorie;
    }
    getCategorieDico(): string {
        return this.categorie_dico
    }
    setCategorieDico(categorie:string | null): void {
        if(categorie !== null) this.categorie_dico = categorie;
    }
    getCost(): number {
        return this.cost
    }
    setCost(cost:number | null): void {
        if(cost !== null) this.cost = cost
    }
    getQuantity(): number {
       return this.quantity
    }
    setQuantity(quantity:number | null): void {
        if(quantity !== null) this.quantity = quantity
    }
    getQuantityUnity(): number {
        return this.quantity_unity
    }
    setQuantityUniy(quantity:number | null): void {
        if(quantity !== null) this.quantity_unity = quantity
    }
    getUnity(): string {
       return this.unity
    }
    setUnity(unity:string | null): void {
       if(unity !== null) this.unity = unity
    }

}

export class CingredientModif {
    "nom":string;
    "nom_ingredient_base": string;
    "quantity":number;
    "unity":string;
    "quantity_unity": number;
    constructor(){
    }
    getNom(): string {
        return this.nom
     }
     setNom(nom: string | null): void {
         if(nom !== null) this.nom = nom;
     }
     getNomBase(): string {
        return this.nom_ingredient_base
     }
     setNomBase(nom: string | null): void {
         if(nom !== null) this.nom_ingredient_base = nom;
     }
     getQuantityUnity(): number {
        return this.quantity_unity
    }
    setQuantityUniy(quantity:number | null): void {
        if(quantity !== null) this.quantity_unity = quantity
    }
     getQuantity(): number {
        return this.quantity
     }
     setQuantity(quantity:number | null): void {
         if(quantity !== null) this.quantity = quantity
     }
    getUnity(): string {
       return this.unity
    }
    setUnity(unity:string | null): void {
       if(unity !== null) this.unity = unity
    }
}

export class Cconsommable implements Consommable{
    "quantity_unity": number;
    "nom": string;
    "cost": number;
    "quantity": number;
    "unity": string;
    
    constructor(){
        
    }

    getNom(): string {
       return this.nom
    }
    setNom(nom: string | null): void {
        if(nom !== null) this.nom = nom;
    }
    getCost(): number {
        return this.cost
    }
    setCost(cost:number | null): void {
        if(cost !== null) this.cost = cost
    }
    getQuantity(): number {
        return this.quantity
     }
     setQuantity(quantity:number | null): void {
        if(quantity !== null) this.quantity = quantity
     }
     getQuantityUnity(): number {
         return this.quantity_unity
     }
     setQuantityUniy(quantity:number | null): void {
        if(quantity !== null) this.quantity_unity = quantity
     }
     getUnity(): string {
        return this.unity
     }
     setUnity(unity:string | null): void {
        if(unity !== null) this.unity = unity
     }
}
    
