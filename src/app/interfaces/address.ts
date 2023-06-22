export class Address{
    private postal_code:string;
    private street_number: number;
    private city: string;
    private street: string;


    constructor(postal_code:string, street_number:number, city:string, street:string){
        this.postal_code = postal_code;
        this.street_number = street_number;
        this.street = street;
        this.city = city;
    }
    
}