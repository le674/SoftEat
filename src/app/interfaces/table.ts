import { InteractionBddFirestore } from "./interaction_bdd";

export class Ctable implements InteractionBddFirestore{
    "id":string;
    "nbr_clients_max": number | null;
    /**
     * permet de transformer les donnée JSON récupérer depuis la bdd firestore en objet MENU
     * @param data donnée Json récupérer depuis la base ded onnée firestore
     */
    setData(data: Ctable) {
        this.id = data.id;
        this.nbr_clients_max = data.nbr_clients_max;



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
        if(this.nbr_clients_max !== null){
           // this.nbr_clients_max = nbr_clients_max;
        }
        return {
            id: this.id,
            nbr_clients_max: this.nbr_clients_max

        }
        
        


    }
    getInstance(): InteractionBddFirestore {
        throw new Error("Method not implemented.");
    }

    public static getPathsToFirestore(proprietary_id: string, restaurant_id: string):string[] {
        return ["proprietaires", proprietary_id, "restaurants", restaurant_id, "tables"]
    }
}
