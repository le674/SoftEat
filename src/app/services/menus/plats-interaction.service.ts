import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { child, connectDatabaseEmulator, Database, get, getDatabase, ref, remove, update } from 'firebase/database';
import { Cetape } from 'src/app/interfaces/etape';
import { Cconsommable,TIngredientBase } from 'src/app/interfaces/ingredient';
import { Cplat, Plat } from 'src/app/interfaces/plat';
import { Cpreparation} from 'src/app/interfaces/preparation';
import { FIREBASE_DATABASE_EMULATOR_HOST, FIREBASE_PROD } from 'src/environments/variables';
import { IngredientsInteractionService } from './ingredients-interaction.service';

@Injectable({
  providedIn: 'root'
})
export class PlatsInteractionService {
  private db: Database;
  private plats: Array<Cplat>;
  private consommables: Array<Cconsommable>;
  private ingredients: Array<TIngredientBase>;
  private ingredients_minimal: {name:string, quantity:number, unity:string}[];
  private preparation: Array<Cpreparation>;
  private etapes: Array<Cetape>
  constructor(private ofApp: FirebaseApp, private ingredient_service: IngredientsInteractionService) {
    this.plats = [];
    this.db = getDatabase(ofApp);
    if((location.hostname === "localhost") && (!FIREBASE_PROD)) {
      try {
        // Point to the RTDB emulator running on localhost.
         connectDatabaseEmulator(this.db, FIREBASE_DATABASE_EMULATOR_HOST.host, FIREBASE_DATABASE_EMULATOR_HOST.port); 
      } catch (error) {
        console.log(error);
      }
    } 
    this.consommables = [];
    this.ingredients = [];
    this.etapes = [];
    this.preparation = [];
    this.ingredients_minimal = [];
  }

  async setPlat(prop:string, restaurant:string, plat:Plat){
    const ref_db = ref(this.db, `plat_${prop}_${restaurant}/${prop}/${restaurant}/`);
    if((plat.nom !== null) && (plat.nom !== undefined) && (plat.nom !== "")){
      await update(ref_db, {
        [plat.nom.split(' ').join('_')]: {
          type: plat.type,
          portion: plat.portions,
          price: plat.prix,
          taux_tva:plat.taux_tva,
          categorie:plat.categorie,
          temps: plat.temps,
          portion_cost: plat.portion_cost,
          material_ratio: plat.material_ratio,
          ingredients:plat.ingredients,
          consommables:plat.consommables,
          preparations:plat.preparations,
          etapes:plat.etapes
        }
      })
    }
  }

  async getPlatsFromRestaurantsFiltreIds(prop: string, restaurant: string,
    lst_ings: Array<TIngredientBase>, lst_conso: Array<Cconsommable>) {
    const ref_db = ref(this.db);
    this.plats = [];
    const path = `plat_${prop}_${restaurant}/${prop}/${restaurant}/`;
    await get(child(ref_db, path)).then((plats) => {
      this.ingredient_service.getIngredientsPrepFromRestaurantsPROMForMenu(prop, restaurant).then((lst_prepa: Array<Cpreparation>) => {
        plats.forEach((plat) => {
          let curr_plat = {id:"", quantity:0, unity:'g'}; 
          if((plat.key !== null)) {
            const add_plat = new Cplat();
            let preparations = plat.child("preparations").val();
            let consommables = plat.child("consommables").val();
            let ingredients = plat.child("ingredients").val();
            let etapes_bdd = plat.child("etapes").val();
            let price = plat.child("price").val();
            let tva_taux = plat.child("taux_tva").val();
            let type = plat.child("type").val();
            let categorie = plat.child("categorie").val();
            let portion = plat.child("portion").val();
            const iter_preparation: [string, { quantity: number, unity: string }][] = Object.entries(preparations);
            const iter_ingredients: [string, { quantity: number, unity: string }][] = Object.entries(ingredients);
            const iter_consommbales: [string, { quantity: number, unity: string }][] = Object.entries(consommables);
            let etapes: [string, { commentaire: string, temps: number }][] = Object.entries(etapes_bdd);
            for (let conso of iter_consommbales) {
              const consommables = lst_conso.filter((consomable) => conso[0] === consomable.name);
              if (consommables.length > 0) {
                const consomable = consommables[0];
                this.consommables.push(consomable);
              }
            }
            for (let ing of iter_ingredients) {
              const ingredients = lst_ings.filter((ingredient) => ing[0] === ingredient.name);
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
            add_plat.setType(type);
            add_plat.setPrix(price);
            add_plat.setTauxTva(tva_taux);
            add_plat.setCategorie(categorie);
            add_plat.setUnity(curr_plat.unity);
            this.plats.push(add_plat);
          }
        })
      })
    })
    return this.plats
  }

  async getPlatFromRestaurant(prop:string, restaurant:string){
    let lst_plats:Array<Cplat> = [];
    const path = `plat_${prop}_${restaurant}/${prop}/${restaurant}/`;
    const ref_db = ref(this.db);
    await get(child(ref_db, path)).then((plats) => {
      plats.forEach((bdd_plat) => {
        if(bdd_plat.key !== null){
          const plat = new Cplat();
          plat.nom = bdd_plat.key
          plat.type = bdd_plat.child('type').val();
          plat.categorie =  bdd_plat.child('categorie').val();
          plat.unity = bdd_plat.child('unity').val();
          plat.taux_tva = bdd_plat.child('taux_tva').val();
          plat.ingredients = bdd_plat.child('ingredients').val();
          plat.preparations = bdd_plat.child('preparations').val();
          plat.consommables = bdd_plat.child('consommables').val();
          plat.etapes =  bdd_plat.child('etapes').val();
          plat.portions =  bdd_plat.child('portion').val();
          plat.prix =  bdd_plat.child('price').val();
          lst_plats.push(plat);
        }
      })
    })
    return lst_plats;
  }

  async removePlatInBdd(plat: string, prop: string, restaurant: string) {
    const path = `plat_${prop}_${restaurant}/${prop}/${restaurant}/${plat}`
    const ref_db = ref(this.db, path);
    await remove(ref_db).then(() => console.log("ingrédient ", plat, "bien supprimée"))
  }

}
