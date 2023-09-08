import { Address } from "./address";
import { InteractionBddFirestore } from "./interaction_bdd";

export class Client implements InteractionBddFirestore {
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
    [index:string]:any;
  
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
     * Permet de retourner une instance d'un objet client
     * @returns un objet client
     */
    public getInstance(): InteractionBddFirestore {
      return new Client();
    }
    /**
     * Permet de récupérer le chemin vers l'ensemble des clients du restaurants
     * @param proprietary_id identifiant de l'enseigne permettant l'accès aux clients
     * @param restaurant_id identifiant du restaurants contenants l'ensemble des clients
     * @returns {Array<string>} chemin vers les clients du restaurant
     */
    public static getPathsToFirestore(proprietary_id: string, restaurant_id:string):string[]{
      return ["proprietaires", proprietary_id, "restaurants", restaurant_id, "clients"];
    }
    /**
     * Permet de créer une instance de l'objet client à partir d'un JSON client de la base de donnée
     * @param data donnée client récupéré depuis la base de donnée
     */
    public setData(data: Client) {

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
    public getData(id: string | null,attrs:Array<string> | null, ...args: any[]): any {
      let _attrs = Object.keys(this);
      let address = null;
      let object: { [index: string]: any } = {};
      if (attrs) {
        _attrs = attrs
      }
      if (id) {
        this.id = id;
      }
      if(this.address !== null){
        address = this.address.getData(null, null);
      }
      for (let attr of _attrs) {
        if(attr !== "address"){
          object[attr] = this[attr];
        }
        else{
          object[attr] = address;
        }
      }
      return object;
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