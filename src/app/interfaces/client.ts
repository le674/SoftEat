import { Address } from "./address";

export class Client {
    public "id":string 
    public "name": string;
    public "surname": string;
    public "email":string;
    public "number":string;
    public "address":Address | null;
    public "order_number":number;
    public "waste_alert": boolean;
    public "promotion":boolean;
    public "is_contacted": boolean;
    public "uid":string;
  
    constructor(){
      this.id = "";
      this.name = "";
      this.surname = "";
      this.email = "";
      this.number = "";
      this.address = new Address("", 0, "", "");
      this.waste_alert = false;
      this.promotion = false;
      this.is_contacted = false;
      this.order_number = 0;
      this.uid = "";
    }
    /**
     * Permet de créer une instance de l'objet client à partir d'un JSON client de la base de donnée
     * @param data donnée client récupéré depuis la base de donnée
     */
    setData(data: Client) {

      this.id = data.id;
      this.name = data.name;
      this.surname = data.surname;
      this.email = data.email;
      this.number = data.number;
      if(this.address !== null && data.address !== null){
        this.address = new Address(data.address.postal_code, data.address.street_number, data.address.city, data.address.street)
      }
      else{
        this.address = data.address;
      }
      this.order_number = data.order_number;
      this.waste_alert = data.waste_alert;
      this.promotion = data.promotion;
      this.is_contacted = data.is_contacted;
    }

    /**
     * permet de convertir un objet client en un JSON pour l'insérer dans la bdd
     * @returns {Object} objet client sous forme de JSON
     */
    getData(): any {
      let address = null;
      if(this.address !== null){
        address = {
          postal_code: this.address.postal_code,
          street_number: this.address.street_number,
          city: this.address.city,
          street: this.address.street
        }
      }
     return {
      id: this.id,
      name: this.name,
      surname: this.surname,
      email: this.email,
      number: this.number,
      address: address,
      order_number: this.order_number,
      wast_alert: this.waste_alert,
      promotion: this.promotion,
      is_contacted: this.is_contacted
     }
    }
  }
  export class DisplayedClient {
    public "name": string;
    public "surname": string;
    public "email":string;
    public "number":string;
    public "address":string | null;
    public "postal_code":string | null;
    public "street_number":number | null;
    public "street":string | null;
    public "city":string;
    public "order_number":number;
    public "waste_alert": string;
    public "promotion":string;

    constructor(){
      this.name = "";
      this.surname = "";
      this.email = "";
      this.number = "";
      this.postal_code = "";
      this.waste_alert = "";
      this.promotion = "";
      this.order_number = 0;
      this.street_number = 0;
      this.city = "";
      this.street = "";
      this.address = null;
    }
  }