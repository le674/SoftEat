import { InteractionBddFirestore } from "./interaction_bdd";

/**
 * @class Record permet de conserver un enregistrement comptable
 * @param account_ids identifiant des comptes associés à cette transaction
 * @param account_ids_src identifiant des compte associé à cette transaction pour l'entreprise émettrice
 * @param credit_ammount montant crédité par la transaction
 * @param debit_ammount montant débité par la transaction
 * @param description description de la transaction (ex. Loyer du mois de janvier)
 * @param devise devise de la transaction (ex. EUR)
 * @param id identifiant de l'enregistrement de la transaction
 * @param id_src identifiant de du justificatif de transaction (numéro de facture par exemple)
 * @param journal_name nom journal parmit 
 * 
 */
export class Record implements InteractionBddFirestore {
    account_ids:Array<string>;
    account_ids_src:Array<string> | null;
    credit_ammount:number;
    debit_ammount:number;
    description:string;
    devise:string | null;
    devise_ammount:number | null;
    lettrage:string | null;
    id:string;
    id_src:string;
    journal_name:string;
    journal_label:string;
    name:string;
    nature:string;
    number:number;
    reception_date:string;
    validation_date:string;
    send_date:string;
    [index:string]:any;
    constructor(){
        this.account_ids = [];
        this.account_ids_src = null;
        this.credit_ammount = 0;
        this.debit_ammount = 0;
        this.description = "";
        this.devise = null;
        this.devise_ammount = null;
        this.lettrage = null;
        this.id = "";
        this.id_src = "";
        this.journal_name = "";
        this.name = "";
        this.nature = "";
        this.number = 0;
        this.reception_date = "";
        this.validation_date = "";
        this.send_date = "";
        this.journal_label = "";
    }

    /**
     * Cette fonction permet de construire une instance d'un enregistrement à partir d'un enregistrement transmit en 
     * parmaètre
     * @param record eenregistrement que nous constuisons à partir d'un enregistrement transmit en paramètre
     */
    public setData(record: Record) {
      for (let key of Object.keys(this)) {    
        this[key] = record[key];
      } 
    }
    /**
     * Cette fonction permet d'ajouter à la base de donnée un nouveau JSON représentant un enregistrement
     * @param id lors de l'ajout d'un nouvelle enregistrement identifiant du nouvelle enregistrement
     * @returns {Object} JSON représentant un enregistrmeent à ahouter à la base de donnée 
     */
    public getData(id: string | null) {
        if (id !== null) {
            this.id = id;
        }   
        return {
            account_ids: this.account_ids,
            account_ids_src:this.account_ids_src,
            credit_ammount: this.credit_ammount,
            debit_ammount: this.debit_ammount,
            description: this.description,
            devise:this.devise,
            devise_ammount: this.devise_ammount,
            lettrage: this.lettrage,
            id:this.id,
            id_src:this.id_src,
            journal_name: this.journal_name,
            name: this.name,
            nature:this.nature,
            number:this.number,
            reception_date: this.reception_date,
            validation_date: this.validation_date,
            send_date: this.send_date
        };
    }
    /**
     * permet de générer une autre instance de l'objet record
     * @returns une instance de record
    */
    public getInstance(): InteractionBddFirestore {
        return new Record();
    }
}

export class Journal {
    name:string;
    desc:string;
    debit:number;
    credit:number;
    solde:number;
    date:string;

    constructor(){
        this.name = "";
        this.desc = "";
        this.debit = 0;
        this.credit = 0;
        this.solde = 0;
        this.date = "";
    }
    /**
     * permet de récupérer les journaux par défauts
     * AC = Achat, CA = Caisse, OD = Opération diverses, BA = Banque, VE = Ventes  
     * @returns {Array<{name:string, description:string}>} [{name:"AC",description:"achat"}, {name:"CA",description:"caisse"}, {name:"OD",description:"opération diverses"}, {name:"BA",description:"banques"}, {name:"VE",description:"ventes"}]
    */
    public static defaultJournal(){
        return [
            {
                name:"AC",label:"achat", description:"ensemble des achats réalisés par l'entreprise"
            }, 
            {
                name:"CA",label:"caisse",description:"ensemble des transaction en espèce réalisés"
            }, 
            {
                name:"OD",label:"opération diverses",description:"ensemble des opération que l'on ne peut pas catégoriser dans les autres journaux"
            }, 
            {
                name:"BA",label:"banques", description:"ensemble des transactions réalisés directement avec la banques (virement, etc...)"
            }, 
            {
                name:"VE",label:"ventes", description:"ensemble des vente réalisés par l'entreprise"
            }];
    }
}