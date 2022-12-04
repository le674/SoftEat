export class User {
  public "name": string;
  public "proprietaire": string;
  public "restaurants": [{
    "adresse": string,
    "id": string
  }];
  public "roles": Array<string>;
  public "is_prop": boolean;
  public "alertes": string;
  public "analyse": string;
  public "budget": string;
  public "facture": string;
  public "stock": string;
  public "planning": string;
  public "prev_aliments": string;
  public "time_work": string;

  to_roles() {
    if (this.is_prop) {
      this.roles.includes("proprietaire");
      return null;
    }
    if (this.stock.includes("r")) {
      if (this.stock.includes("w")) {
        this.roles.push("cuisinié");
      }
      else {
        this.roles.push("serveur");
      }
    }

    if (this.analyse.includes("r")) {
      if (this.analyse.includes("w")) {
        this.roles.push("prévisionniste");
      }
      else {
        this.roles.push("analyste");
      }
    }

    if (this.budget.includes("r")) {
      if (this.budget.includes("w")) {
        this.roles.push("economiste")
      }
      else {
        this.roles.push("economiste")
      }
    }

    if (this.facture.includes("r")) {
      if (this.facture.includes("w")) {
        this.roles.push("comptable +");
      }
      else {
        this.roles.push("comptable");
      }
    }

    if (this.planning.includes("w")) {
      this.roles.push("RH");
    }

    if(this.stock.includes("w") && this.planning.includes("w") &&
     this.facture.includes("w") && this.analyse.includes("w") &&
      this.budget.includes("w")) {
      this.roles = ["gérant"];
    }

    return null;
  }
}