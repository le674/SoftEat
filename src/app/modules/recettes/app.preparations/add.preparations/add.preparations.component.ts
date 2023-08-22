import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cetape } from '../../../../../app/interfaces/etape';
import {CIngredient, TIngredientBase } from '../../../../../app/interfaces/ingredient';
import { AfterPreparation, Cpreparation } from '../../../../../app/interfaces/preparation';
import { CalculService } from '../../../../../app/services/menus/menu.calcul/menu.calcul.ingredients/calcul.service';
import { CalculPrepaService } from '../../../../../app/services/menus/menu.calcul/menu.calcul.preparation/calcul.prepa.service';
import { Cconsommable, TConsoBase } from 'src/app/interfaces/consommable';
import { MiniConsommable } from 'src/app/interfaces/recette';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-add.preparations',
  templateUrl: './add.preparations.component.html',
  styleUrls: ['./add.preparations.component.css']
})
export class AddPreparationsComponent implements OnInit{
  public unity_ing:Array<string>;
  public unity_conso:Array<string>;
  public curr_ingredients_vrac:Array<number>;
  public ingredients: Array<CIngredient>;
  public consommables: Array<Cconsommable>;
  public add_prepa_section = new FormGroup({
    name: new FormControl('', Validators.required),
    base_ing: new FormArray<FormGroup<{
      name:FormControl<string | null>,
      quantity:FormControl<number | null>,
      unity:FormControl<string | null>
    }>>([]),
    base_conso: new FormArray<FormGroup<{
      name:FormControl<string | null>,
      quantity:FormControl<number | null>,
      unity:FormControl<string | null>
    }>>([]),
    etapes: new FormArray<FormGroup<{
      name:FormControl<string | null>,
      comm:FormControl<string | null>,
      heure:FormControl<number | null>,
      minute:FormControl<number | null>,
      seconde:FormControl<number | null>
    }>>([]),
    quantity_aft_prep: new FormControl(0),
    unity: new FormControl("")
  });
  private base_ings: Array<TIngredientBase>;
  private _base_ings: Array<TIngredientBase>;
  private base_conso: Array<MiniConsommable>;
  private path_to_preparation:Array<string>;
  private etapes: Array<Cetape>;
  private after_prep:AfterPreparation = {quantity: 0, unity:""}; 
  private is_stock:boolean;
  
  @ViewChild('taux')
  taux!: ElementRef;


  constructor(public dialogRef: MatDialogRef<AddPreparationsComponent>,
    public calcul_service: CalculService, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data:{
    prop:string,
    restaurant:string,
    names: Array<string | null>,
    _ingredients: Array<CIngredient>,
    _consommables: Array<Cconsommable>,
    preparation: Cpreparation | null,
    modification:boolean
    },
    private prepa_service:CalculPrepaService, private _snackBar: MatSnackBar, private firestore:FirebaseService) { 
    if(this.data._ingredients !== null){
      this.ingredients = this.data._ingredients;
    }
    else{
      this.ingredients = [];
    }
    if(this.data._consommables !== null){
      this.consommables = this.data._consommables;
    }
    else{
      this.consommables = [];
    }
    if(this.data.modification){
      this.setTrue()
    }
    this.path_to_preparation = [];
    this.is_stock = false;  
    this._base_ings = [];
    this.base_ings = [];
    this.base_conso = [];
    this.etapes = [];
    this.unity_conso = [];
    this.unity_ing = [];
    this.curr_ingredients_vrac = [];
  }


