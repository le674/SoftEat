import { Account } from "./account";
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
 * @param journal_name abréviation d'un nom de journal pour la fec
 * @param journal_label nom journal fec
 * @param name référence de la pièce justificatif
 * @param nature nature de la pièce justificatif  
 * @param number identifiant de la pièce justificatif dans le fichier expertise comptable
 * @param reception_date date de reception de l'enregistrement comptable
 * @param validation_date date de validation du fec
 * @param send_date date d'envoie de la pièce justificatif
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
    public getData(id: string | null, attrs:Array<string> | null, ...args: any[]) {
        let _attrs = Object.keys(this);
        let object:{[index:string]:any} = {};
        if(attrs){
            _attrs = attrs
        }
        if(id){
            this.id = id;
        }
        for(let attr of _attrs){
            object[attr] = this[attr];
        }
        return object;
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
            this.lettrage = this.lettrage + `&identifiant=${this.id_src}`;
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
     * Permet de récupérer le chemin dans la base de donnée vers Firestore
     */
    public static getPathsToFirestore(prop_id:string){
        return ["proprietaires", prop_id, "recording"];
    }
    /**
     * Cette partie contient l'ensemble des fonctions d'intéraction avec la base de doonnée
    */
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
     * Permet de formatter une date sous la forme d'une chaine de carctère
     * @param date date que nous transformons en chaine de carctère
     */
    public static formatDate(date:Date){
            let _date = date.getFullYear().toString();
            let _month = (date.getMonth() + 1).toString();
            let _days = date.getDate().toString();
            if(_month.length === 1){
                _month = `0${_month}`
            }
            if(_days.length === 1){
                _days = `0${_days}`
            }
            return `${_date}${_month}${_days}`        
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

export class RowFec{
    id:string;
    code_journal:string;
    journal_label:string;
    number:number;
    date_reception:string;
    account_number:number;
    account_label:string;
    other_account_number:number | null;
    other_account_label:string | null;
    name:string;
    send_date:string;
    label_fec:string;
    debit_ammount:number;
    credit_ammount:number;
    lettrage:string | null;
    lettrage_date:string | null;
    valid_date:string;
    devise:number | null;
    identifiant_devise:string | null;
    [index:string]:any
    constructor(){
        this.code_journal = "";
        this.journal_label = "";
        this.number = 0;
        this.date_reception = "";
        this.account_number = 0;
        this.account_label = "";
        this.other_account_label = null;
        this.other_account_number = null;
        this.name = "";
        this.send_date = "";
        this.label_fec = "";
        this.id=""; 
        this.debit_ammount = 0;
        this.credit_ammount = 0;
        this.valid_date = "";
        this.lettrage = null;
        this.lettrage_date = null;
        this.devise = null;
        this.identifiant_devise = null;
    }
    public setRecord(record:Record, accounts:Array<Account>){
        let sec_account:Account | undefined | null = null;
        let account:Account | undefined | null = null;
        account = accounts.find((account) => account.id === record.account_ids[0]);
        sec_account = accounts.find((account) => account.id === record.account_ids[1]);
        this.code_journal = record.journal_name;
        this.journal_label = record.journal_label;
        this.number = record.number;
        this.date_reception = new Date(record.reception_date).toLocaleString();
        if(account){
            this.account_number = account.number;
            this.account_label = account.name;
        }
        if(sec_account){
            this.other_account_number = sec_account.number;
            this.other_account_label = sec_account.name;
        }
        this.name = record.name;
        this.send_date = new Date(record.send_date).toLocaleString();
        this.label_fec = record.journal_label;
        this.debit_ammount = record.debit_ammount;
        this.credit_ammount = record.credit_ammount;
        this.lettrage = record.lettrage;
        this.lettrage_date = record.reception_date;
        this.valid_date = "";
        this.devise = record.devise_ammount;
        this.identifiant_devise = record.devise;
        this.id = record.id;
        return this;
    }
    public suppNulls():RowFec {
        this.other_account_label = this.other_account_label ?? "pas de données";
        this.lettrage = this.lettrage ?? "pas de données";
        this.lettrage_date = this.lettrage_date ?? "pas de données";
        this.identifiant_devise = this.identifiant_devise ?? "pas de données";
        return this;
    }
    /**
     * Retourne une liste des attributs dans l'ordre de display columns pour l'affichage d'un enregistrement
     * @returns liste de l'ensemble des clefs disponibles 
     */
       public static getKeys(){
        return ['code_journal', 'journal_label', 'number', 'date_reception', 'account_number',
         'account_label', 'other_account_label','other_account_number', 'name', 'send_date',
         'label_fec', 'debit_ammount', 'credit_ammount', 'lettrage', 'lettrage_date',
         'valid_date','devise','identifiant_devise'];
    }
}