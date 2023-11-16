import { InteractionBddFirestore } from "./interaction_bdd";
export class Ctable implements InteractionBddFirestore{
    "id":string;
    "seats": number | null;
    "tableOccupied":boolean | null;
    "tableNumber":string | null;
    [index:string]:any;
    /**
     * permet de transformer les donnée JSON récupérer depuis la bdd firestore en objet MENU
     * @param data donnée Json récupérer depuis la base ded onnée firestore
     */
    setData(data: Ctable) {
        this.id = data.id;
        this.seats = data.seats;
        this.tableOccupied = data.tableOccupied;
        this.tableNumber = data.tableNumber;
    }
    /**
     * permet de récupérer un menu depuis la base de donnée
     * @param id identifiant du menu dans la base de donnée
     * @returns {Object} JSON correspndant au menu 
     */
    getData(id:string | null, attrs:Array<string> | null, ...args: any[]) {
        let _attrs = Object.keys(this);
        let object: { [index: string]: any } = {};
        if (attrs) {
          _attrs = attrs
        }
        if (id) {
          this.id = id;
        }
        for (let attr of _attrs) {
          object[attr] = this[attr];
        }
        return object;
    }
    getInstance(): InteractionBddFirestore {
        return new Ctable();
    }
    public static getPathsToFirestore(proprietary_id: string, restaurant_id: string):string[] {
        return ["proprietaires", proprietary_id, "restaurants", restaurant_id, "tables"]
    }
}