  ngOnInit(): void {
    this.path_to_preparation = Cpreparation.getPathsToFirestore(this.data.prop, this.data.restaurant);
    // pour le moment dans consommable ont met p au lieu d'une autre unitée.  car ont ne gère pas encore les quantitée unitaire
    //pour les consommables 
    if(this.data.preparation !== null){
      this.add_prepa_section.controls.name.setValue(this.data.preparation.name);
      if(this.data.preparation?.quantity_after_prep !== null){
        this.add_prepa_section.controls.quantity_aft_prep.setValue(this.data.preparation?.quantity_after_prep);
      }
      if(this.data.preparation?.unity !== null){
        this.add_prepa_section.controls.unity.setValue(this.data.preparation.unity);
      }
    }
    let tmp_data:Array<{name:string | null, quantity: number | null, unity: string | null}> = [];
    if(this.data.preparation !== null){
      if((this.data.preparation?.ingredients !== null) && (this.data.preparation?.ingredients!== undefined)){
        const current_inputs_ing = this.data.preparation?.ingredients.length;
        tmp_data = this.data.preparation?.ingredients.map((ing) => {
          // ont prend en compte le cas où on modifie une préparation contenant un ingrédient pour lequel
          // nous n'avons pas décider une unitée pour la préparation. Mais nous l'avons ajouté à l'inventaire
          // exemple : huile 1 litre dans l'inventaire, 1 c.s dans la préparation.
          let unity = ing.unity;
          if(ing.unity !== undefined) unity = ing.unity;
          return {name: ing.name, quantity: ing.quantity, unity: unity};
        })
        for (let index = 0; index < current_inputs_ing; index++) {
          const new_ing = this.formBuilder.group({
            name: new FormControl(tmp_data[index].name),
            quantity: new FormControl(tmp_data[index].quantity),
            unity: new FormControl(tmp_data[index].unity)
          });
          this.getBaseIng().push(new_ing);
        }
      }
    }
    if((this.data.preparation?.consommables !== null) && (this.data.preparation?.consommables !== undefined)){
      const current_inputs_conso = this.data.preparation.consommables.length;
      tmp_data =  this.data.preparation.consommables.map((conso) => {
        return {name: conso.name, quantity: conso.quantity, unity: conso.unity};
      })
      for (let index = 0; index < current_inputs_conso ; index++) {
        const new_conso = this.formBuilder.group({
          name: new FormControl(tmp_data[index].name),
          quantity: new FormControl(tmp_data[index].quantity),
          unity: new FormControl('p')//new FormControl(tmp_data[index].unity)
        });
        new_conso.controls.unity.disable();
        this.getBaseConso().push(new_conso);
      }
    }
    if((this.data.preparation?.etapes !== null) && (this.data.preparation?.etapes !== undefined)){
      const current_inputs_etapes = this.data.preparation.etapes.length;
      for (let index = 0; index < current_inputs_etapes; index++) {
        const times = this.prepa_service.SecToArray(this.data.preparation.etapes[index].time);
        const new_etape = this.formBuilder.group({
          name: new FormControl(this.data.preparation.etapes[index].name),
          comm: new FormControl(this.data.preparation.etapes[index].commentary),
          heure: new FormControl(times[0]),
          minute: new FormControl(times[1]),
          seconde: new FormControl(times[2])
        });
        this.getEtapes().push(new_etape);
      }
    }
  }

