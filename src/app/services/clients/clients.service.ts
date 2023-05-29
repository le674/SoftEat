import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Database, DatabaseReference, connectDatabaseEmulator, get, getDatabase, ref, remove, update } from 'firebase/database';
import { Client } from '../../../app/interfaces/client';
import { FIREBASE_DATABASE_EMULATOR_HOST, FIREBASE_PROD } from '../../../environments/variables';
import { Mplat } from 'src/app/interfaces/plat';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private db: Database;
  private clients: Array<Client>;
  private host:string;
  constructor(private ofApp: FirebaseApp, private http: HttpClient){
    this.db = getDatabase(ofApp);
    if ((location.hostname === "localhost") && (!FIREBASE_PROD)) {
      try {
        connectDatabaseEmulator(this.db, FIREBASE_DATABASE_EMULATOR_HOST.host, FIREBASE_DATABASE_EMULATOR_HOST.port);
      } catch (error) {
        console.log(error);
      }  
    }
    this.clients = [];
    // hôte sur lequel on réalise la requête d'envoie de SMS
    this.host = "https://us-central1-psofteat-65478545498421319564.cloudfunctions.net/sendMessage";
  }
/**
 * Récupération d'un client depuis la base de donnée
 * @param prop propriétaire qui possèdes les fiches clients
 * @param restaurant restaurant ayant des fiches clients
 * @returns void
 */
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
          client.waste_alert = bdd_client.child("wast_prev").val();
          this.clients.push(client)
        }
      })
    })
    return this.clients;
  }
  /**
   * Suppression d'un client de la base de donnée
   * @param prop propriétaire qui possèdes les fiches clients
   * @param restaurant restaurant ayant des fiches client
   * @param client client que l'on supprime de la base de donnée
   * @returns void
   */
  async suppClient(prop:string, restaurant:string, client: Client) {
    let ref_db: DatabaseReference;
    const path = `clients_${prop}_${restaurant}/${prop}/${restaurant}/${client.id}`;
    ref_db = ref(this.db, path);
    return await remove(ref_db);
  }
  /**
   * Ajout d'un client à la bdd 
   * @param prop propriétaire qui possèdes les fiches clients
   * @param restaurant restaurant ayant des fiches client
   * @param client client que l'on ajoute à la base de donnée
   * @returns void
   */
  async setClient(prop:string,restaurant:string,client: Client) {
    let ref_db: DatabaseReference;
    const path = `clients_${prop}_${restaurant}/${prop}/${restaurant}`;
    ref_db = ref(this.db,path);
    return await update(ref_db, {
        [`${client.id}`]:client
    })
  }
  /**
   * Envoie de sms contenant des informations sur la campagne de destockage 
   * @param restaurant restaurant pour lequel ont réalise la compagne
   * @param prop enseigne qui détient le restaurant
   * @param plats liste les plats concèrnés par la campagne
   * @returns void
   */
  sendSmsWastPrev(restaurant:string, prop:string, plats:Array<Mplat>){
    const headers= new HttpHeaders().set('content-type', 'application/json')
                                    .set('Access-Control-Allow-Origin', 'http://www.softeat.fr');
    const subject = "wast_prev";
    let msg = `Bonjour,\n Le restaurant ${restaurant} 
    lance une opération de déstockage concernant les articles suivants :\n
    .`;
    plats.forEach((plat) => {
      msg = msg + ' ' + plat.name + 'au prix imbattable de ' + plat.price;
      if(plat.quantity !== null){
        msg = msg + ' il ne reste plus que ' + plat.quantity + ' articles';
      }
      msg = msg + '\n';
    })
    msg = msg + 'Cette offre exceptionnel se termine en fin de journée !';
    const params = `?restaurant=${encodeURI(restaurant)}&prop=${encodeURI(prop)}&subject=${encodeURI(subject)}&msg=${msg}`;
    const endpoint = this.host + params;
    return this.http.get(endpoint, {
      headers: headers,
      responseType: 'text'
    })
    .pipe(catchError(this.handleError))
  }

  /**
   * Permet de gérer l'erreur reçu
   * @param error 
   * @returns throwError on soulève une erreur
   */
  handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
