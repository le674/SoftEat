import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MailServicesService {

  private host:string;

  constructor(private http: HttpClient) {

    // hôte sur lequel on réalise la requête get de récupération
    this.host = "https://us-central1-project-firebase-44cfe.cloudfunctions.net/sendMail";
   }

  sendMailCompteSuppresse(email:string){
     // données d'envoie à la boite mail
    const email_data = {
      message :  `Suppression du compte de ${email}`,
      from: email,
      subj: "SUPPRESSION DE COMPTE"
    }

    // paramètres d'envoie
    const params = `?from=${encodeURI(email_data.from)}&message=${encodeURI(email_data.message)}&subj=${encodeURI(email_data.subj)}`  
    const msg_send = this.host + params

  // envoie des données et attente de la réponse puis traitements par l'observable
    return this.http.get(msg_send, {
      responseType: 'text'
    })
    .pipe(catchError(this.handleError))
  }

  private handleError(error: HttpErrorResponse) {
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