  changePreparation(){
    this.base_ings = [];
    this.base_conso = [];
    this.etapes = [];
    let consos:TConsoBase[] = [];
    let ings:TIngredientBase[] = [];
    let to_add_preparation_name:string = "";
    let tmps_prepa = 0;
    let val_bouch = 0;
    const name_prepa = this.add_prepa_section.value.name;
    if(name_prepa !== undefined){
      if(!this.data.names.includes(name_prepa)){
        if(name_prepa !== null){
          to_add_preparation_name = name_prepa;
          const base_ings = this.getBaseIng();
          const base_conso = this.getBaseConso();
          const etapes_prepa = this.getEtapes();
          base_ings.value.forEach((ing:Partial<{name:string | null, quantity:number | null, unity:string | null}>) => {
            let full_ing:TIngredientBase = new TIngredientBase("", 0,"");
            let _ingredient = this.data._ingredients.find((ingredient) => ingredient.name == ing.name);
            if((ing.name !== undefined) || (ing.name !== null)){
              full_ing.name = ing.name as string;
              if((ing.quantity !== undefined) || (ing.quantity !== null)){
                full_ing.quantity = ing.quantity as number;
              }
              if((ing.unity !== undefined) || (ing.unity !== null)){
                // on ajout l'unitée à l'ingrédient qui est utilisé pour la préparation
                // rappel : 
                //. unity (unitée pour la préparation)
                //. unity_unitary (unitée pour l'inventaire)
                full_ing.unity =  ing.unity as string;
              } 
              if(_ingredient !== undefined){
                if(full_ing.id !== null){
                  full_ing.id.push(_ingredient.id);
                }
              } 
              this.base_ings.push(full_ing);
            }
          })
          base_conso.value.forEach((conso:Partial<{name:string | null, quantity:number | null, unity:string | null}>) => {
            if(conso.name !== undefined || (conso.name !== null)){
              if((conso.quantity === undefined) || (conso.quantity === null)) conso.quantity = 0;
              if((conso.unity === undefined) || (conso.unity === null)) conso.unity = "";
              let act_conso = new MiniConsommable(conso.name as string);
              act_conso.setConso(conso.quantity, conso.unity, 0);
              this.base_conso.push(act_conso);
            } 
          })
          etapes_prepa.value.forEach((etape:Partial<{name:string | null, comm:string | null,
             heure:number | null, minute: number | null, seconde:number | null}>) => {
             let _hours = 0;
             let _minute = 0;
             let _seconde = 0;
             if((etape.heure !== undefined) && (etape.heure != null)){
              _hours = etape.heure;
             }
             if((etape.minute !== undefined) && (etape.minute !== null)){
              _minute = etape.minute;
             }
             if((etape.seconde !== undefined) && (etape.seconde !== null)){
              _seconde = etape.seconde;
             }
             _hours = 3600*_hours;
             _minute = 60*_minute;
             _seconde = _seconde;
             if(etape.name !== undefined || (etape.name !== null)){
                 const tmps = _hours + _minute + _seconde;
                 if((etape.comm === undefined) || (etape.comm === null)) etape.comm = "";
                 let add_etape = new Cetape();
                 add_etape.name = (etape.name as string);
                 add_etape.time = tmps;
                 add_etape.commentary = (etape.comm as string); 
                 this.etapes.push(add_etape);
             } 
          });
          // le problème c'est que là on supprime les quantitée que l'on à mit avant 
          this.base_ings.forEach((ingredient) => {
            if(this.data.preparation !== null){
              if(this.data.preparation.ingredients !== null){
                const _ingredient = this.data.preparation.ingredients.find((ing) => ingredient.id === ing.id);
                if((ingredient.quantity !== undefined) && (ingredient.unity !== undefined)){
                  if(_ingredient?.quantity !== undefined){
                    _ingredient.quantity = ingredient.quantity;
                  }
                  if(_ingredient?.unity !== undefined){
                    _ingredient.unity = ingredient.unity;
                  }
                  if(_ingredient !== undefined) ings.push(_ingredient);
                }
              }
            }
            else{
              ings.push(ingredient);
            }
          });

          this.base_conso.forEach((_consommable) => {
            let conso_id = null;
            const tmp_conso = this.consommables.find((_conso) => _conso.name == _consommable.name);
            if(tmp_conso !== undefined){
              conso_id = tmp_conso.id;
            }
            if(this.data.preparation !== null && this.data.preparation.consommables !== null){
                const consommable = this.data.preparation?.consommables.find((conso) => _consommable.name === conso.name);
                if(_consommable.quantity !== undefined && _consommable.quantity !== null && consommable?.quantity !== undefined){
                  consommable.quantity = _consommable.quantity;
                  consos.push(consommable);
                }
                else{
                  consos.push(_consommable.toConsoBase(conso_id));
                }
            }
            else{
              consos.push(_consommable.toConsoBase(conso_id));
            }
          })
          let result = this.prepa_service.getCostMaterial(this.data._ingredients,ings)
                                         .filter((ing) => this._base_ings.flatMap((ingredient) => ingredient.id).includes(ing.id));
          // ont vide les listes avant l'ajout dans la bdd
          this.base_ings = [];
          for(let ingredient of result){
            const ing:TIngredientBase = new TIngredientBase(ingredient.name, ingredient.quantity, ingredient.unity);
            ing.setIngredient(ingredient)
            ing.quantity = ingredient.quantity;
            ing.unity = ingredient.unity;
            this.base_ings.push(ing);
          }
          const unity_aft_prep = this.add_prepa_section.controls.unity.value;
          const quantity_aft_prep = this.add_prepa_section.controls.quantity_aft_prep.value;
          if((unity_aft_prep !== null) && (quantity_aft_prep !== null)){
            this.after_prep.quantity = quantity_aft_prep;
            this.after_prep.unity = unity_aft_prep;
          }
          if((this.etapes !== null) && (this.etapes !== undefined)){
            tmps_prepa =  this.prepa_service.getFullTheoTimeSec(this.etapes);
          }
          if((this._base_ings !== null) && (this._base_ings !== undefined)){
            val_bouch = this.prepa_service.getValBouchFromBasIng(this.base_ings, this.ingredients ,this.after_prep.quantity, this.after_prep.unity);
          }
          this.prepa_service.getPrimCost(this.etapes, this.ingredients, this.base_ings ,this.base_conso).then((prime_cost) => {
              let preparation = this.data.preparation;
              if(preparation === null){
                preparation = new Cpreparation(this.calcul_service);
              }
              preparation.name = to_add_preparation_name;
              preparation.ingredients = this.base_ings;
              preparation.consommables = consos;
              preparation.etapes = this.etapes;
              preparation.quantity_after_prep = this.after_prep.quantity;
              preparation.unity = this.after_prep.unity;
              if(preparation !== null){
                if(this.data.modification){
                  this.firestore.updateFirestoreData(preparation.id, preparation, this.path_to_preparation, Cpreparation).catch((e) => {
                    console.log(e);
                    this._snackBar.open("nous ne somme pas parvenu à modifier la préparation veuillez contacter SoftEat", "fermer");
                  }).finally(() => {
                    this._snackBar.open("nous somme parvenu à modifier la préparation", "fermer");
                  })
                }
                else{      
                  this.firestore.setFirestoreData(preparation, this.path_to_preparation, Cpreparation).catch((e) => {
                    console.log(e);
                    this._snackBar.open("nous ne somme pas parvenu à ajouter la préparation veuillez contacter SoftEat", "fermer");
                  }).finally(() => {
                    this._snackBar.open("nous somme  parvenu à ajouter la préparation", "fermer");
                  })
                }
              }
            })
        }
      }
    }  
  }

