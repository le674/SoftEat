import { Record } from "../interfaces/fec";
import { TransactionalConf } from "../interfaces/interaction_bdd";
import { Proprietary } from "../interfaces/proprietaire";

export class Transaction {
    public static addRecord(prop:string){
        return [
            {
              path:Proprietary.getPathsToFirestore(),
              doc_id:prop,
              transaction:"get",
              operation:null,
              class:Proprietary 
            },
            {
              path:Proprietary.getPathsToFirestore(),
              doc_id:prop,
              transaction:"update",
              operation:Proprietary.incRecord,
              class:Proprietary
            },
            {
              path:Record.getPathsToFirestore(prop),
              doc_id:null,
              transaction:"set",
              operation:Record.incRecord,
              class:Record
            }
          ] as Array<TransactionalConf>;
    }

}