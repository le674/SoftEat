import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculConsoServiceTsService {

  constructor() { }

  stringToDate(date_time:string) : Date{
    console.log(date_time);
    let date_time_array = date_time.split(" ")
    let time = date_time_array[1];
    
    let date = date_time_array[0];
    
    const date_array = date.split('/');
    const time_array = time.split(':').map((time) => Number(time));
    
    const date_array_num = date_array.reverse().map((date) => Number(date));
    const date_time_array_num = date_array_num.concat(time_array);

    return new Date(date_time_array_num[0],date_time_array_num[1] - 1,
       date_time_array_num[2], date_time_array_num[3], date_time_array_num[4], date_time_array_num[5]) 
  }

  getCostTtc(taux_tva:number,cost:number): number {
    const _to_add_pourcent = cost*(taux_tva/100); 
    return cost + _to_add_pourcent;
  }

  convertUnity(unity: string, is_full: boolean):string {
    if(is_full){
      if(unity === 'm') return 'm (mètre)';
      if(unity === 'g') return 'g (grame)';
      if(unity === 'kg') return 'kg (kilogramme)';
      if(unity === 'L') return 'L (litre)';
      if(unity === 'ml') return 'ml (millilitre)';
      if(unity === 'cl') return 'cl (centilitre)';
      if(unity === 'p') return 'p (pièce)';
    }
    else{
      if(unity  === 'm (mètre)') return 'm';
      if(unity === 'g (grame)') return 'g';
      if(unity === 'kg (kilogramme)') return 'kg';
      if(unity === 'L (litre)') return 'L';
      if(unity === 'ml (millilitre)') return 'ml';
      if(unity === 'cl (centilitre)') return 'cl';
      if(unity === 'cl') return 'cl (centilitre)';
      if(unity === 'p') return 'p (pièce)';
    }
    return ''
  }
}
