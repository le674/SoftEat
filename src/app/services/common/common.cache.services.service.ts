import { Injectable } from '@angular/core';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class CommonCacheServices {
  private user: User | null
  private restaurants: Array<Restaurant> | null;
  private proprietary_id:string | null;
  constructor() { 
    this.restaurants = null;
    this.proprietary_id = null;
    this.user = null;
  }
  getRestaurants(){
    return this.restaurants;
  }
  setRestaurants(restaurants:Array<Restaurant>){
    this.restaurants = restaurants;
  }
  getProprietary(){
    return this.proprietary_id;
  }
  setProprietary(proprietary_id:string){
    this.proprietary_id = proprietary_id;
  }
  getUser(){
    return this.user;
  }
  setUser(user:User){
    this.user = user;
  }
}
