export interface Ingredient {
    "nom":string;
    "categorie_restaurant": string;
    "categorie_tva":string;
    "cost": number;
    "quantity": number;
    "quantity_unity": number;
    "unity":string

    getNom():string;
    setNom(nom:string):void;
    getCategorieRestaurant():string;
    setCategorieRestaurant(categorie:string):void;
    getCost():number;
    setCost(cost:number):void;
    getQuantity():number;
    setQuantity(quantity:number):void;
    getQuantityUnity():number;
    setQuantityUniy(quantity:number):void;
    getUnity():string;
    setUnity(unity:string):void;
}

export interface Consommable{
    "nom":string;
    "cost":number;
    "quantity":number;
    "quantity_unity": number;
    "unity":string;

    getNom():string;
    setNom(nom:string):void;
    getCost():number;
    setCost(cost:number):void;
    getQuantity():number;
    setQuantity(quantity:number):void;
    getQuantityUnity():number;
    setQuantityUniy(quantity:number):void;
    getUnity():string;
    setUnity(unity:string):void;
}

export class CIngredient implements Ingredient {
    "nom": string;
    "categorie_restaurant": string;
    "categorie_tva": string;
    "cost": number;
    "quantity": number;
    "quantity_unity": number;
    "unity": string;
    constructor(){

    }

    getNom(): string {
        return this.nom
    }
    setNom(nom:string): void {
        this.nom = nom
    }
    getCategorieRestaurant(): string {
        return this.categorie_restaurant
    }
    setCategorieRestaurant(categorie:string): void {
        this.categorie_restaurant = categorie;
    }
    getCost(): number {
        return this.cost
    }
    setCost(cost:number): void {
        this.cost = cost
    }
    getQuantity(): number {
       return this.quantity
    }
    setQuantity(quantity:number): void {
        this.quantity = quantity
    }
    getQuantityUnity(): number {
        return this.quantity_unity
    }
    setQuantityUniy(quantity:number): void {
        this.quantity_unity = quantity
    }
    getUnity(): string {
       return this.unity
    }
    setUnity(unity:string): void {
       this.unity = unity
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
    setNom(nom: string): void {
        this.nom = nom;
    }
    getCost(): number {
        return this.cost
    }
    setCost(cost:number): void {
        this.cost = cost
    }
    getQuantity(): number {
        return this.quantity
     }
     setQuantity(quantity:number): void {
         this.quantity = quantity
     }
     getQuantityUnity(): number {
         return this.quantity_unity
     }
     setQuantityUniy(quantity:number): void {
         this.quantity_unity = quantity
     }
     getUnity(): string {
        return this.unity
     }
     setUnity(unity:string): void {
        this.unity = unity
     }
}
    
