import { InteractionBddFirestore } from "./interaction_bdd";

export class Address implements InteractionBddFirestore{
    public postal_code:string | null;
    public street_number: number | null;
    public city: string;
    public street: string | null;
    constructor(postal_code:string | null, street_number:number | null, city:string, street:string | null){
        this.postal_code = postal_code;
        this.street_number = street_number;
        this.street = street;
        this.city = city;
    }
    /**
     * Cette fonction permet de copier l'instanced des données de address dans cette instance
     * @param address address que l'on copie dans cette instance  
     */
    setData(address:Address) {
        this.postal_code = address.postal_code;
        this.street = address.street;
        this.city = address.city;
        this.street_number = address.street_number;
    }
    /**
     * Permet de transformer l'instance de la class address en JSON pour firestore
     * @param id toujours null
     * @returns {Object} objet address
     */
    getData(id: string | null, ...args: any[]) {
        return {
            postal_code: this.postal_code,
            street: this.street,
            street_number:this.street_number,
            city: this.city
        }
    }
    getInstance(): InteractionBddFirestore {
        throw new Error("Method not implemented.");
    }
    /**
     * @description permet d'afficher l'objet date sous forme de chaine de caractère
     * @returns {string} représentation de l'adresse
     */
    public print():string{
        return this.street_number + " " + this.street + ", " +this.postal_code + " " + this.city
    }
}