import { Ccommande } from "../interfaces/commande";
import { Cconsommable } from "../interfaces/consommable";
import { Facture } from "../interfaces/facture";
import { Record } from "../interfaces/fec";
import { CIngredient } from "../interfaces/ingredient";
import { TransactionalConf, TransactionalWriteOnlyConf } from "../interfaces/interaction_bdd";
import { Cplat } from "../interfaces/plat";
import { Proprietary } from "../interfaces/proprietaire";

export class Transaction {
    /**
     * Permet de configurer la transaction pour ajouter dans la base de donneé des objets
     * @property {Array<Object>} 
     * 1 récupération du propriétaire dans la base de donnée 
     * 2 modification de l'attribut record dans le propriétaire
     * 3 ajout d'un nouvelle enregistrement avec l'attribut record incrémenté de 1
     * @param prop identifiant du propriétaire pour lequel l'enregistrement est ajouté
     * @returns configuration de la transaction
     */
    public static addRecord(prop:string){
        return [
            {
              path:Proprietary.getPathsToFirestore(),
              doc_id:[prop],
              transaction:"get",
              operation_ids:null,
              operation:null,
              class:Proprietary 
            },
            {
              path:Proprietary.getPathsToFirestore(),
              doc_id:[prop],
              transaction:"update",
              operation_ids:null,
              operation:Proprietary.incRecord,
              class:Proprietary
            },
            {
              path:Record.getPathsToFirestore(prop),
              doc_id:null,
              transaction:"set",
              operation_ids:null,
              operation:Record.incRecord,
              class:Record
            }
          ] as Array<TransactionalConf>;
    }
    /**
     * @property {Array<Object>}
     * 1. modification du lettrage  et des information relatif à celui-ci dans l'enregistrmeent
     * 2. modification des information relatif au lettrage dans la facture  
     * @param prop identifiant du propriétaire pour lequel nous souhaitons modifier 
     * @param record_id identifaint de l'enregistrement à modifier
     * @param facture_id identifiant de la facture à modifier dans la base de donnée
     * @returns configuration de la transaction
     */
    public static changeLettrage(prop:string, record:Record, facture:Facture){
      return [
          {
            path:Record.getPathsToFirestore(prop),
            doc_id:record.id,
            transaction:"update",
            operation:null,
            class:Record,
            instance:record,
            attrs:["account_ids_src", "id_src", "send_date", "lettrage"] 
          },
          {
            path:Facture.getPathsToFirestore(prop),
            doc_id:facture.id,
            transaction:"update",
            operation:Facture.extractYearMonthDay,
            class:Facture,
            instance:facture,
            attrs:["account_id", "identifiant", "date_reception", "day", "month", "year"]
          }
        ] as Array<TransactionalWriteOnlyConf>;
  }
    /** 
     * @param prop identifiant du propriétaire pour lequel nous souhaitons modifier 
     * @param record enregistrement que l'on veut ajouter ou dont nous souhaitons modifier certains attributs
     * @param facture facture que nous voulons ajouter ou dont nous souhaitons modifier certains attributs
     * @returns configuration de la transaction
    */
    public static changeRecord(prop:string, record:Record, facture:Facture){
        return [
            {
              path:Record.getPathsToFirestore(prop),
              doc_id:record.id,
              transaction:"update",
              operation:null,
              class:Record,
              instance:record,
              attrs:["account_ids",
              "journal_name", "journal_label","debit_ammount",
              "credit_ammount", "description",
              "reception_date"] 
            },
            {
              path:Facture.getPathsToFirestore(prop),
              doc_id:facture.id,
              transaction:"update",
              operation:null,
              class:Facture,
              instance:facture,
              attrs:["ammount_total", "name"]
            }
          ] as Array<TransactionalWriteOnlyConf>;
    }
    /**
     * Configuration d'ajout d'une commande dans la base de donnée 
     * @param prop identifiant du propriétaire pour lequel nous souhaitons modifier 
     * @param commande commande que l'on souhaite ajouter à l'inventaire
     * @param restaurant_id identifiant du restaurant pour lequel nous voulons supprimer le plat
     * @param table_id identifiant de la table qui contient le plat à supprimer
     * @returns configuration de la transaction
     */
    public static addCommande(prop:string, restaurant_id:string, table_id:string ,commandes:Ccommande){
      let configuration:Array<TransactionalWriteOnlyConf> = [];
      if(commandes.commande){
         let ids:Array<string> = commandes.commande.map((commande) => Object.values(commande).map((plat) => plat.id)).flat();
         let quantity:Array<string> = commandes.commande.map((commande) => Object.values(commande).map((plat) => plat.quantity)).flat();
         let ok = [
          {
            path:Cplat.getPathsToFirestore(prop),
            doc_id:ids,
            transaction:'get',
            operations_ids:null,
            operation:null,
            class:Cplat
          },
          {
            path: CIngredient.getPathsToFirestore(prop, restaurant_id),
            doc_id:null,
            transaction:'get',
            operations_ids:Cplat.getIngredientsIds,
            operation:null,
            class:CIngredient
          },
          {
            path: CIngredient.getPathsToFirestore(prop, restaurant_id),
            doc_id:null,
            transaction:'update',
            operations_ids:CIngredient.getIds,
            operation:CIngredient.changeQuantity,
            class:CIngredient
          },
          {
            path:Ccommande.getPathsToFirestore(prop, restaurant_id,table_id),
            doc_id:null,
            transaction:'set',
            operation_ids:null,
            operation:null,
            class:Ccommande,
          }
        ]
      }
      return configuration;
    }
}