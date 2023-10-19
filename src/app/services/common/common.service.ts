import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private read_count:number;
  constructor() { 
    this.read_count = 0;
  }

  // l'argument type dépend du tbaleau que l'on souhaite transformer 
  getMobileBreakpoint(type:string):boolean{
    if((type === "acceuil") && (window.innerWidth < 780)){
      return true;
    }
    if((type === "ing") && (window.innerWidth < 876)){
      return true;
    }
    if((type === "prepa") && (window.innerWidth < 876)){
      return true;
    }
    if((type === "conso") && (window.innerWidth < 876)){
      return true;
    }
    if((type === "mobile") && (window.innerWidth < 1040)){
      return true;
    }
    return false;
  }
  accordeonMaxWidth(): any {
    if((window.innerWidth < 768) && (window.innerWidth > 600)) {
      return 500; // Largeur maximale pour les écrans plus petits que 768px
    } 
    if((window.innerWidth < 600) && (window.innerWidth > 480)){
      return 380;
    }
    if((window.innerWidth < 480) && (window.innerWidth > 414)){
      return 314;
    }
    if((window.innerWidth < 414) && (window.innerWidth > 375)){
      return 275;
    }
    if((window.innerWidth < 375) && (window.innerWidth > 320)){
      return 220;
    }
    return window.innerWidth - 100;
  }
  getRoles():(string | string[])[]{
    const role_name = [
      "","cuisinié", "serveur",
      ["analyste", "economiste", "prévisionniste", "comptable", "comptable +"],
      "RH", "gérant", "propriétaire"
    ]; 
    return role_name; 
  }
  getStatut():Array<string>{
    return ["analyse", "budget", "facture", "planning", "stock", "recette", "clients"];
  }
  getColumnAdminTab():Array<string>{
    return ["id", "email", "restaurants", "read_right", "write_right", "validation"];
  }
  getMonths():Array<string>{
    return ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
  }
  /**
   * @param year année pour lequel on veut récupérer la liste de jours
   * @param month mois pour lequel nous voulons récupérer la lise de jours
   * @returns liste des jours 
   */
  getDays(year:number, month:number):Array<string>{
    const num_days = new Date(year, month, 0).getDate();
    return Array.from({length: num_days}, (_, i) => (i + 1).toString());
  }
  incCounter():any{
    this.read_count = this.read_count + 1;
  }
  decCounter():any{
    this.read_count = this.read_count - 1;
  }
  getCounter():number{
    return this.read_count;
  }
  checkNullString(stringOrNull: string | null): string {
    return stringOrNull ?? "";
  }
  checkNullNum(stringOrNull: number | null): number {
    return stringOrNull ?? 0;
  }
}
