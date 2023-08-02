import { CommonService } from "../services/common/common.service";

export class Statut {
    analyse: string;
    budget: string;
    facture: string;
    planning: string;
    stock: string;
    recette:string;
    clients:string;
    [index:string]:any;
    constructor(private common_service: CommonService) {
        this.analyse = "";
        this.budget = "";
        this.facture = "";
        this.planning = "";
        this.stock = "";
        this.recette = "";
        this.clients = "";
    }
    /**
     * permet de retourner une liste de role à partir des status 
     * @param is_prop boolean permettant de déterminer si l'employée est un propriétaire
     * @returns liste des roles de l'employée 
     */
    public getRoles(is_prop:boolean):Array<string> {
        let roles:Array<string> = [];
        if(is_prop){
            roles.push("propriétaire");
            return roles;
        }
        if (this.stock?.includes("r")) {
            if (this.stock?.includes("w")) {
                roles.push("cuisinié");
            }
            else {
                roles.push("serveur");
            }
        }
        if (this.analyse?.includes("r")) {
            if (this.analyse?.includes("w")) {
                roles.push("prévisionniste");
            }
            else {
                roles.push("analyste");
            }
        }
        if (this.budget?.includes("r")) {
            if (this.budget?.includes("w")) {
                roles.push("economiste")
            }
            else {
                roles.push("economiste")
            }
        }
        if (this.facture?.includes("r")) {
            if (this.facture?.includes("w")) {
                roles.push("comptable +");
            }
            else {
                roles.push("comptable");
            }
        }
        if (this.planning?.includes("w")) {
            roles.push("RH");
        }
        if (this.stock?.includes("w") && this.planning?.includes("w") &&
            this.facture?.includes("w") && this.analyse?.includes("w") &&
            this.budget?.includes("w")) {
            roles = ["gérant"];
        }
        return roles;
    }
    /**
     * permet de copier l'objet statut dans cette instance de statut
     * @param statut Json statut, récupéré depuis la base de donnée 
     */
    setData(statut: Statut) {
        if(statut.analyse !== undefined){
            this.analyse = statut.analyse;
        }
        else{
            this.analyse = "";
        }
        if(statut.budget !== undefined){
            this.budget = statut.budget;
        }
        else{
            this.budget = "";
        }
        if(statut.facture !== undefined){
            this.facture = statut.facture;
        }
        else{
            this.facture = "";
        }
        if(statut.planning !== undefined){
            this.planning = statut.planning;
        }
        else{
            this.planning = "";
        }
        if(statut.stock !== undefined){
            this.stock = statut.stock;
        }
        else{
            this.stock = "";
        }
        if(statut.recette!== undefined){
            this.recette = statut.recette;
        }
        else{
            this.recette = "";
        }
        if(statut.clients !== undefined){
            this.clients = statut.clients;
        }
        else{
            this.clients = "";
        }
      }
    /**
     * Permet de récupérer un Json contenant les information statut
     */      
    getData(){
        return {
            analyse: this.analyse,
            budget: this.budget,
            facture: this.facture,
            planning: this.planning,
            stock: this.stock,
            recette: this.recette,
            clients: this.clients
        }
    }
}