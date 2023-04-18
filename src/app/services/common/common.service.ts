import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor() { 
  }

  // l'argument type dépend du tbaleau que l'on souhaite transformer 
  getMobileBreakpoint(type:string):boolean{
    if ((window.innerWidth < 768) && (type !== "ing")) {
      return true;
    }
    if((type === "ing") && (window.innerWidth < 876)){
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

}
