import { Injectable } from '@angular/core';
import { Client, DisplayedClient } from '../../interfaces/client';

@Injectable({
  providedIn: 'root'
})
export class ClientCalculService {
  constructor() { }
  clientToDisClient(clients: Client[]): DisplayedClient[]{
    const dis_clients:DisplayedClient[] = clients.map((client) => {
     let dis_client:DisplayedClient = new DisplayedClient();
     dis_client.name = client.name;
     dis_client.surname = client.surname;
     dis_client.email = client.email;
     dis_client.number = client.number;
     dis_client.adress = client.adress;
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