  // lorsque l'ingédient est un ingrédient en vrac ont enlève la possibilité de choisir pièce dans l'outils de séléction 
  changeIng(ingredient: MatOptionSelectionChange<string>, i:number) {
    let ing = this.ingredients.find((_ingredient) => _ingredient.name === ingredient.source.value);
    if(ing !== undefined){
      if(ing.vrac === "oui"){
        this.curr_ingredients_vrac.push(i);
      }
    }
  }

  setTrue(){
   this.is_stock = true;
  }

  setFalse(){
    this.is_stock = false;
  }

  addTaux(event: Object): void {
    const taux = this.calcul_service.getTauxFromCat(event["value" as keyof typeof event].toString());
    this.taux.nativeElement.value = taux;
  }

  addInputIng(){
    const ings_length = this.getBaseIng().length;
    let name = "";
    let quantity = 0;
    let unity = "";
    if(this.data.preparation !== null){
      if(this.data.preparation?.ingredients !== null){
        const ingredients = this.data.preparation.ingredients.map((ing) => {
          return {name: ing.name, quantity: ing.quantity, unity: ing.unity};
        })
        if(ings_length > 0){
          if(ingredients[ings_length] !== undefined){
            name = ingredients[ings_length].name;
            if(ingredients[ings_length].quantity !== null) quantity = ingredients[ings_length].quantity as number;
            if(ingredients[ings_length].unity !== null) unity = ingredients[ings_length].unity as string; 
          }
        }
      }
    }
    const new_ing = this.formBuilder.group({
      name: new FormControl(name),
      quantity: new FormControl(quantity),
      unity: new FormControl(unity)
    });
    this.getBaseIng().push(new_ing);
  }

