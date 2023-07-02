import { CommonService } from "../services/common/common.service";

export class Statut {
    analyse: string;
    budget: string;
    facture: string;
    planning: string;
    stock: string;

    constructor(private common_service: CommonService) {
        this.analyse = "";
        this.budget = "";
        this.facture = "";
        this.planning = "";
        this.stock = "";
    }
    public getRoles():Array<string> {
        let roles:Array<string> = [];
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
    setStatut(statut: Statut) {
        this.analyse = statut.analyse;
        this.budget = statut.budget;
        this.facture = statut.facture;
        this.planning = statut.planning;
        this.stock = statut.stock;
      }
}