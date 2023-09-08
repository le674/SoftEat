import { InteractionBddFirestore } from "./interaction_bdd";

export class Ccommande implements InteractionBddFirestore {
  "id": string;
  "clients": Array<String> | null;
  "date": string | null;
  "etat": number | null;
  "commande": Array<Map<string, Map<string, string>[]>> | null;
  [index: string]: any;
  /**
   * permet de transformer les donnée JSON récupérer depuis la bdd firestore en objet MENU
   * @param data donnée Json récupérer depuis la base ded onnée firestore
   */
  setData(data: Ccommande) {
    this.id = data.id;
    this.clients = data.clients;
    this.date = data.date;
    this.commande = data.commande;
    this.etat = data.etat;
  }

  /**
   * permet de récupérer un menu depuis la base de donnée
   * @param id identifiant du menu dans la base de donnée
   * @returns {Object} JSON correspndant au menu 
  */
  getData(id: string | null, attrs: Array<string> | null, ...args: any[]) {
    let _attrs = Object.keys(this);
    let object: { [index: string]: any } = {};
    if (attrs) {
      _attrs = attrs
    }
    if (id) {
      this.id = id;
    }
    for (let attr of _attrs) {
      object[attr] = this[attr];
    }
    return object;
  }
  /**
   * Récupération d'une commande
   * @returns {InteractionBddFirestore}
   */
  getInstance(): InteractionBddFirestore {
    return new Ccommande();
  }
  /**
   * Permet de récupérer les tables du restaurant
   * @param proprietary_id identifiant du propriétaire contenant les tables
   * @param restaurant_id identifiant du restaurant contenant les tables
   * @returns {string[]} ensembe des tables de la base de donnée
   */
  public static getPathsToFirestore(proprietary_id: string, restaurant_id: string, tables_id: string): string[] {
    return ["proprietaires", proprietary_id, "restaurants", restaurant_id, "tables", tables_id, "commandes"]
  }
}
/*structure de commande */
/**
 * const myNestedDataArray: Array<Map<string, Map<string, string>[]>> = [];

const myNestedData: Map<string, Map<string, string>[]> = new Map();
// Remplir la première couche du Map
const firstLayerKey1 = "entree";
const firstLayerValue1: Map<string, string>[] = [
  new Map([["nom", "fondant au chocolat"], ["quantite", "2"]]),
  new Map([["nom", "tiramisu"], ["quantite", "1"]]),
];

const firstLayerKey2 = "plat";
const firstLayerValue2: Map<string, string>[] = [
  new Map([["nom", "boeuf bourgignon"], ["quantite", "1"]]),
  new Map([["nom", "pâte aux 4 fromage"], ["quantite", "1"]]),
];

// Ajouter les valeurs à la première couche du Map
myNestedData.set(firstLayerKey1, firstLayerValue1);
myNestedData.set(firstLayerKey2, firstLayerValue2);

// Ajouter myNestedData comme premier élément de myNestedDataArray
myNestedDataArray.push(myNestedData);

// Accéder aux données dans le tableau
for (const outerMap of myNestedDataArray) {
  for (const [outerKey, innerMapArray] of outerMap) {
    console.log(`Clé externe : ${outerKey}`);
    for (const innerMap of innerMapArray) {
      for (const [key, value] of innerMap.entries()) {
        console.log(`Clé interne : ${key}, Valeur : ${value}`);
      }
    }
  }
}


console.log("2 --------------------------------------");
console.log(myNestedDataArray[1]);
 * 
 */