  addInputConso(){
    //pour le moment dans unity ont met p car on ne gère pas encor les quantitées unitaire pour les consommables 
    let name = "";
    let quantity = 0;
    let unity = "p";
    const consommable_length = this.getBaseConso().length;
    if(this.data.preparation !== null){
      if(this.data.preparation.consommables !== null){
        const consommables =  this.data.preparation.consommables.map((conso) => {
          return {name: conso.name, quantity: conso.quantity, unity: conso.unity};
        }); 
        if((consommables[consommable_length] !== undefined) && (consommable_length > 0)){
          name = consommables[consommable_length].name;
          if(consommables[consommable_length].quantity !== null){
            quantity = consommables[consommable_length].quantity as number; 
          }
          if(consommables[consommable_length].unity !== null){
            unity = consommables[consommable_length].unity as string; 
          }
        }
      }
    }
    const new_conso = this.formBuilder.group({
      name: name,
      quantity: quantity,
      unity: unity
    });
    new_conso.controls.unity.disable();
    this.getBaseConso().push(new_conso);
  }

  addInputEtape(){
    let name = "";
    let comm = "";
    let heure = 0;
    let minute = 0;
    let seconde = 0;
    const etape_length = this.getEtapes().length;
    if(this.data.preparation !== null){
      const etapes = this.data.preparation.etapes;
      if(etapes !== null){
        if((etapes[etape_length] !== undefined) && (etape_length > 0)){
          name = etapes[etape_length].name;
          if(etapes[etape_length].commentary !== null) comm = etapes[etape_length].commentary as string;
          if(etapes[etape_length].time !== null){
            const times = this.prepa_service.SecToArray(etapes[etape_length].time)
            heure = times[0];
            minute = times[1];
            seconde = times[2];
          }
        } 
      }
    }
    const new_etape = this.formBuilder.group({
      name: new FormControl(name),
      comm: new FormControl(comm),
      heure: new FormControl(heure),
      minute: new FormControl(minute),
      seconde: new FormControl(seconde),
    });
    this.getEtapes().push(new_etape);
  }

  suppInputIng(index:number){
    this.getBaseIng().removeAt(index);
  }

  suppInputConso(index:number){
    this.getBaseConso().removeAt(index);
  }

  suppInputEtape(index:number){
    this.getEtapes().removeAt(index);
  }

  getUnity(new_selection:MatSelectChange, category:string, index:number){
    if(category === 'ing'){
      const ingredient = this.ingredients.find((ingredient) => ingredient.name === (new_selection.value as string));
      if((this.getBaseIng().at(index) !== undefined) && (ingredient !== undefined)){
        this.getBaseIng().at(index).controls.unity.setValue(ingredient.unity);
      }
    }

    if(category === 'conso'){
      const consommable = this.consommables.find((consommable) => consommable.name === (new_selection.value) as string);
      if((this.getBaseConso().at(index) !== undefined) && (consommable !== undefined)){
        this.getBaseConso().at(index).controls.unity.setValue(consommable.unity);
      }
    }

  }

  
  notSameStringValidator(l1: Array<any>, l2: Array<any>, name:string, last:boolean):ValidationErrors{
    if(l1.length !== l2.length){
      return {notSameSize: false}
    }
    else{
      return {notSameSize: true}
    }
  }

  getBaseIng(){
    return this.add_prepa_section.get("base_ing") as FormArray<FormGroup<{
      name:FormControl<string | null>,
      quantity:FormControl<number | null>,
      unity:FormControl<string | null>
    }>>
  }

  getBaseConso(){

    return this.add_prepa_section.get("base_conso") as FormArray<FormGroup<{
      name:FormControl<string | null>,
      quantity:FormControl<number | null>,
      unity:FormControl<string | null>
    }>>
  }

  getEtapes(){
    return this.add_prepa_section.get("etapes") as FormArray<FormGroup<{
      name:FormControl<string | null>,
      comm:FormControl<string | null>,
      heure:FormControl<number | null>,
      minute:FormControl<number | null>,
      seconde:FormControl<number | null>
    }>>
  }
  closePopup(click:MouseEvent){
    this.dialogRef.close();
  }
}
