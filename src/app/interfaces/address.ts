export class Address{
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
     * @description permet d'afficher l'objet date sous forme de chaine de caractère
     * @returns {string} représentation de l'adresse
     */
    public print():string{
        return this.street_number + " " + this.street + ", " +this.postal_code + " " + this.city
    }
}