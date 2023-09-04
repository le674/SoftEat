import { WhereFilterOp } from "@angular/fire/firestore";
import { Proprietary } from "./proprietaire";

/**
 * Cette classe permet les interaction avec la base de donnée. Toute classe qui intéragie avec Firestore doit hériter de cette classe
 */
export interface InteractionBddFirestore {
    /**
     * Permet de transformer un objet en JSON pour l'ajouter dans la base de donnée Firestore de l'application
     * @param args 
     */
    setData(...args:any[]):any;
    /**
     * Permet de transformer un JSON en objet afin de récupérer le JSON depuis al base de donnée
     * @param id identifiant de l'objet que l'on veut ajouter dans la base de donnée
     * @param args 
     */
    getData(id:string | null,...args:any[]):any;
    /**
     * Permet de récupérer une instance de l'interface
     */
    getInstance():InteractionBddFirestore;
}

export type Class<T> = new (...args: any[]) => T;
export type Condition = {
    attribut:string,
    condition:WhereFilterOp,
    value:any
}
/**
 * @description permet de configurer une transaction avec la base de donnée
 * @param path chemin vers la donnée à récupérer pour la transaction
 * @param doc_id identifiant de la donnée à récupérer pour réaliser al transaction
 * @param transaction type de transaction récupération des donnés, ajout, mise à jours
 * @param operation null lors de la récupération de donnée, opération à appliquer aux donnés avant leur écriture dans la base de donnée
 * lors de la mise à jours de donnés seuls les donnés récupérés dans la bdd peuvent être utilisez
 *   operation:((data:Array<InteractionBddFirestore> | null, ...result:any) => InteractionBddFirestore | null) 
 * lors de l'ajout de donnés préférer 
 *   operation:((data:Array<InteractionBddFirestore> | null, InteractionBddFirestore) => InteractionBddFirestore | null) | null,
 * Avec le deuxième paramètre qui est la donnée à ajouter dans la base de donnée
 * @param class Class de la donnée à ajouter/récupérer dans/depuis la base de donnée
 */
export type TransactionalConf = {
    path:Array<string>,
    doc_id:string | null,
    transaction:"set" | "update" | "get" ,
    operation:((data:Array<InteractionBddFirestore> | null, ...result:any) => InteractionBddFirestore | null) | null,
    class:Class<InteractionBddFirestore> | null
}
