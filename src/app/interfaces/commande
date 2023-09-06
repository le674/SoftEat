import { OnDestroy } from "@angular/core";
import { InteractionBddFirestore } from "./interaction_bdd";

export class Ccommande implements InteractionBddFirestore{
    "id":string;
    "clients": Array<String> | null;
    "date":Date | null;
    "etat":number | null;
    "commande": Map<string, string>| null;
    /**
     * permet de transformer les donnée JSON récupérer depuis la bdd firestore en objet MENU
     * @param data donnée Json récupérer depuis la base ded onnée firestore
     */
    setData(data: Ccommande) {
        this.id = data.id;
        this.clients = data.clients;
        
        this.date = data.date;
        this.commande = data.commande;
        this.etat = data.etat;
    }

    /**
     * permet de récupérer un menu depuis la base de donnée
     * @param id identifiant du menu dans la base de donnée
     * @returns {Object} JSON correspndant au menu 
     */


    getData(id: string | null, ...args: any[]) {
        if(id !== null){
            this.id = id;
        }
        if(this.clients !== null){
           // this.nbr_clients_max = nbr_clients_max;
        }
        return {
            id: this.id,
            clients: this.clients,
            date:this.date,
            commande: this.commande,
            etat: this.etat
        }
    }
    getInstance(): InteractionBddFirestore {
        return new Ccommande();
    }



    public static getPathsToFirestore(proprietary_id: string, restaurant_id: string):string[] {
        return ["proprietaires", proprietary_id, "restaurants", restaurant_id, "tables"]
    }
}
