import { InteractionBddFirestore } from "./interaction_bdd";
import { Address } from "./address"

export class RestaurantData implements InteractionBddFirestore {
  public "address":Address;
  public "name":string;
  public "id":string;
  public "is_client":Boolean;

  constructor(){
  }
  /**
     * chemin vers l'ensemble des utilisateurs de l'application
  */
  public static getPathsToFirestore(): string[] {
      return ["restaurants"]
  }
  /**
   * Cette fonction permet de copier un json de la base de donnée à une instance actueld de user
   * @param user user récupéré depuis la bdd à ajouter à l'instance actuel
   */
  public setData(restaurant:RestaurantData) {
    this.address = restaurant.address;
    this.name = restaurant.name;
    this.is_client = restaurant.is_client;
    this.id = restaurant.id;
  }
  public getData() {
   return {
    address: this.address,
    name: this.name,
    id: this.id,
    is_client: this.is_client
   };
  }
  getInstance(): InteractionBddFirestore {
    return new RestaurantData();
  }
}
