
export class Client {
    public "id":string 
    public "name": string;
    public "surname": string;
    public "email":string;
    public "number":string;
    public "adress":string
    public "order_number":number;
    public "waste_alert": boolean;
    public "promotion":boolean;
    public "is_contacted": boolean;
  
    constructor(){
      this.id = "";
      this.name = "";
      this.surname = "";
      this.email = "";
      this.number = "";
      this.adress = "";
      this.waste_alert = false;
      this.promotion = false;
      this.is_contacted = false;
      this.order_number = 0;
    }
  }
  export class DisplayedClient {
    public "name": string;
    public "surname": string;
    public "email":string;
    public "number":string;
    public "adress":string
    public "order_number":number;
    public "waste_alert": string;
    public "promotion":string;

    constructor(){
      this.name = "";
      this.surname = "";
      this.email = "";
      this.number = "";
      this.adress = "";
      this.waste_alert = "";
      this.promotion = "";
      this.order_number = 0;
    }
  }