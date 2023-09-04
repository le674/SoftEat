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

    constructor(){
        this.email = "";
        this.exigences = [];
        this.id = "";
        this.name = "";
        this.record = 0;
        this.restaurant_number = 0;
        this.uid = ""
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
    }
    getData(id: string | null, ...args: any[]) {
        if(id){
            this.id = id;
        }
        return {
            email:this.email,
            exigences:this.exigences,
            id:this.id,
            name:this.name,
            record:this.record,
            restaurant_number:this.restaurant_number,
            uid:this.uid
        }
    }
    getInstance(): InteractionBddFirestore {
        return new Proprietary();
    }
    public static incRecord(data:Array<InteractionBddFirestore> | null):InteractionBddFirestore | null{
        let _data = null;
        if(data){
            _data = data[0] as Proprietary;
            _data.record = _data.record + 1;
        }
        return _data;
    }
    public static getPathsToFirestore(){
        return ["proprietaires"];
    }
}