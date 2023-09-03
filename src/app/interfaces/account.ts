import { InteractionBddFirestore } from "./interaction_bdd";

export type Taccount = {
    class: number;
    credit: number;
    debit: number;
    desc: string;
    id: string;
    name: string;
    number: number;
    solde: number;
} 

export class Account implements InteractionBddFirestore {
    public class: number;
    public credit: number;
    public debit: number;
    public desc: string;
    public id: string;
    public name: string;
    public number: number;
    public solde: number;

    constructor() {
        this.class = 0;
        this.credit = 0;
        this.debit = 0;
        this.desc = "";
        this.id = "";
        this.name = "";
        this.number = 0;
        this.solde = 0;
    }

    /**
     * chemin vers l'ensemble des employees dans firestore
     * @param prop enseigne pour laquel nous souhaitons récupérer les employees
   */
    public static getPathsToFirestore(prop:string){
        return ["proprietaires", prop, "accounts"];
    }
    /**
     * Nous ajoutons à l'instance de l'objet actuel un JSON en signature de la fonction
     * @param account JSON que nous ajoutons à l'instance de l'objet actuel
     */
    public setData(account: Account) {
        this.class = account.class;
        this.credit = account.credit;
        this.debit = account.debit;
        this.desc = account.desc;
        this.id = account.id;
        this.name = account.name;
        this.number = account.number;
        this.solde = account.solde;
    }
    /**
     * Retourne un json pour l'écrire dans la base de donnée
     * @returns un JSON pour écriture dans la base de donnée
     */
    public getData(): any {
        return {
            class: this.class,
            credit: this.credit,
            debit: this.debit,
            desc: this.desc,
            id: this.id,
            name: this.name,
            number: this.number,
            solde: this.solde
        }
    }
    /**
     * retourne une instance d'un compte
     * @returns {Account} 
     */
    public getInstance(): InteractionBddFirestore {
        return new Account();
    }

    /**
     * Permet de récupérer des comptes particuliés pour une transaction 
     * @param transaction transaction pour lequel nous voulons récupérer une liste spécifique de comptes
     * @param accounts ensemble des comptes existant du restaaurant sur lesquelles nous souhaitons filtrer
    */
    public static getPreAddedAccount(accounts:Array<Account>, transaction:string){
        if(transaction === "facture"){
            accounts =  accounts.filter((account) => account.number === 1 || account.number === 20);
        }
        return accounts
    }
}