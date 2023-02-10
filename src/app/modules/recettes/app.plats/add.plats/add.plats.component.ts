import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Cconsommable, Consommable, TIngredientBase } from 'src/app/interfaces/ingredient';
import { Cpreparation } from 'src/app/interfaces/preparation';

@Component({
  selector: 'app-add.plats',
  templateUrl: './add.plats.component.html',
  styleUrls: ['./add.plats.component.css']
})
export class AddPlatsComponent implements OnInit {
  public unity_conso:string;
  public unity_ing:string
  public full_lst_ings:Array<TIngredientBase>;
  public full_lst_conso:Array<Cconsommable>;
  public full_lst_prepa:Array<Cpreparation>;
  public selected_ing:string;
  public selected_conso:string;
  public selected_prepa:string;
  public add_plats_section = new FormGroup({
    name: new FormControl('', Validators.required),
    types: new FormControl('', Validators.required),
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
    quantity_aft_prep: new FormControl(0),
    unity: new FormControl("")
  });
  constructor(public dialogRef: MatDialogRef<AddPlatsComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data:{
    prop:string,
    restaurant:string,
    full_ingredients: Array<TIngredientBase>,
    full_consommables: Array<Consommable>,
    full_preparations: Array<Cpreparation>,
    }) {
    this.unity_conso = '';
    this.unity_ing = '';
    this.selected_ing = '';
    this.selected_conso = '';
    this.selected_prepa = '';
    this.full_lst_conso = [];
    this.full_lst_ings = [];
    this.full_lst_prepa = [];
   }

  ngOnInit(): void {
    this.full_lst_conso = this.data.full_consommables;
    this.full_lst_ings = this.data.full_ingredients;
    this.full_lst_prepa = this.data.full_preparations;

  }
  
  changePlats():void{

  }

  getUnity(new_selection:MatSelectChange, category:string){

    if(category === 'ing'){
      const ingredients = this.full_lst_ings.filter((ingredient) => ingredient.name === (new_selection.value as string));
      if(ingredients.length > 0) this.unity_ing = ingredients[0].unity;
    }
    if(category === 'conso'){
      const consommables = this.full_lst_conso.filter((consommable) => consommable.name === (new_selection.value) as string);
      if(consommables.length > 0) this.unity_conso = consommables[0].unity;
    }
  }

  addInputIng(){
    const new_ing = this.formBuilder.group({
      name: new FormControl(""),
      quantity: new FormControl(0),
      unity: new FormControl("")
    });
    new_ing.controls.unity.disable();
    this.getBaseIng().push(new_ing);
  }

  addInputConso(){
    const new_conso = this.formBuilder.group({
      name: new FormControl(""),
      quantity: new FormControl(0),
      unity: new FormControl("")
    });
    new_conso.controls.unity.disable();
    this.getBaseConso().push(new_conso);
  }

  addInputPrepa(){
    const new_prepa = this.formBuilder.group({
      name: new FormControl(""),
      quantity: new FormControl(0)
    });
    this.getBasePrepa().push(new_prepa);
  }

  addInputEtape(){
    const new_etape = this.formBuilder.group({
      name: new FormControl(""),
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