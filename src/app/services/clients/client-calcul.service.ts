import { Injectable } from '@angular/core';
import { Client, DisplayedClient } from '../../interfaces/client';

@Injectable({
  providedIn: 'root'
})
export class ClientCalculService {
  constructor() { }

  addressToStringAddress(street_number:number | null, street:string | null, postal_code:string | null, city:string):string{
    console.log(street);
    let street_number_str = "";
    if(street === null || street === undefined || street === ""){
      street="";
    }
    else{
      street = street + ", ";
    }
    if(postal_code === null){
      postal_code="";
    }
    else{
      postal_code = postal_code + " ";
    }
    if(street_number !== null && street !== ""){
      street_number_str = street_number_str + street_number.toString();
    }
    return street_number_str + street +  postal_code  + city
  }

  clientToDisClient(clients: Client[]): DisplayedClient[]{
    const dis_clients:DisplayedClient[] = clients.map((client) => {
     let address = ""; 
     let dis_client:DisplayedClient = new DisplayedClient();
     dis_client.name = client.name;
     dis_client.surname = client.surname;
     dis_client.email = client.email;
     dis_client.number = client.number;
     if(client.address !== null){
      dis_client.street_number = client.address.street_number;
      dis_client.postal_code = client.address.postal_code;
      dis_client.street = client.address.street;
      dis_client.city = client.address.city;
      dis_client.address = this.addressToStringAddress(
          client.address.street_number, 
          client.address.street,
          client.address.postal_code,
          client.address.city
        )
     }
     dis_client.order_number = client.order_number;
     if(client.waste_alert){
      dis_client.waste_alert = "oui";
     }
     else{
      dis_client.waste_alert = "non";
     }
     if(client.promotion){
      dis_client.promotion = "oui";
     }
     else{
      dis_client.promotion = "non";
     }
     return dis_client;
    })
    return dis_clients;
  }
}
