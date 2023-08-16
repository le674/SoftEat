import { InteractionBddFirestore } from "./interaction_bdd";

export class Conversation implements InteractionBddFirestore{
    author:string | null;
    container:string | null;
    content:string | null;
    name:string | null;
    surname:string | null;
    timestamp:number;
    newDay?: boolean;
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
    getData(id: string | null, ...args: any[]) {
        return {
            author: this.author,
            container: this.container,
            content:this.content,
            name:this.name,
            surname:this.surname,
            timestamp:this.timestamp
        }
    }
    getInstance(): InteractionBddFirestore {
        return new Conversation();
    }
    public static getPathsToFirestore(proprietary_id:string, restaurant_id:string){
        return  ["proprietaires", proprietary_id, "restaurants", restaurant_id, "internal_conversations"];
    }
}