import { InteractionBddFirestore } from "./interaction_bdd";
import { User } from "./user";

export interface Proprietaire {
    "proprietaire": string;
    "employee":Array<User>;
}

export class Proprietary implements InteractionBddFirestore {
    email:string;
    exigences:Array<string>;
    id:string;
    name:string;
    record:number;
    restaurant_number:number;
    uid:string;
    siret:string;
    [index:string]:any

    constructor(){
        this.email = "";
        this.exigences = [];
        this.id = "";
        this.name = "";
        this.uid = ""
        this.siret = "";
        this.record = 0;
        this.restaurant_number = 0;
    }
    setData(proprietary:Proprietary) {
            if(proprietary.email){
                this.email = proprietary.email;
            }
            if(proprietary.exigences){
                this.exigences = proprietary.exigences;
            }
            if(proprietary.id){
                this.id = proprietary.id;
            }
            if(proprietary.name){
                this.name = proprietary.name;
            }
            if(proprietary.record){
                this.record = proprietary.record;
            }
            if(proprietary.restaurant_number){
                this.restaurant_number = proprietary.restaurant_number;
            }
            if(proprietary.uid){
                this.uid = proprietary.uid;
            }
            if(proprietary.siret){
                this.siret = proprietary.siret;
            }
    }
    getData(id: string | null,  attrs: Array<string> | null, ...args: any[]) {
        let _attrs = Object.keys(this);
        let object:{[index:string]:any} = {};
        if(id){
            this.id = id;
        }
        if(attrs){
            _attrs = attrs
        }
        for(let attr of _attrs){
            object[attr] = this[attr];
        }
        return object;
    }
    getInstance(): InteractionBddFirestore {
        return new Proprietary();
    }
    public static incRecord(data:Array<Array<InteractionBddFirestore>> | null, added_data:InteractionBddFirestore, id:string):InteractionBddFirestore | null{
        let _data = null;
        if(data){
            _data = data[0][0] as Proprietary;
            _data.record = _data.record + 1;
        }
        return _data;
    }
    public static getPathsToFirestore(){
        return ["proprietaires"];
    }
}