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
    private conso_service: ConsommableInteractionService, private plat_service: PlatsInteractionService) {
    this.db = getDatabase(ofApp);
    this.menus = [];
  }

  async getMenusFromRestaurants(prop: string, restaurant: string, all_ingredients: Array<CIngredient>,
    all_consommables: Array<Cconsommable>, all_plats: Array<Cplat>) {
    this.menus = [];
    const ref_db = ref(this.db);
    const path = `menu_${prop}_${restaurant}/${prop}/${restaurant}/`;
    await get(child(ref_db, path)).then((menus) => {
      menus.forEach((menu) => {
        const add_menu = new Cmenu();
        let iter_ing: [string, { quantity: number, unity: string }][] = [["", { quantity: 0, unity: "" }]];
        let iter_plats: [string, { quantity: number, unity: string }][] = [["", { quantity: 0, unity: "" }]];
        let iter_consommbales: [string, { quantity: number, unity: string }][] = [["", { quantity: 0, unity: "" }]];
        let iter_etapes: [string, { commentaire: string, temps: number }][] = [["", { commentaire: "", temps: 0 }]];
        let tmp_ings: Array<{ id: string, quantity: number, unity: string }> = [];
        let tmp_conso: Array<{ id: string, quantity: number, unity: string }> = [];
        let tmp_plats: Array<{ id: string, quantity: number, unity: string }> = [];
        let res_etapes: Array<Cetape> = [];
        let consommables = menu.child("consommables").val();
        let ingredients = menu.child("ingredients").val();
        let plats = menu.child("plat").val();
        let etapes = menu.child("etapes").val();
        if (ingredients !== null) iter_ing = Object.entries(ingredients);
        if (plats !== null) iter_plats = Object.entries(plats);
        if (consommables !== null) iter_consommbales = Object.entries(consommables);
        if (etapes !== null) iter_etapes = Object.entries(etapes);

        for (let [id_ing, ing_data] of iter_ing) {
          const curr_ing = { id: id_ing, quantity: ing_data.quantity, unity: ing_data.unity };
          tmp_ings.push(curr_ing);
        }
        for (let [id_conso, conso_data] of iter_consommbales) {
          let curr_conso = { id: id_conso, quantity: conso_data.quantity, unity: conso_data.unity };
          tmp_conso.push(curr_conso);
        }
        for (let [id_plat, plat_data] of iter_plats) {
          const curr_plat = { id: id_plat, quantity: plat_data.quantity, unity: plat_data.unity };
          tmp_plats.push(curr_plat);
        }
        for (let [id_etape, etape_data] of iter_etapes) {
          let curr_etape = new Cetape();
          curr_etape.setNom(id_etape);
          curr_etape.setComentaire(etape_data.commentaire);
          curr_etape.setTemps(etape_data.temps);
          res_etapes.push(curr_etape);
        }

        // on filtre les différentes liste en fonction des ings/conso/plat présent sur la carte
        const ing_lst = tmp_ings.map((ing) => ing.id);
        const conso_lst = tmp_conso.map((conso) => conso.id);
        const plat_lst = tmp_plats.map((plat) => plat.id)
        all_ingredients = all_ingredients.filter((ingredient) => ing_lst.includes(ingredient.nom));
        all_consommables = all_consommables.filter((consommable) => conso_lst.includes(consommable.name));
        all_plats = all_plats.filter((plat) => plat_lst.includes(plat.nom));

        // pour chacun des ings/conso/plat on modifie la quanitée présente dans le stock par celle nécessaire à la réalisation du menu
        for (let ingredient of all_ingredients) {
          let curr_ing = { id: "", quantity: 0, unity: "p" };
          let curr_ings = tmp_ings.filter((ing) => ing.id === ingredient.nom);
          if (curr_ings.length > 0) {
            curr_ing = curr_ings[0];
          }
          if (ingredient.vrac === 'oui') {
            ingredient.quantity_unity = curr_ing.quantity;
          }
          else {
            ingredient.quantity = curr_ing.quantity;
          }
          ingredient.unity = curr_ing.unity;
        }

        for (let conso of all_consommables) {
          let curr_conso = { id: "", quantity: 0, unity: "p" };
          let curr_consos = tmp_conso.filter((fconso) => fconso.id === conso.name);
          if (curr_consos.length > 0) {
            curr_conso = curr_consos[0];
          }
          conso.quantity = curr_conso.quantity;
          conso.unity = curr_conso.unity;
        }

        for(let plat of all_plats){
          let curr_plats = tmp_plats.filter((curr_plat) => curr_plat.id === plat.nom);
          if(curr_plats.length > 0){
            let curr_plat = curr_plats[0];
            plat.portions = curr_plat.quantity;
            plat.unity = curr_plat.unity;
          }
        }
        if (menu.key !== null) {
          add_menu.setNom(menu.key.split('_').join(' '));
          add_menu.setEtapes(res_etapes);
          add_menu.setIngredients(all_ingredients);
          add_menu.setConsommbale(all_consommables);
          add_menu.setPlats(all_plats);
        }
        this.menus.push(add_menu);
      })
    })
    return this.menus
  }

}
