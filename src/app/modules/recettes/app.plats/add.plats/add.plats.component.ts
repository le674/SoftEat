import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cetape } from 'src/app/interfaces/etape';
import { Cconsommable, Consommable, TIngredientBase } from 'src/app/interfaces/ingredient';
import { Cplat, Plat } from 'src/app/interfaces/plat';
import { Cpreparation } from 'src/app/interfaces/preparation';
import { CalculService } from 'src/app/services/menus/menu.calcul/menu.calcul.ingredients/calcul.service';
import { PlatsInteractionService } from 'src/app/services/menus/plats-interaction.service';

@Component({
  selector: 'app-add.plats',
  templateUrl: './add.plats.component.html',
  styleUrls: ['./add.plats.component.css']
})
export class AddPlatsComponent implements OnInit {
  public unity_conso:Array<string>;
  public unity_ing:Array<string>;
  public full_lst_ings:Array<TIngredientBase>;
  public full_lst_conso:Array<Cconsommable>;
  public full_lst_prepa:Array<Cpreparation>;
  public selected_ing:string;
  public selected_conso:string;
  public selected_prepa:string;
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
      unity:FormControl<string | null>
    }>>([]),
    base_conso: new FormArray<FormGroup<{
      name:FormControl<string | null>,
      quantity:FormControl<number | null>,
      unity:FormControl<string | null>
    }>>([]),
    base_prepa: new FormArray<FormGroup<{
      name:FormControl<string | null>,
      quantity:FormControl<number | null>
    }>>([]),
    etapes: new FormArray<FormGroup<{
      name:FormControl<string | null>,
      comm:FormControl<string | null>,
      tmps:FormControl<number | null>
    }>>([]),
  });
  public boisson:boolean;

  constructor(public dialogRef: MatDialogRef<AddPlatsComponent>, public plat_interaction:PlatsInteractionService,
     private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data:{
    prop:string,
    restaurant:string,
    full_ingredients: Array<TIngredientBase>,
    full_consommables: Array<Consommable>,
    full_preparations: Array<Cpreparation>,
    }, private _snackBar: MatSnackBar, private calcul_service:CalculService) {
    this.unity_conso = [];
    this.unity_ing = [];
    this.selected_ing = '';
    this.selected_conso = '';
    this.selected_prepa = '';
    this.full_lst_conso = [];
    this.full_lst_ings = [];
    this.full_lst_prepa = [];
    this.boisson = false;
   }

  ngOnInit(): void {
    this.full_lst_conso = this.data.full_consommables;
    this.full_lst_ings = this.data.full_ingredients;
    this.full_lst_prepa = this.data.full_preparations;

  }
  
  changePlats():void{
    let plat:Plat = new Cplat();
    if(this.add_plats_section.controls.name.value !== null){
      plat.nom = this.add_plats_section.controls.name.value;
    }
    if(this.add_plats_section.controls.type.value !== null){
      plat.type = this.add_plats_section.controls.type.value;
    }
    if(this.add_plats_section.controls.portion.value !== null){
      plat.portions = this.add_plats_section.controls.portion.value;
    }
    if(this.add_plats_section.controls.price.value !== null){
      plat.prix = this.add_plats_section.controls.price.value;
    }
    if(this.add_plats_section.controls.name_tva.value !== null){
      plat.categorie = this.add_plats_section.controls.name_tva.value;
    }
    if(this.add_plats_section.controls.taux_tva.value !== null){
      plat.taux_tva = this.add_plats_section.controls.taux_tva.value;
    }
    if(this.add_plats_section.controls.base_ing.value !==null){
      let base_ings = this.add_plats_section.controls.base_ing.value;
      plat.ingredients = this.data.full_ingredients.filter((base_ing) => base_ings.map((ing) => ing.name).includes(base_ing.name))
    }
    if(this.add_plats_section.controls.base_conso.value !== null){
      let base_conso = this.add_plats_section.controls.base_conso.value;
      plat.consommables = this.data.full_consommables.filter((consommable) => base_conso.map((conso) => conso.name).includes(consommable.name));
    }
    if(this.add_plats_section.controls.base_prepa.value !== null){
      let base_prepa = this.add_plats_section.controls.base_prepa.value;
      plat.preparations = this.data.full_preparations.filter((preparation) => base_prepa.map((preparation) => preparation.name).includes(preparation.nom));
    }
    if(this.add_plats_section.controls.etapes.value !== null){
      let base_etapes = this.add_plats_section.controls.etapes.value;
      plat.etapes = base_etapes.map((etape) => {
        let etape_to_add = new Cetape()
        if((etape.name !== null) && (etape.name !== undefined)){
          etape_to_add.nom = etape.name;
        }
        if((etape.comm !== null) && (etape.comm !== undefined)){
          etape_to_add.commentaire = etape.comm;
        }
        if((etape.tmps !== null) && (etape.tmps !== undefined)){
          etape_to_add.temps = etape.tmps;
        }
        return etape_to_add;
      })
    }
    this.plat_interaction.setPlat(this.data.prop, this.data.restaurant, plat);
  }

  getUnity(new_selection:MatSelectChange, category:string){

    if(category === 'ing'){
      const ingredients = this.full_lst_ings.filter((ingredient) => ingredient.name === (new_selection.value as string));
      if(ingredients.length > 0) this.unity_ing.push(ingredients[0].unity);
    }
    if(category === 'conso'){
      const consommables = this.full_lst_conso.filter((consommable) => consommable.name === (new_selection.value) as string);
      if(consommables.length > 0) this.unity_conso.push(consommables[0].unity);
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
    const new_ing = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      quantity: new FormControl(0),
      unity: new FormControl("")
    });
    new_ing.controls.unity.disable();
    this.getBaseIng().push(new_ing);
  }

  addInputConso(){
    const new_conso = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      quantity: new FormControl(0),
      unity: new FormControl("")
    });
    new_conso.controls.unity.disable();
    this.getBaseConso().push(new_conso);
  }

  addInputPrepa(){
    const new_prepa = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      quantity: new FormControl(0)
    });
    this.getBasePrepa().push(new_prepa);
  }

  addInputEtape(){
    const new_etape = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      comm: new FormControl(""),
      tmps: new FormControl(0)
    });
    this.getEtapes().push(new_etape);
  }

  getBaseIng(){
    return this.add_plats_section.get("base_ing") as FormArray<FormGroup<{
      name:FormControl<string | null>,
      quantity:FormControl<number | null>,
      unity:FormControl<string | null>
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
      quantity:FormControl<number | null>
    }>>
  }
  getEtapes(){
    return this.add_plats_section.get("etapes") as FormArray<FormGroup<{
      name:FormControl<string | null>,
      comm:FormControl<string | null>,
      tmps:FormControl<number | null>
    }>>
  }
}