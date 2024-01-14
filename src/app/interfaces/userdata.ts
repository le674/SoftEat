import { InteractionBddFirestore } from "./interaction_bdd";

export class UserData implements InteractionBddFirestore {
  public "email":string;
  public "role":string | null;
  public "uid":string;
  public "fidelite":Number;
  public "displayName" : string;

  constructor(){
  }
  /**
     * chemin vers l'ensemble des utilisateurs de l'application
  */
  public static getPathsToFirestore(): string[] {
      return ["users"]
  }
  /**
   * Cette fonction permet de copier un json de la base de donnée à une instance actueld de user
   * @param user user récupéré depuis la bdd à ajouter à l'instance actuel
   */
  public setData(user:UserData) {
    this.email = user.email;
    this.role = user.role;
    this.fidelite = user.fidelite;
    this.uid = user.uid;
  }
  public getData() {
   return {
    email: this.email,
    role: this.role,
    uid: this.uid,
    fidelite: this.fidelite
   };
  }
  getInstance(): InteractionBddFirestore {
    return new UserData();
  }
}
