import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cetape } from '../../../../../app/interfaces/etape';
import { CIngredient, TIngredientBase } from '../../../../../app/interfaces/ingredient';
import { Cplat } from '../../../../../app/interfaces/plat';
import { Cpreparation, CpreparationBase } from '../../../../../app/interfaces/preparation';
import { CalculService } from '../../../../../app/services/menus/menu.calcul/menu.calcul.ingredients/calcul.service';
import { MenuCalculPlatsServiceService } from '../../../../../app/services/menus/menu.calcul/menu.calcul.plats/menu.calcul.plats.service.service';
import { CalculPrepaService } from '../../../../../app/services/menus/menu.calcul/menu.calcul.preparation/calcul.prepa.service';
import { Cconsommable, TConsoBase } from 'src/app/interfaces/consommable';
import { FirebaseService } from 'src/app/services/firebase.service';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-add.plats',
  templateUrl: './add.plats.component.html',
  styleUrls: ['./add.plats.component.css']
})
export class AddPlatsComponent implements OnInit {
  public unity_conso:Array<string>;
  public unity_ing:Array<string>;
  public full_lst_ings:Array<CIngredient>;
  public full_lst_conso:Array<Cconsommable>;
  public full_lst_prepa:Array<Cpreparation>;
  public selected_ing:string;
  public selected_conso:string;
  public selected_prepa:string;
  public curr_ingredients_vrac:Array<number>;
  public add_plats_section = new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    name_tva: new FormControl(''),
    taux_tva: new FormControl(0),
    portion: new FormControl(0, Validators.required),
    price: new FormControl(0, Validators.required),
    base_ing: new FormArray<FormGroup<{
      name:FormControl<string | null>,
      quantity:FormControl<number | null>,
      unity:FormControl<string | null>,
      supp:FormControl,
      added_price:FormControl<number>
    }>>([]),
    base_conso: new FormArray<FormGroup<{
      name:FormControl<string | null>,
      quantity:FormControl<number | null>,
      unity:FormControl<string | null>
    }>>([]),
    base_prepa: new FormArray<FormGroup<{
      name:FormControl<string | null>,
      portions:FormControl<number | null>
    }>>([]),
    etapes: new FormArray<FormGroup<{
      name:FormControl<string | null>,
      comm:FormControl<string | null>,
      heure:FormControl<number | null>,
      minute:FormControl<number | null>,
      seconde:FormControl<number | null>
    }>>([]),
  });
  public boisson:boolean;

  private categorie:string = "";
  constructor(public dialogRef: MatDialogRef<AddPlatsComponent>, private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data:{
    prop:string,
    restaurant:string,
    ingredients: Array<CIngredient>,
    consommables: Array<Cconsommable>,
    preparations: Array<Cpreparation>,
    plat: Cplat | null,
    modification:boolean
    }, private _snackBar: MatSnackBar, private plat_service:MenuCalculPlatsServiceService,
    private calcul_service:CalculService, private calcul_service_prepa:CalculPrepaService, private firestore:FirebaseService) {
    this.unity_conso = [];
    this.unity_ing = [];
    this.selected_ing = '';
    this.selected_conso = '';
    this.selected_prepa = '';
    this.full_lst_conso = [];
    this.full_lst_ings = [];
    this.full_lst_prepa = [];
    this.boisson = false;
    this.curr_ingredients_vrac = [];
   }

  ngOnInit(): void {
    this.full_lst_conso = this.data.consommables;
    this.full_lst_ings = this.data.ingredients;
    this.full_lst_prepa = this.data.preparations;
    if(this.categorie !== ""){
      this.add_plats_section.controls.type.setValue(this.categorie);
    }
    if((this.data.plat !== null) && (this.data.plat !== undefined)){
      if((this.data.plat.name !== null) && (this.data.plat.name !== undefined)){
        this.add_plats_section.controls.name.setValue(this.data.plat.name);
      }
      if((this.data.plat.category !== null) && (this.data.plat.category !== undefined)){
        this.add_plats_section.controls.name_tva.setValue(this.data.plat.category);
      }
      if((this.data.plat.portions !== null) && (this.data.plat.portions !== undefined)){
        this.add_plats_section.controls.portion.setValue(this.data.plat.portions);
      }
      if((this.data.plat.type !== null) && (this.data.plat.type !== undefined)){
        this.add_plats_section.controls.type.setValue(this.data.plat.type);
      }
      if((this.data.plat.taux_tva !== null) && (this.data.plat.taux_tva !== undefined)){
        this.add_plats_section.controls.taux_tva.setValue(this.data.plat.taux_tva);
      }
      if((this.data.plat.cost !== null) && (this.data.plat.cost !== undefined)){
        this.add_plats_section.controls.price.setValue(this.data.plat.cost);
      }
      if((this.data.plat.ingredients !== null) && (this.data.plat.ingredients !== undefined)){
        this.data.plat.ingredients.forEach((ingredient) => {
           // ont prend en compte le cas où on modifie une préparation contenant un ingrédient pour lequel
           // nous n'avons pas décider une unitée pour la préparation. Mais nous l'avons ajouté à l'inventaire
           // exemple : huile 1 litre dans l'inventaire, 1 c.s dans la préparation.
          let unity = ingredient.unity;
          if(ingredient.unity !== undefined) unity = ingredient.unity
          let supp = false;
          let added_price = 0;
          if(ingredient.added_price !== null){
            supp = true;
            added_price = ingredient.added_price;
          }
          const to_add_grp = new FormGroup({
            name:new FormControl(ingredient.name),
            quantity: new FormControl(ingredient.quantity),
            unity: new FormControl(unity),
            supp: new FormControl(supp),
            added_price:new FormControl(added_price),
          })
          this.getBaseIng().push(to_add_grp);
        })
      }
      if((this.data.plat.consommables !== null) && (this.data.plat.consommables !== undefined)){
        this.data.plat.consommables.forEach((consommable) => {
          const to_add_grp = new FormGroup({
            name:new FormControl(consommable.name),
            quantity: new FormControl(consommable.quantity),
            unity: new FormControl(consommable.unity)
          })
          this.getBaseConso().push(to_add_grp);
        })
      }
      if((this.data.plat.etapes !== null) && (this.data.plat.etapes !== undefined)){
        this.data.plat.etapes.forEach((etape) => {
          const time_array = this.calcul_service_prepa.SecToArray(etape.time);
          const to_add_grp = new FormGroup({
            name:new FormControl(etape.name),
            comm: new FormControl(etape.commentary),
            heure: new FormControl(time_array[0]),
            minute: new FormControl(time_array[1]),
            seconde: new FormControl(time_array[2]),
          })
          this.getEtapes().push(to_add_grp);
        })
      }
      if((this.data.plat.preparations !== null) && (this.data.plat.preparations !== undefined)){
        this.data.plat.preparations.forEach((preparation) => {
          const to_add_grp = new FormGroup({
            name: new FormControl(preparation.name),
            portions: new FormControl(preparation.portions)
          })
          this.getBasePrepa().push(to_add_grp);
        })
      }
    }

  }
  
  changePlats():void{
    let plat:Cplat = new Cplat();
    plat.proprietary_id = this.data.prop;
    let path_to_plat = Cplat.getPathsToFirestore(this.data.prop);
    if(this.data.plat !== null){
      plat.id = this.data.plat.id;
      plat.material_cost = this.data.plat.material_cost;
      plat.material_ratio = this.data.plat.material_ratio;
      plat.portion_cost = this.data.plat.portion_cost;
      plat.prime_cost = this.data.plat.prime_cost;
      plat.time = this.data.plat.time;
      plat.type = this.data.plat.type; 

    }
    if(this.add_plats_section.controls.name.value !== null){
      plat.name = this.add_plats_section.controls.name.value;
    }
    if(this.add_plats_section.controls.type.value !== null){
      plat.type = this.add_plats_section.controls.type.value;
    }
    if(this.add_plats_section.controls.portion.value !== null){
      plat.portions = this.add_plats_section.controls.portion.value;
    }
    if(this.add_plats_section.controls.price.value !== null){
      plat.cost = this.add_plats_section.controls.price.value;
    }
    if(this.add_plats_section.controls.name_tva.value !== null){
      plat.category = this.add_plats_section.controls.name_tva.value;
    }
    if(this.add_plats_section.controls.taux_tva.value !== null){
      plat.taux_tva = this.add_plats_section.controls.taux_tva.value;
    }
    if(this.add_plats_section.controls.base_ing.value !==null){
      let base_ings = this.add_plats_section.controls.base_ing.value;
      plat.ingredients = base_ings.flatMap((ingredient) => {
        let tmp_ingredient = this.data.ingredients.find((_ingredient) => ingredient.name === _ingredient.name);
        if((ingredient.name !== null) && (ingredient.name !== undefined)){
          if((ingredient.quantity !== null) && (ingredient.quantity !== undefined)){
            if((ingredient.unity !== null) && (ingredient.unity !== undefined)){
              let _ingredient = new TIngredientBase(ingredient.name, ingredient.quantity, ingredient.unity);
              if(tmp_ingredient !== undefined){
                _ingredient.id.push(tmp_ingredient.id);
              }
              if((ingredient.added_price !== null) && (ingredient.added_price  !== undefined)){
                _ingredient.added_price = ingredient.added_price;
              }
              if((ingredient.unity !== null) && (ingredient.unity  !== undefined)){
                _ingredient.unity = ingredient.unity;
              }
              return [_ingredient];
            }
          }
        }
        return [];
      })
      console.log(plat.ingredients);
    }
    if(this.add_plats_section.controls.base_conso.value !== null){
      let base_conso = this.add_plats_section.controls.base_conso.value;
      plat.consommables = base_conso.flatMap((consommable) => {
        let tmp_consommable = this.data.consommables.find((_consommable) => _consommable.name === consommable.name);
        if(consommable.name !== null && consommable.name !== undefined){
          if((consommable.quantity !== null) && (consommable.quantity !== undefined)){
            if((consommable.unity !== null) && (consommable.unity !== undefined)){
              let _consommable = new TConsoBase(consommable.name, consommable.quantity, consommable.unity);
              if(tmp_consommable !== undefined){
                _consommable.id.push(tmp_consommable.id);
              }
              return [_consommable];
            }
          }
        }
        return [];
      })
      console.log(plat.consommables);
    }
    if(this.add_plats_section.controls.etapes.value !== null){
      let base_etapes = this.add_plats_section.controls.etapes.value;
      plat.etapes = base_etapes.map((etape) => {
        let _heure = 0;
        let _minute = 0;
        let _seconde =  0;
        let etape_to_add = new Cetape()
        if((etape.name !== null) && (etape.name !== undefined)){
          etape_to_add.name = etape.name;
        }
        if((etape.comm !== null) && (etape.comm !== undefined)){
          etape_to_add.commentary = etape.comm;
        }
        if((etape.heure !== null) && (etape.heure !== undefined)){
          _heure = etape.heure * 3600;
        }
        if((etape.minute !== null) && (etape.minute !== undefined)){
          _minute = etape.minute * 60;
        }
        if((etape.seconde !== null) && (etape.seconde !== undefined)){
          _seconde = etape.seconde;
        }
        etape_to_add.time = _heure + _minute + _seconde;
        return etape_to_add;
      })
    }
    // TO DO : Faire comme pour les ingrédients intégrer une unitée propre à la préparation
    if(this.add_plats_section.controls.base_prepa.value !== null){
      let base_prepa = this.add_plats_section.controls.base_prepa.value;
      plat.preparations = this.data.preparations.filter((preparation) => base_prepa.map((prepa) => prepa.name).includes(preparation.name))
                          .map((preparation) =>
                          { 
                              let _preparation = new CpreparationBase();
                              const first_prepa = base_prepa.find((prepa) => preparation.name === prepa.name);
                              if((first_prepa?.portions !== null) && (first_prepa?.portions !== undefined)){
                                  preparation.portions = first_prepa.portions; 
                              }
                              else{
                                  preparation.portions = 0;
                              }
                              if(_preparation.id !== null){
                                _preparation.id.push(preparation.id);  
                              }
                              _preparation.name = preparation.name;
                              _preparation.portions = preparation.portions;
                              if(first_prepa !== undefined){
                                if(first_prepa.name !== undefined && first_prepa.portions !== undefined){
                                  if(first_prepa.name !== null && first_prepa.portions !== null){
                                    _preparation.portions = first_prepa.portions; 
                                  }
                                }
                              }
                            return _preparation;
                          });
    }
    plat.time = this.plat_service.getFullTheoTimeToSec(plat, this.data.preparations);
    plat.portion_cost = this.plat_service.getPortionCost(plat, this.data.preparations, this.data.ingredients);
    if(plat.portions !== undefined){
      plat.material_ratio = this.plat_service.getRatioMaterial(plat.portion_cost,plat as Cplat);
    }
    const prime_cost_prom = this.plat_service.getPrimCost(this.data.prop, this.data.restaurant, plat, this.data.preparations, this.data.consommables, this.data.ingredients).then((prime_cost) => plat.prime_cost = prime_cost);
    prime_cost_prom.then((prime_cost) => {
      if(this.data.modification){
        this.firestore.updateFirestoreData(plat.id, plat, path_to_plat, Cplat).finally(() => {
          this._snackBar.open(`le plat ${plat.name} vient d'être modifié`, "fermer");
        }).catch((e) => {
          this._snackBar.open(`le plat ${plat.name} n'a pas pu être modifié`, "fermer");
          const err =  new Error(e);
          return throwError(() => err).subscribe((e) => console.log(e));
        });
      }
      else{
        this.firestore.setFirestoreData(plat, path_to_plat, Cplat).finally(() => {
          this._snackBar.open(`le plat ${plat.name} vient d'être ajouté`, "fermer")
        }).catch((e) => {
          this._snackBar.open(`le plat ${plat.name} n'a pas pu être ajouté`, "fermer");
          const err =  new Error(e);
          return throwError(() => err).subscribe((e) => console.log(e));
        });
      }
    });
  }

  getUnity(new_selection:MatSelectChange, category:string, index:number){
    // la partie ingrédients n'est plus utilisé car ont veut pouvoir laisser le restaurateur choisir quelle 
    // categorie il souhaite 
    if(category === 'ing'){
      const ingredient = this.full_lst_ings.find((ingredient) => ingredient.name === (new_selection.value as string));
      if((this.getBaseIng().at(index) !== undefined) && (ingredient !== undefined)){
        this.getBaseIng().at(index).controls.unity.setValue(ingredient.unity);
      }
    }

    if(category === 'conso'){
      const consommable = this.full_lst_conso.find((consommable) => consommable.name === (new_selection.value) as string);
      if(index > this.unity_conso.length){
        if((consommable !== undefined) && (consommable.unity !== null)){
          this.unity_conso.push(consommable.unity);
        }
      }
      else{
        if((consommable !== undefined) && (consommable.unity !== null)){
          this.unity_conso[index] = consommable.unity;
        } 
      }
      if((this.getBaseConso().at(index) !== undefined)  && (consommable !== undefined)){
        this.getBaseConso().at(index).controls.unity.setValue(consommable.unity);
      }
    }
  }

  addTaux(event:MatSelectChange): void {
    const taux = this.calcul_service.getTauxFromCat(event.value as string);
    this.add_plats_section.controls.taux_tva.setValue(taux);
    this.add_plats_section.controls.taux_tva.disable();
  }

  filtreCategorie(event:MatSelectChange):void{
    const curr_select_value = event.value as string;
    this.boisson = curr_select_value.includes("boisson");  
  }

  addInputIng(){
    let name = "";
    let quantity = 0;
    let unity = "";
    const ingredient_length = this.getBaseIng().length;
    if(this.data.plat !== null){
      const ingredients = this.data.plat.ingredients;
      if(ingredients !== null){
        if((ingredients[ingredient_length] !== undefined) && (ingredients.length > 0)){
          name = ingredients[ingredient_length].name;
          if(ingredients[ingredient_length].quantity !== null){
            if(ingredients[ingredient_length].unity !== null){
              quantity = ingredients[ingredient_length].quantity as number;
              unity = ingredients[ingredient_length].unity as string;   
            }
          }
        }
      }
    }
    const new_ing = this.formBuilder.group({
      name: new FormControl(name, Validators.required),
      quantity: new FormControl(quantity),
      unity: new FormControl(unity),
      supp: new FormControl(),
      added_price:0
    });
    this.getBaseIng().push(new_ing);
  }

  addInputConso(){
    let name = "";
    let quantity = 0;
    let unity = "";
    const consommable_length = this.getBaseConso().length;
    if(this.data.plat !== null){
      const consommables = this.data.plat.consommables;
      if(consommables !== null){
        if((consommables[consommable_length] !== undefined) && (consommables.length > 0)){
          name = consommables[consommable_length].name;
          let _quantity = consommables[consommable_length].quantity;
          let _unity = consommables[consommable_length].unity;
          if(_quantity !== null){
            quantity = _quantity;
          }
          if(_unity !== null){
            unity =  _unity;
          }
        }
      }
    }
    const new_conso = this.formBuilder.group({
      name: new FormControl(name, Validators.required),
      quantity: new FormControl(quantity),
      unity: new FormControl(unity)
    });
    this.getBaseConso().push(new_conso);
  }

  addInputPrepa(){
    let name = "";
    let quantity = 0;
    const prepa_length = this.getBasePrepa().length;
    if(this.data.plat !== null){
      const preparations = this.data.plat.preparations;
      if(preparations !== null){
        if((preparations[prepa_length] !== undefined) && (preparations.length > 0)){
         if(preparations[prepa_length].name !== null)  name = preparations[prepa_length].name as string;
          if(preparations[prepa_length].portions !== null){
            quantity = preparations[prepa_length].portions as number;
          } 
        }
      } 
    }
    const new_prepa = this.formBuilder.group({
      name: new FormControl(name, Validators.required),
      portions: new FormControl(quantity)
    });
    this.getBasePrepa().push(new_prepa);
  }

  addInputEtape(){
    let name = "";
    let comm = "";
    let tmps = [0,0,0];
    const etape_length = this.getEtapes().length;
    if(this.data.plat !== null){
      const etapes = this.data.plat.etapes;
      if(etapes !== null){
        if((etapes[etape_length] !== undefined) && (etapes.length > 0)){
          if(etapes[etape_length].name !== null)  name = etapes[etape_length].name as string;
          if(etapes[etape_length].commentary !== null) comm = etapes[etape_length].commentary as string;
          if(etapes[etape_length].time !== null){
            tmps = this.calcul_service_prepa.SecToArray(etapes[etape_length].time)
          } 
        }
      }
    }
    const new_etape = this.formBuilder.group({
      name: new FormControl(name, Validators.required),
      comm: new FormControl(comm),
      heure: new FormControl(tmps[0]),
      minute: new FormControl(tmps[1]),
      seconde: new FormControl(tmps[2])
    });
    this.getEtapes().push(new_etape);
  }


  

  // lorsque l'ingédient est un ingrédient en vrac ont enlève la possibilité de choisir pièce dans l'outils de séléction 
  changeIng(ingredient: MatOptionSelectionChange<string>, i:number) {
   /*  let ing = this.full_lst_ings.find((_ingredient) => _ingredient.name === ingredient.source.value);
    if(ing !== undefined){
      if(ing.vrac === "oui"){
        this.curr_ingredients_vrac.push(i);
      }
    } */
  } 

  suppInputIng(index:number){
    this.getBaseIng().removeAt(index);
  }

  suppInputConso(index:number){
    this.getBaseConso().removeAt(index);
  }

  suppInputPrepa(index:number){
    this.getBasePrepa().removeAt(index);
  }

  suppInputEtape(index:number){
    this.getEtapes().removeAt(index);
  }

  getBaseIng(){
    return this.add_plats_section.get("base_ing") as FormArray<FormGroup<{
      name:FormControl<string | null>,
      quantity:FormControl<number | null>,
      unity:FormControl<string | null>,
      supp:FormControl,
      added_price:FormControl
    }>>
  }

  getBaseConso(){
    return this.add_plats_section.get("base_conso") as FormArray<FormGroup<{
      name:FormControl<string | null>,
      quantity:FormControl<number | null>,
      unity:FormControl<string | null>
    }>>
  }

  getBasePrepa(){
    return this.add_plats_section.get("base_prepa") as FormArray<FormGroup<{
      name:FormControl<string | null>,
      portions:FormControl<number | null>
    }>>
  }
  getEtapes(){
    return this.add_plats_section.get("etapes") as FormArray<FormGroup<{
      name:FormControl<string | null>,
      comm:FormControl<string | null>,
      heure:FormControl<number | null>,
      minute:FormControl<number | null>,
      seconde:FormControl<number | null>,
    }>>
  }
  closePopup(click:MouseEvent){
    this.dialogRef.close();
  }
}