import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cetape } from 'src/app/interfaces/etape';
import {Consommable, TConsoBase, TIngredientBase } from 'src/app/interfaces/ingredient';
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
  private current_inputs_ing: number;
  private current_inputs_conso: number;
  private current_inputs_etapes: number;
  public index_ings_inputs: Array<number>;
  public index_consos_inputs: Array<number>;
  public index_etapes_inputs: Array<number>;
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
  private bdd_conso: Array<TIngredientBase>;
  private bdd_etapes: Array<TIngredientBase>;
  private to_add:string;
  private unity:string;
  
  @ViewChild('taux')
  taux!: ElementRef;


  constructor(public dialogRef: MatDialogRef<AddPreparationsComponent>,
    public calcul_service: CalculService, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data:{
    prop:string,
    restaurant:string,
    names: Array<string | null>,
    name:string,
    ingredients: Array<TIngredientBase>,
    consommables: Array<Consommable>,
    etapes: Array<Cetape>,
    unity:string,
    quantity_after_prep:number
    }, private preparation_service: PreparationInteractionService, private ingredient_service: IngredientsInteractionService,
    private prepa_service:CalculPrepaService, private conso_service:ConsommableInteractionService, private _snackBar: MatSnackBar) { 
    this.is_stock = false;  
    this.base_ings = [];
    this.base_conso = [];
    this.etapes = [];
    this.bdd_conso = [];
    this.bdd_etapes = [];
    this.index_consos_inputs = [];
    this.index_ings_inputs = [];
    this.index_etapes_inputs = [];
    this.current_inputs_ing = 1;
    this.current_inputs_conso = 1;
    this.current_inputs_etapes = 1;
    this.to_add = "";
    this.unity = "";
  }


  ngOnInit(): void {

    this.add_prepa_section.controls.name.setValue(this.data.name);
    this.add_prepa_section.controls.unity.setValue(this.data.unity);
    this.add_prepa_section.controls.quantity_aft_prep.setValue(this.data.quantity_after_prep);
    let tmp_data:Array<{name:string | null, quantity: number | null, unity: string | null}> = [];
    if((this.data.ingredients !== null) && (this.data.ingredients !== undefined)){
      this.current_inputs_ing = this.data.ingredients.length;
      tmp_data = this.data.ingredients.map((ing) => {
        return {name: ing.name, quantity: ing.quantity, unity: ing.unity};
      })
      for (let index = 0; index < this.current_inputs_ing; index++) {
        this.index_ings_inputs.push(index);
        const new_ing = this.formBuilder.group({
          name: new FormControl(tmp_data[index].name),
          quantity: new FormControl(tmp_data[index].quantity),
          unity: new FormControl(tmp_data[index].unity)
        });
        this.getBaseIng().push(new_ing);
      }
    }

    if((this.data.consommables !== null) && (this.data.consommables !== undefined)){
      this.current_inputs_conso = this.data.consommables.length;
      tmp_data =  this.data.consommables.map((conso) => {
        return {name: conso.name, quantity: conso.quantity, unity: conso.unity};
      })
      for (let index = 0; index < this.current_inputs_conso ; index++) {
        const new_conso = this.formBuilder.group({
          name: new FormControl(tmp_data[index].name),
          quantity: new FormControl(tmp_data[index].quantity),
          unity: new FormControl(tmp_data[index].unity)
        });
        this.getBaseConso().push(new_conso);
      }
    }
    
    if((this.data.etapes !== null) && (this.data.etapes !== undefined)){
      this.current_inputs_etapes = this.data.etapes.length;
      for (let index = 0; index < this.current_inputs_etapes; index++) {
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
    let to_add_preparation_name:string = "";
    
    
    const name_prepa = this.add_prepa_section.value.name
    if(name_prepa !== undefined){

      if(!this.data.names.includes(name_prepa)){
        if(name_prepa !== null){
          to_add_preparation_name = name_prepa;
          
          const base_ings = this.getBaseIng();
          const base_conso = this.getBaseConso();
          const etapes_prepa = this.getEtapes();
          
          base_ings.value.forEach((ing:Partial<{name:string | null, quantity:number | null, unity:string | null}>) => {
            let full_ing:TIngredientBase = {name:"", quantity:0,quantity_unity:0,unity:"",cost:0,material_cost: 0, vrac:'non',marge:0};
            if((ing.name !== undefined) || (ing.name !== null)){
              full_ing.name = ing.name as string;
              if((ing.quantity !== undefined) || (ing.quantity !== null)){
                full_ing.quantity = ing.quantity as number;
              } 
              if((ing.unity !== undefined) || (ing.unity !== null)){
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

          let ing_prop = this.ingredient_service.getIngredientsQuantityUnityFromBaseIngs(this.base_ings, this.data.prop, this.data.restaurant).then((ings) => {
            this.getBaseIng().setErrors(this.notSameStringValidator(ings, this.base_ings,
             "ingredients", false));
            this.base_ings = [];
            //on 
            let result = this.prepa_service.getCostMaterial(ings).filter((ing) => !(ing.nom === ""));
            for (let index = 0; index < result.length; index++) {
              const ing: TIngredientBase = {
                name: result[index].nom,
                quantity: result[index].quantity,
                quantity_unity: ings[index].quantity_unity,
                unity: result[index].unity,
                cost: result[index].cost,
                material_cost: result[index].cost_matiere,
                vrac:"non",
                marge: 0
              }
              this.base_ings.push(ing);
            }
          })

          const conso_prop = ing_prop.then(() => {
            const curr_conso = this.conso_service.getConsosmmablesFromBaseConso(this.base_conso, this.data.prop, this.data.restaurant).then((consos) => {
              this.getBaseConso().setErrors(this.notSameStringValidator(consos, this.base_conso, "consommables", true));
              this.base_conso = [];
              let displayed_conso = consos.map((conso) => {
                  return {name: conso.name, cost: conso.cost, quantity: conso.quantity, unity: conso.unity}
              }).filter((conso) => !(conso.name === ""))
              for (let index = 0; index < displayed_conso.length; index++) {
                const conso: TConsoBase = {
                  name: displayed_conso[index].name,
                  quantity: displayed_conso[index].quantity,
                  unity: displayed_conso[index].unity,
                  cost: displayed_conso[index].cost
                }
                 this.base_conso.push(conso)            
              }
            })
            curr_conso.then(() => {
              const unity_aft_prep = this.add_prepa_section.controls.unity.value;
              const quantity_aft_prep = this.add_prepa_section.controls.quantity_aft_prep.value;
              if((unity_aft_prep !== null) && (quantity_aft_prep !== null)){
                this.after_prep.quantity = quantity_aft_prep;
                this.after_prep.unity = unity_aft_prep;
              }
              conso_prop.then(() => {
                if(this.getBaseConso().getError("notSameSize") || this.getBaseIng().getError("notSameSize")){           
                  if(this.getBaseConso().getError("notSameSize")){
                    if(this.getBaseIng().getError("notSameSize")){
                      this.preparation_service.setNewPreparation(this.data.restaurant, this.data.prop,
                        name_prepa.split(" ").join('_'), this.etapes, this.base_ings, this.base_conso, this.after_prep ,this.is_stock).catch((e) => {
                         this._snackBar.open("nous ne somme pas parvenu à modifier la préparation veuillez contacter SoftEat");
                        }).finally(() => {
                         this._snackBar.open("la préparation vient d'être ajouté", "fermer");
                        });
                    }
                    else{
                      // en cas d'erreur ont remet les listes à vides
                      this.etapes = [];
                      this.base_conso = [];
                      this.base_ings = [];
                      this._snackBar.open(`Veuillez entrer les ingrédients dans la section stock de  l'application`, "fermer")
                    }
                  }
                  else{
                    // en cas d'erreur ont remet les listes à vides
                    this.etapes = [];
                    this.base_conso = [];
                    this.base_ings = [];
                    this._snackBar.open(`Veuillez entrer les consomables dans la section stock de  l'application`, "fermer")
                  }
                }
                else{
                  // en cas d'erreur ont remet les listes à vides
                  this.etapes = [];
                  this.base_conso = [];
                  this.base_ings = [];
                  this._snackBar.open(`Veuillez entrer les consomables et ingrédients dans la section stock de  l'application`, "fermer")
                } 
              })  
            })
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
    this.current_inputs_ing = this.current_inputs_ing + 1;
    this.index_ings_inputs.push(this.current_inputs_ing);
    const new_ing = this.formBuilder.group({
      name: new FormControl(""),
      quantity: new FormControl(0),
      unity: new FormControl("")
    });
    this.getBaseIng().push(new_ing);

  }

  addInputConso(){
    this.current_inputs_conso = this.current_inputs_conso + 1;
    this.index_consos_inputs.push(this.current_inputs_conso);
    const new_conso = this.formBuilder.group({
      name: new FormControl(""),
      quantity: new FormControl(0),
      unity: new FormControl("")
    });
    this.getBaseConso().push(new_conso);
  }

  addInputEtape(){

    this.current_inputs_etapes = this.current_inputs_etapes + 1;
    this.index_etapes_inputs.push(this.current_inputs_etapes);
    const new_etape = this.formBuilder.group({
      name: new FormControl(""),
      comm: new FormControl(""),
      tmps: new FormControl(0),
    });
    this.getEtapes().push(new_etape);
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
