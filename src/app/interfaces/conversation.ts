import { InteractionBddFirestore } from "./interaction_bdd";

export class Conversation implements InteractionBddFirestore{
    author:string | null;
    container:string | null;
    content:string | null;
    name:string | null;
    surname:string | null;
    timestamp:number;
    newDay?: boolean;
    [index:string]:any;
    constructor(){
        this.author = null;
        this.container = null;
        this.content = null;
        this.name = null;
        this.surname = null;
        this.timestamp = 0;
    }
    setData(conversation:Conversation) {
        this.author = conversation.author;
        this.container = conversation.container;
        this.content = conversation.content;
        this.name = conversation.name;
        this.surname = conversation.surname;
        this.timestamp = conversation.timestamp;
    }
    getData(id: string | null, attrs:Array<string> | null, ...args: any[]) {
        let _attrs = Object.keys(this);
        let object:{[index:string]:any} = {};
        if(attrs){
            _attrs = attrs
        }
        for(let attr of _attrs){
            object[attr] = this[attr];
        }
        return object;
    }
    getInstance(): InteractionBddFirestore {
        return new Conversation();
    }
    public static getPathsToFirestore(proprietary_id:string, restaurant_id:string){
        return  ["proprietaires", proprietary_id, "restaurants", restaurant_id, "internal_conversations"];
    }
}