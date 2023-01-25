import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { child, Database, get, getDatabase, ref } from 'firebase/database';
import { Cetape } from 'src/app/interfaces/etape';
import { Cconsommable, CIngredient, Ingredient } from 'src/app/interfaces/ingredient';
import { Cplat } from 'src/app/interfaces/plat';
import { Preparation } from 'src/app/interfaces/preparation';
import { IngredientsInteractionService } from './ingredients-interaction.service';

@Injectable({
  providedIn: 'root'
})
export class PlatsInteractionService {
  private db: Database;
  private plats: Array<Cplat>;
  private consommables: Array<Cconsommable>;
  private ingredients: Array<CIngredient>;
  private preparation: Array<CIngredient>;
  private etapes: Array<Cetape>
  constructor(private ofApp: FirebaseApp, private ingredient_service: IngredientsInteractionService) {
    this.plats = [];
    this.db = getDatabase(ofApp);
    this.consommables = [];
    this.ingredients = [];
    this.etapes = [];
    this.preparation = [];
  }

  async getPlatsFromRestaurantsFiltreIds(prop: string, restaurant: string, ids: Array<string>,
    lst_ings: Array<CIngredient>, lst_conso: Array<Cconsommable>) {
    const ref_db = ref(this.db);
    this.plats = [];
    const path = `plats_${prop}_${restaurant}/${prop}/${restaurant}/`;
    await get(child(ref_db, path)).then((plats) => {
      this.ingredient_service.getIngredientsPrepFromRestaurantsPROMForMenu(prop, restaurant).then((lst_prepa: Array<CIngredient>) => {
        plats.forEach((plat) => {
          if ((plat.key !== null) && (ids.includes(plat.key))) {
            const add_plat = new Cplat();
            let preparations = plat.child("preparations").val();
            let consommables = plat.child("consommables").val();
            let ingredients = plat.child("ingredients").val();
            let etapes_bdd = plat.child("etapes").val();
            let price = plat.child("price").val();
            let tva_taux = plat.child("taux_tva").val();
            let categorie = plat.child("categorie").val();
            let portion = plat.child("portion").val();
            const iter_preparation: [string, { quantity: number, unity: string }][] = Object.entries(preparations);
            const iter_ingredients: [string, { quantity: number, unity: string }][] = Object.entries(ingredients);
            const iter_consommbales: [string, { quantity: number, unity: string }][] = Object.entries(consommables);
            let etapes: [string, { commentaire: string, temps: number }][] = Object.entries(etapes_bdd);
            for (let conso of iter_consommbales) {
              const consommables = lst_conso.filter((consomable) => conso[0] === consomable.nom);
              if (consommables.length > 0) {
                const consomable = consommables[0];
                this.consommables.push(consomable);
              }
            }
            for (let ing of iter_ingredients) {
              const ingredients = lst_ings.filter((ingredient) => ing[0] === ingredient.nom);
              if (ingredients.length > 0) {
                const ingredient = ingredients[0];
                this.ingredients.push(ingredient);
              }
            }
            for (let prepa of iter_preparation) {
              const preparations = lst_prepa.filter((preparation) => prepa[0] === preparation.nom);
              if (preparations.length > 0) {
                const preparation = preparations[0];
                this.preparation.push(preparation);
              }
            }
            for (let [id_etape, etape_data] of etapes) {
              let curr_etape = new Cetape();
              curr_etape.setNom(id_etape);
              curr_etape.setComentaire(etape_data.commentaire);
              curr_etape.setTemps(etape_data.temps);
              this.etapes.push(curr_etape);
            }
            add_plat.setNom(plat.key);
            add_plat.setIngredients(this.ingredients);
            add_plat.setConsommbale(this.consommables);
            add_plat.setPreparations(this.preparation);
            add_plat.setEtapes(this.etapes);
            add_plat.setPortions(portion);
            add_plat.setCategorie(categorie);
            add_plat.setPrix(price);
            add_plat.setTauxTva(tva_taux);
            this.plats.push(add_plat);
          }
        })
      })
    })
    return this.plats
  }

}
