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
     * @param args 
     */
    getData(...args:any[]):any;
    /**
     * Permet de récupérer une instance de l'interface
     */
     getInstance():InteractionBddFirestore;
}