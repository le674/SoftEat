import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Database, DatabaseReference, connectDatabaseEmulator, get, getDatabase, ref, remove, update } from 'firebase/database';
import { Client } from '../../../app/interfaces/client';
import { FIREBASE_DATABASE_EMULATOR_HOST, FIREBASE_PROD } from '../../../environments/variables';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private db: Database;
  private clients: Array<Client>;
  constructor(private ofApp: FirebaseApp){
    this.db = getDatabase(ofApp);
    if ((location.hostname === "localhost") && (!FIREBASE_PROD)) {
      try {
        connectDatabaseEmulator(this.db, FIREBASE_DATABASE_EMULATOR_HOST.host, FIREBASE_DATABASE_EMULATOR_HOST.port);
      } catch (error) {
        console.log(error);
      }  
    }
    this.clients = [];
  }
  async getClients(prop:string, restaurant:string){
    let ref_db: DatabaseReference;
    const path = `clients_${prop}_${restaurant}/${prop}/${restaurant}/`;
    ref_db = ref(this.db, path);
    await get(ref_db).then((bdd_clients) => {
      bdd_clients.forEach((bdd_client) => {
        const client = new Client();
        if(bdd_client.key !== null){
          client.id = bdd_client.key;
          client.adress = bdd_client.child("address").val();
          client.promotion = bdd_client.child("promotion").val();
          client.email = bdd_client.child("email").val();
          client.number = bdd_client.child("number").val();
          client.name = bdd_client.child("name").val();
          client.surname = bdd_client.child("surname").val();
          client.is_contacted = bdd_client.child("is_contacted").val();
          client.waste_alert = bdd_client.child("waste_alert").val();
          this.clients.push(client)
        }
      })
    })
    return this.clients;
  }
  
  async suppClient(prop:string, restaurant:string, client: Client) {
    let ref_db: DatabaseReference;
    const path = `clients_${prop}_${restaurant}/${prop}/${restaurant}/${client.id}`;
    ref_db = ref(this.db, path);
    return await remove(ref_db);
  }
  async setClient(prop:string,restaurant:string,client: Client) {
    let ref_db: DatabaseReference;
    const path = `clients_${prop}_${restaurant}/${prop}/${restaurant}`;
    ref_db = ref(this.db,path);
    return await update(ref_db, {
        [`${client.id}`]:client
    })
  }
}
