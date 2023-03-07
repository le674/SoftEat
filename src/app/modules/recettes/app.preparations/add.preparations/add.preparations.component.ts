import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cetape } from 'src/app/interfaces/etape';
import {Cconsommable, Consommable, TConsoBase, TIngredientBase } from 'src/app/interfaces/ingredient';
import { AfterPreparation } from 'src/app/interfaces/preparation';
import { ConsommableInteractionService } from 'src/app/services/menus/consommable-interaction.service';
import { IngredientsInteractionService } from 'src/app/services/menus/ingredients-interaction.service';
import { CalculService } from 'src/app/services/menus/menu.calcul/menu.calcul.ingredients/calcul.service';
import { CalculPrepaService } from 'src/app/services/menus/menu.calcul/menu.calcul.preparation/calcul.prepa.service';
import { PreparationInteractionService } from 'src/app/services/menus/preparation-interaction.service';

@Component({
  selector: 'app-add.preparations',
  templateUrl: './add.preparations.component.html',
  styleUrls: ['./add.preparations.component.css']
})
export class AddPreparationsComponent implements OnInit{
  private is_stock:boolean;
  public unity_ing:Array<string>;
  public unity_conso:Array<string>;
  public ingredients: Array<TIngredientBase>;
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
      tmps:FormControl<number | null>
    }>>([]),
    quantity_aft_prep: new FormControl(0),
    unity: new FormControl("")
  });
  private base_ings: Array<TIngredientBase>;
  private base_conso: Array<TConsoBase>;
  private etapes: Array<Cetape>;
  private after_prep:AfterPreparation = {quantity: 0, unity:""}; 
  
  @ViewChild('taux')
  taux!: ElementRef;


  constructor(public dialogRef: MatDialogRef<AddPreparationsComponent>,
    public calcul_service: CalculService, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data:{
    prop:string,
    restaurant:string,
    names: Array<string | null>,
    name:string,
    full_ingredients: Array<TIngredientBase>,
    full_consommables: Array<Cconsommable>,
    ingredients: Array<TIngredientBase>,
    consommables: Array<Consommable>,
    etapes: Array<Cetape>,
    unity:string,
    quantity_after_prep:number,
    modification:boolean
    }, private preparation_service: PreparationInteractionService, private ingredient_service: IngredientsInteractionService,
    private prepa_service:CalculPrepaService, private conso_service:ConsommableInteractionService, private _snackBar: MatSnackBar) { 
    
    if(this.data.full_ingredients !== null){
      this.ingredients = this.data.full_ingredients;
    }
    else{
      this.ingredients = [];
    }
    
    if(this.data.full_consommables !== null){
      this.consommables = this.data.full_consommables;
    }
    else{
      this.consommables = [];
    }
    if(this.data.modification){
      this.setTrue()
    }
    this.is_stock = false;  
    this.base_ings = [];
    this.base_conso = [];
    this.etapes = [];
    this.unity_conso = [];
    this.unity_ing = [];
  }


  ngOnInit(): void {
    // pour le moment dans consommable ont met p au lieu d'une autre unitée.  car ont ne gère pas encore les quantitée unitaire
    //pour les consommables 
    this.add_prepa_section.controls.name.setValue(this.data.name);
    this.add_prepa_section.controls.unity.setValue(this.data.unity);
    this.add_prepa_section.controls.quantity_aft_prep.setValue(this.data.quantity_after_prep);
    let tmp_data:Array<{name:string | null, quantity: number | null, unity: string | null}> = [];
    if((this.data.ingredients !== null) && (this.data.ingredients !== undefined)){
      const current_inputs_ing = this.data.ingredients.length;
      tmp_data = this.data.ingredients.map((ing) => {
        // ont prend en compte le cas où on modifie une préparation contenant un ingrédient pour lequel
        // nous n'avons pas décider une unitée pour la préparation. Mais nous l'avons ajouté à l'inventaire
        // exemple : huile 1 litre dans l'inventaire, 1 c.s dans la préparation.
        let unity = ing.unity_unitary;
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

    if((this.data.consommables !== null) && (this.data.consommables !== undefined)){
      const current_inputs_conso = this.data.consommables.length;
      tmp_data =  this.data.consommables.map((conso) => {
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
    
    if((this.data.etapes !== null) && (this.data.etapes !== undefined)){
      const current_inputs_etapes = this.data.etapes.length;
      for (let index = 0; index < current_inputs_etapes; index++) {
        const new_etape = this.formBuilder.group({
          name: new FormControl(this.data.etapes[index].nom),
          comm: new FormControl(this.data.etapes[index].commentaire),
          tmps: new FormControl(this.data.etapes[index].temps),
        })
        this.getEtapes().push(new_etape);
      }
    }

  }

  changePreparation(){
    let consos:Cconsommable[] = [];
    let ings:TIngredientBase[] = [];
    let to_add_preparation_name:string = "";
    let tmps_prepa = 0;
    let val_bouch = 0;
    const name_prepa = this.add_prepa_section.value.name
    if(name_prepa !== undefined){
      if(!this.data.names.includes(name_prepa)){
        if(name_prepa !== null){
          to_add_preparation_name = name_prepa;
          
          const base_ings = this.getBaseIng();
          const base_conso = this.getBaseConso();
          const etapes_prepa = this.getEtapes();
          
          base_ings.value.forEach((ing:Partial<{name:string | null, quantity:number | null, unity:string | null}>) => {
            let full_ing:TIngredientBase = {name:"", quantity:0,quantity_unity:0,
            unity:"", unity_unitary: "",cost:0,material_cost: 0, vrac:'non',taux_tva: 0,marge:0};
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
              this.base_ings.push(full_ing);
            }
          })
          base_conso.value.forEach((conso:Partial<{name:string | null, quantity:number | null, unity:string | null}>) => {
            if(conso.name !== undefined || (conso.name !== null)){
              if((conso.quantity === undefined) || (conso.quantity === null)) conso.quantity = 0;
              if((conso.unity === undefined) || (conso.unity === null)) conso.unity = "";
              const act_conso:TConsoBase = {
                name: conso.name as string,
                quantity: conso.quantity,
                unity: conso.unity,
                cost: 0
              };
              this.base_conso.push(act_conso);
            } 
          })
          etapes_prepa.value.forEach((etape:Partial<{name:string | null, comm:string | null, tmps:number | null}>) => {
            if(etape.name !== undefined || (etape.name !== null)){
              if((etape.tmps !== undefined) || (etape.tmps !== null)){
                if((etape.comm === undefined) || (etape.comm === null)) etape.comm = "";
                let add_etape = new Cetape();
                add_etape.nom = (etape.name as string);
                add_etape.temps = (etape.tmps as number);
                add_etape.commentaire = (etape.comm as string); 
                this.etapes.push(add_etape);
              }
            } 
          });
          // le problème c'est que là on supprime les quantitée que l'on à mit avant 
          this.base_ings.forEach((ingredient) => {
            const _ingredient = this.data.full_ingredients.find((ing) => ingredient.name === ing.name);
            if((ingredient.quantity !== undefined) && (ingredient.unity !== undefined)){
              if(_ingredient?.quantity !== undefined){
                _ingredient.quantity = ingredient.quantity;
              }
              if(_ingredient?.unity !== undefined){
                _ingredient.unity = ingredient.unity;
              }
              if(_ingredient !== undefined) ings.push(_ingredient);
            }
          });

          this.base_conso.forEach((_consommable) => {
            const consommable = this.data.full_consommables.find((conso) => _consommable.name === conso.name);
            if(_consommable.quantity !== undefined){
              if(consommable?.quantity !== undefined){
                consommable.quantity = _consommable.quantity;
                consos.push(consommable);
              }
            }
          })
          let result = this.prepa_service.getCostMaterial(ings).filter((ing) => !(ing.nom === ""));
          let displayed_conso = consos.map((conso) => { return {name: conso.name, cost: conso.cost, quantity: conso.quantity, unity: conso.unity}})
                                      .filter((conso) => !(conso.name === ""));
          // ont vide les listes avant l'ajout dans la bdd
          this.base_ings = [];
          this.base_conso = [];
          for(let index = 0; index < result.length; index++){
              const ing: TIngredientBase = {
                name: result[index].nom,
                quantity: result[index].quantity,
                quantity_unity: ings[index].quantity_unity,
                unity: result[index].unity,
                unity_unitary: ings[index].unity_unitary,
                cost: result[index].cost,
                material_cost: result[index].cost_matiere,
                vrac:result[index].vrac,
                taux_tva: result[index].taux_tva,
                marge: 0
              }
            this.base_ings.push(ing);
          }
          for (let index = 0; index < displayed_conso.length; index++) {
            const conso: TConsoBase = {
              name: displayed_conso[index].name,
              quantity: displayed_conso[index].quantity,
              unity: displayed_conso[index].unity,
              cost: displayed_conso[index].cost
            }
           this.base_conso.push(conso)            
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
          if((this.base_ings !== null) && (this.base_ings !== undefined)){
            val_bouch = this.prepa_service.getValBouchFromBasIng(this.base_ings, this.after_prep.quantity, this.after_prep.unity);
          }
          this.prepa_service.getPrimCost(this.data.prop, this.data.restaurant,this.etapes, this.base_ings,
            this.base_conso).then((prime_cost) => {
              this.preparation_service.setNewPreparation(this.data.restaurant, this.data.prop, name_prepa.split(" ").join('_'),
              this.etapes, this.base_ings, this.base_conso, this.after_prep,
              this.is_stock, this.data.modification,  prime_cost, val_bouch, tmps_prepa).catch((e) => {
                 console.log(e);
                 this.etapes = [];
                 this.base_conso = [];
                 this.base_ings = [];
                 this._snackBar.open("nous ne somme pas parvenu à modifier la préparation veuillez contacter SoftEat");
               }).finally(() => {
                 this.etapes = [];
                 this.base_conso = [];
                 this.base_ings = [];
                 this._snackBar.open("la préparation vient d'être ajouté", "fermer");
               });
            })
        }
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
    if(this.data.ingredients !== null){
      const ingredients = this.data.ingredients.map((ing) => {
        return {name: ing.name, quantity: ing.quantity, unity: ing.unity};
      })
      if(ings_length > 0){
        if(ingredients[ings_length] !== undefined){
          name = ingredients[ings_length].name;
          quantity = ingredients[ings_length].quantity;
          unity = ingredients[ings_length].unity; 
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
    if(this.data.consommables !== null){
      const consommables =  this.data.consommables.map((conso) => {
        return {name: conso.name, quantity: conso.quantity, unity: conso.unity};
      }); 
      if((consommables[consommable_length] !== undefined) && (consommable_length > 0)){
        name = consommables[consommable_length].name;
        quantity = consommables[consommable_length].quantity;
        unity = consommables[consommable_length].unity;
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
    let tmps = 0;
    const etape_length = this.getEtapes().length;
    const etapes = this.data.etapes;
    if(etapes !== null){
      if((etapes[etape_length] !== undefined) && (etape_length > 0)){
        name = etapes[etape_length].nom;
        if(etapes[etape_length].commentaire !== null) comm = etapes[etape_length].commentaire as string;
        if(etapes[etape_length].temps !== null) tmps = etapes[etape_length].temps;
      } 
    }
    const new_etape = this.formBuilder.group({
      name: new FormControl(name),
      comm: new FormControl(comm),
      tmps: new FormControl(tmps),
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
      tmps:FormControl<number | null>
    }>>
  }

}
