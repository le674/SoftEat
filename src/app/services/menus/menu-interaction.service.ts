import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { child, Database, get, getDatabase, ref } from 'firebase/database';
import { Cetape, Etape } from 'src/app/interfaces/etape';
import { Cconsommable, CIngredient } from 'src/app/interfaces/ingredient';
import { Cmenu, TMPmenu } from 'src/app/interfaces/menu';
import { Cplat } from 'src/app/interfaces/plat';
import { ConsommableInteractionService } from './consommable-interaction.service';
import { IngredientsInteractionService } from './ingredients-interaction.service';
import { PlatsInteractionService } from './plats-interaction.service';

@Injectable({
  providedIn: 'root'
})
export class MenuInteractionService {
  private db: Database;
  private menus: Array<Cmenu>

  constructor(private ofApp: FirebaseApp, private ingredient_service: IngredientsInteractionService,
     private conso_service: ConsommableInteractionService, private plat_service: PlatsInteractionService ) { 
    this.db = getDatabase(ofApp);
    this.menus = [];
  }

  async getMenusFromRestaurants(prop: string, restaurant: string) {
    const ref_db = ref(this.db);
    const path = `menu_${prop}_${restaurant}/${prop}/${restaurant}/`;
    await get(child(ref_db, path)).then((menus) => {
      menus.forEach((menu) => {
          const add_menu = new Cmenu();
          let tmp_ings:Array<{id:string, quantity:number, unity:string}> = [];
          let tmp_conso:Array<{id:string, quantity:number, unity:string}> = [];
          let tmp_plats:Array<{id:string, quantity:number, unity:string}> = [];
          let res_etapes:Array<Cetape> = [];
          let consommables = menu.child("consommables").val();
          let ingredients = menu.child("ingredients").val();
          let plats = menu.child("plat").val();
          let etapes = menu.child("etapes").val();
          const iter_ing:[string, {quantity:number, unity:string}][] = Object.entries(ingredients);
          const iter_plats:[string, {quantity:number, unity:string}][] = Object.entries(plats);
          const iter_consommbales:[string, {quantity:number, unity:string}][] = Object.entries(consommables);
          const iter_etapes:[string, {commentaire:string, temps:number}][] = Object.entries(etapes);
          
          for(let [id_ing, ing_data] of iter_ing){
            const curr_ing = {id: id_ing, quantity:ing_data.quantity, unity: ing_data.unity};
            tmp_ings.push(curr_ing);
          }
          for(let [id_conso, conso_data] of iter_consommbales){
            let curr_conso = {id: id_conso, quantity:conso_data.quantity, unity: conso_data.unity};
            tmp_conso.push(curr_conso);
          }
          for(let [id_plat, plat_data] of iter_plats){
            const curr_plat = {id: id_plat, quantity:plat_data.quantity, unity: plat_data.unity};
            tmp_plats.push(curr_plat);
          }
          for(let [id_etape, etape_data] of iter_etapes){
            let curr_etape = new Cetape();
            curr_etape.setNom(id_etape);
            curr_etape.setComentaire(etape_data.commentaire);
            curr_etape.setTemps(etape_data.temps);
            res_etapes.push(curr_etape);
          }
          const ing_lst =  tmp_ings.map((ingredient) => ingredient.id)
          const conso_lst = tmp_conso.map((conso) => conso.id);
          const ing_prom = this.ingredient_service.getIngredientsBrFromRestaurantsPROM(prop, restaurant, ing_lst).then((ingredients) => {
            const menu_ings = new Array<CIngredient>;
            for(let ingredient of ingredients){
              let curr_ing = {id:"",quantity:0, unity:"p"};
              let curr_ings = tmp_ings.filter((ing) => ing.id === ingredient.nom);
              if(curr_ings.length > 0){
                curr_ing = curr_ings[0];
              }
              if(ingredient.vrac){
                ingredient.quantity_unity = curr_ing.quantity;
              }
              else{
                ingredient.quantity = curr_ing.quantity;
              }
              ingredient.unity = curr_ing.unity;
              menu_ings.push(ingredient);
            }
            return menu_ings
          })
          ing_prom.then((ingredients) => {
              const conso_prom = this.conso_service.getConsommablesFromRestaurantsFiltreIds(prop, restaurant, conso_lst).then((consos) => {
                const menu_conso = new Array<Cconsommable>;
                for(let conso of consos){
                  let curr_conso = {id:"",quantity:0, unity:"p"};
                  let curr_consos = tmp_conso.filter((fconso) => fconso.id === conso.nom);
                  if(curr_consos.length > 0){
                    curr_conso = curr_consos[0];
                  }
                  conso.quantity = curr_conso.quantity;
                  conso.unity = curr_conso.unity;
                  menu_conso.push(conso);
                }
                return {ingredients: ingredients, consommables: menu_conso}
              })

              conso_prom.then((consos_ings) => {
              const plat_prom = this.plat_service.getPlatsFromRestaurantsFiltreIds(prop, restaurant, consos_ings.ingredients, consos_ings.consommables, tmp_plats).then((plats) => {
                return {ingredients: consos_ings.ingredients, consommables: consos_ings.consommables, plats: plats}
              })
              plat_prom.then((ings_conso_plats) => {
                    const curr_menu = new Cmenu();
                    if(menu.key !== null){
                      curr_menu.setNom(menu.key);
                      curr_menu.setEtapes(res_etapes);
                      curr_menu.setIngredients(ings_conso_plats.ingredients);
                      curr_menu.setConsommbale(ings_conso_plats.consommables);
                      curr_menu.setPlats(ings_conso_plats.plats);
                    }
                  this.menus.push(curr_menu);
               })
             })
          })
      })
    })
    return this.menus
  }

}
