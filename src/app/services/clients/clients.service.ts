import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Client } from '../../../app/interfaces/client';
import { Mplat } from 'src/app/interfaces/plat';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Subject, catchError, throwError } from 'rxjs';
import { DocumentSnapshot, Firestore, SnapshotOptions, Unsubscribe, collection, deleteDoc, doc, getFirestore, onSnapshot, updateDoc } from 'firebase/firestore';
@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private _clients: Array<Client>;
  private clients = new Subject<Array<Client>>();
  private host:string;
  private firestore: Firestore;
  private client_converter: any;
  private sub_clients!: Unsubscribe;
  constructor(private ofApp: FirebaseApp, private http: HttpClient){
    this.firestore = getFirestore(ofApp);
    this._clients = [];
    this.client_converter = {
      toFirestore: (menu: Client) => {
        return menu;
      },
      fromFirestore: (snapshot: DocumentSnapshot<Client>, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        if (data !== undefined) {
          let client = new Client();
          client.setData(data)
          return client;
        }
        else {
          return null;
        }
      }
    };
    // hôte sur lequel on réalise la requête d'envoie de SMS
    this.host = "https://us-central1-psofteat-65478545498421319564.cloudfunctions.net/sendMessage";
  }
/**
 * Récupération des clients depuis la base de donnée
 * @param prop propriétaire qui possèdes les fiches clients
 * @param restaurant restaurant ayant des fiches clients
 * @returns void
 */
 public getClientsBDD(prop:string , restaurant:string){
  const clients_ref =
  collection(
    doc(
      collection(
        doc(
          collection(
            this.firestore, "proprietaires"
          ), prop
        ), "restaurants"
      ), restaurant
    ), "clients"
  ).withConverter(this.client_converter);
  this.sub_clients = onSnapshot(clients_ref, (clients) => {
    this._clients = [];
    clients.forEach((client) => {
      if (client.exists()) {
        this._clients.push(client.data() as Client)
      }
    })
    this.clients.next(this._clients);
  })
  return this.sub_clients;
 }

  /**
   * Suppression d'un client de la base de donnée
   * @param prop propriétaire qui possèdes les fiches clients
   * @param restaurant restaurant ayant des fiches client
   * @param client client que l'on supprime de la base de donnée
   * @returns void
   */
  async suppClient(prop: string,  restaurant:string,  client_id: string) {
    const clients_ref =
    doc(
      collection(
        doc(
          collection(
          doc(
            collection(
                this.firestore, "proprietaires"
              ),prop
            ),"restaurants"
          ),restaurant
        ),"clients"
      ),client_id
    ).withConverter(this.client_converter);
    await deleteDoc(clients_ref);
  }
  /**
   * Ajout d'un client à la bdd 
   * @param prop propriétaire qui possèdes les fiches clients
   * @param restaurant restaurant ayant des fiches client
   * @param client client que l'on ajoute à la base de donnée
   * @returns void
   */
  async setClient(prop: string,  restaurant:string, client: Client) {
    const clients_ref =
    doc(
      collection(
        doc(
          collection(
          doc(
            collection(
                this.firestore, "proprietaires"
              ),prop
            ),"restaurants"
          ),restaurant
        ),"clients"
      ),client.id
    ).withConverter(this.client_converter);
    await updateDoc(clients_ref, client.getData());
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

  getClients() {
    return this.clients.asObservable();
  }
}
