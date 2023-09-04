import { InteractionBddFirestore } from "./interaction_bdd";
import { Proprietary } from "./proprietaire";

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
    lettrage_label:string | null;
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
        this.lettrage_label = null;
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
            lettrage_label: this.lettrage_label,
            id:this.id,
            id_src:this.id_src,
            journal_name: this.journal_name,
            journal_label:this.journal_label,
            name: this.name,
            nature:this.nature,
            number:this.number,
            reception_date: this.reception_date,
            validation_date: this.validation_date,
            send_date: this.send_date
        };
    }
    /**
     * Permet de retourner les informations sur le lettrage
     */
    public lettrageLabel(){
        let prefix = ""
        if(this.send_date){
         prefix = prefix + "date, "
        }
        if(this.nature){
            prefix = prefix + "nature, ";
        }
        if(this.id_src){
           prefix = prefix + "identifiant";
        }
        if(this.account_ids_src){
            prefix = prefix + "comptes";
        }
         return prefix + this.constructLettrage();
    }
    /**
     * Permet de construiire un lettrage à partir des informations
     * 1. date, 2. nature, 3. identifiant de la facture, 4. comptes
     */
    public constructLettrage(){
        this.lettrage = ""
        if(this.send_date){
            this.lettrage = this.lettrage + `date=${this.send_date}`;
        }
        if(this.nature){
            this.lettrage = this.lettrage + `&nature=${this.nature}`;
        }
        if(this.id_src){
            this.lettrage = this.lettrage + `&identifiant=${this.nature}`;
        }
        if(this.account_ids_src){
            for (let index = 0; index < this.account_ids_src.length; index++) {
                const account = this.account_ids_src[index];
                this.lettrage = this.lettrage + `&comptes_${index}=${account}`;   
            }
        }
        return this.lettrage;   
    }
    /**
     * permet de générer une autre instance de l'objet record
     * @returns une instance de record
    */
    public getInstance(): InteractionBddFirestore {
        return new Record();
    }

    /**
     * Permet d'incrémenté l'id du nouvelle enregistrement de 1 par rarpport au nombre actuel d'enregistrement existant
     * @param bdd_data données récupérés avant l'ajout dans la base
     * @param added_data nombre actuel d'enregistrement
     * @returns un enregistrement avec l'argument record incrémenté de 1
     */
    public static incRecord(bdd_data:Array<InteractionBddFirestore> | null,added_data:InteractionBddFirestore):InteractionBddFirestore | null{
        let _record = null;
        let _bdd_data = bdd_data as Array<Proprietary>
        if(bdd_data){
            _record =  added_data as Record;
            _record.number = _bdd_data[0].record;
        }
        return _record;
    }
    /**
     * Permet de récupérer le chemin dans la base de donnée vers Firestore
     */
    public static getPathsToFirestore(prop_id:string){
        return ["proprietaires", prop_id, "recording"];
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