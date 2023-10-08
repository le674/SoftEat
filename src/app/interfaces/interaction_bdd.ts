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
     * @param attr attributs à modifier pour l'objet en base, null lorsque l'objet est récupérer entièrmeent 
     * @param args 
     */
    getData(id:string | null, attrs:Array<string> | null, ...args:any[]):any;
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
 * @param doc_id liste des identifiants des données à récupérer pour réaliser la transaction
 * @param transaction type de transaction récupération des donnés, ajout, mise à jours
 * @param operation null lors de la récupération de donnée, opération à appliquer aux donnés avant leur écriture dans la base de donnée
 * lors de la mise à jours de donnés seuls les donnés récupérés dans la bdd peuvent être utilisez
 *   operation:((data:Array<InteractionBddFirestore> | null, ...result:any) => InteractionBddFirestore | null) 
 * lors de l'ajout de donnés préférer 
 *   operation:((data:Array<InteractionBddFirestore> | null, InteractionBddFirestore) => InteractionBddFirestore | null) | null,
 * Avec le deuxième paramètre qui est la donnée à ajouter dans la base de donnée
 * @param operation_ids permet de récupérer des chemins des précédents appels a get 
 * @param class Class de la donnée à ajouter/récupérer dans/depuis la base de donnée
 */
export type TransactionalConf = {
    path:Array<string>,
    doc_id:Array<string> | null,
    transaction:"set" | "update" | "get" ,
    operation:((data:Array<Array<InteractionBddFirestore>> | null, ...result:any) => InteractionBddFirestore | null) | null,
    operation_ids:((data:Array<Array<InteractionBddFirestore>> | null, ...result:any) => Array<string> | null) | null,
    class:Class<InteractionBddFirestore> | null
}

/**
 * @description permet de configurer une transaction avec uniquement les écritures en base de donnée
 * @param path chemin vers la donnée à ajoute/modifier en base
 * @param doc_id identifiant de la donnée à modifier/supprimer, null si ajout
 * @param transaction type d'opération à effectuer sur la base de donnée
 * @param operation opération à appliquer aux donnés avant leur écriture dans la base de donnée
 * @param class Class de la donnée à ajouter/récupérer dans/depuis la base de donnée
 * @param instance intance de la classe que nous shouaitons modifier ajouter en base 
 */
export type TransactionalWriteOnlyConf = {
    path:Array<string>,
    doc_id:string | null,
    transaction:"set" | "update" | "delete" ,
    operation:((data:Array<InteractionBddFirestore> | null, ...result:any) => InteractionBddFirestore | null) | null,
    class:Class<InteractionBddFirestore> | null,
    instance:InteractionBddFirestore
    attrs:Array<string> | null
}
