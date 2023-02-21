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
    plat: Cplat
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
    
    if((this.data.plat !== null) && (this.data.plat !== undefined)){
      if((this.data.plat.nom !== null) && (this.data.plat.nom !== undefined)){
        this.add_plats_section.controls.name.setValue(this.data.plat.nom.split('_').join(' '));
      }
      if((this.data.plat.categorie !== null) && (this.data.plat.categorie !== undefined)){
        this.add_plats_section.controls.name_tva.setValue(this.data.plat.categorie);
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
      if((this.data.plat.prix !== null) && (this.data.plat.prix !== undefined)){
        this.add_plats_section.controls.price.setValue(this.data.plat.prix);
      }
      if((this.data.plat.ingredients !== null) && (this.data.plat.ingredients !== undefined)){
        this.data.plat.ingredients.forEach((ingredient) => {
          const to_add_grp = new FormGroup({
            name:new FormControl(ingredient.name),
            quantity: new FormControl(ingredient.quantity),
            unity: new FormControl(ingredient.unity)
          })
          to_add_grp.controls.unity.disable();
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
          to_add_grp.controls.unity.disable();
          this.getBaseConso().push(to_add_grp);
        })
      }
      if((this.data.plat.etapes !== null) && (this.data.plat.etapes !== undefined)){
        this.data.plat.etapes.forEach((etape) => {
          const to_add_grp = new FormGroup({
            name:new FormControl(etape.nom),
            comm: new FormControl(etape.commentaire),
            tmps: new FormControl(etape.temps)
          })
          this.getEtapes().push(to_add_grp);
        })
      }
      if((this.data.plat.preparations !== null) && (this.data.plat.preparations !== undefined)){
        this.data.plat.preparations.forEach((preparation) => {
          const to_add_grp = new FormGroup({
            name: new FormControl(preparation.nom),
            quantity: new FormControl(preparation.quantity)
          })
          this.getBasePrepa().push(to_add_grp);
        })
      }
    }

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
      // on ajoute la quantitée présente pour le plat entré dans le formulaire comme étant la quantitée 
      plat.ingredients.map((ingredient) => {
        let quantity = 0;
        const ingredients = base_ings.filter((base) => base.name === ingredient.name);
        if(ingredients.length > 0){
          if((ingredients[0].quantity !== null) && (ingredients[0].quantity !== undefined)){
            quantity = ingredients[0].quantity
          }
        }
        ingredient.quantity = quantity;
        return ingredient
      }) 
    }
    if(this.add_plats_section.controls.base_conso.value !== null){
      let base_conso = this.add_plats_section.controls.base_conso.value;
      plat.consommables = this.data.full_consommables.filter((consommable) => base_conso.map((conso) => conso.name).includes(consommable.name));
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
    if(this.add_plats_section.controls.base_prepa.value !== null){
      let base_prepa = this.add_plats_section.controls.base_prepa.value;
      plat.preparations = this.data.full_preparations.filter((preparation) => base_prepa.map((prepa) => prepa.name).includes(preparation.nom))
                                                     .map((preparation) => { const first_prepa = base_prepa.find((prepa) => preparation.nom === prepa.name);
                                                      if((first_prepa?.quantity !== null) && (first_prepa?.quantity !== undefined)){
                                                        preparation.quantity = first_prepa.quantity; 
                                                      }
                                                      else{
                                                        preparation.quantity = 0;
                                                      }
                                                      return preparation
                                                    })
    }
    this.plat_interaction.setPlat(this.data.prop, this.data.restaurant, plat).finally(() => {
      this._snackBar.open(`le plat ${plat.nom} vient d'être ajouté`, "fermer")
    }).catch((e) => {
      console.log(e);
      this._snackBar.open(`le plat ${plat.nom} n'a pas pu être ajouté`, "fermer")
    });
  }

  getUnity(new_selection:MatSelectChange, category:string, index:number){
    if(category === 'ing'){
      const ingredients = this.full_lst_ings.filter((ingredient) => ingredient.name === (new_selection.value as string));
      if(index > this.unity_ing.length){
        if(ingredients.length > 0) this.unity_ing.push(ingredients[0].unity);
      }
      else{
        if(ingredients.length > 0) this.unity_ing[index] = ingredients[0].unity;
      }
    }
    if(category === 'conso'){
      const consommables = this.full_lst_conso.filter((consommable) => consommable.name === (new_selection.value) as string);
      if(index > this.unity_conso.length){
        if(consommables.length > 0) this.unity_conso.push(consommables[0].unity);
      }
      else{
        if(consommables.length > 0) this.unity_conso[index] = consommables[0].unity;
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
    const ingredient_length = this.getBaseIng().length - 1;
    const ingredients = this.data.plat.ingredients;
    if((ingredients[ingredient_length] !== undefined) && (ingredients.length > 0)){
      name = ingredients[ingredient_length].name;
      quantity = ingredients[ingredient_length].quantity;
      unity = ingredients[ingredient_length].unity;   
    }
    const new_ing = this.formBuilder.group({
      name: new FormControl(name, Validators.required),
      quantity: new FormControl(quantity),
      unity: new FormControl(unity)
    });
    new_ing.controls.unity.disable();
    this.getBaseIng().push(new_ing);
  }

  addInputConso(){
    let name = "";
    let quantity = 0;
    let unity = "";
    const consommable_length = this.getBaseConso().length - 1;
    const consommables = this.data.plat.consommables;
    if((consommables[consommable_length] !== undefined) && (consommables.length > 0)){
      name = consommables[consommable_length].name;
      quantity = consommables[consommable_length].quantity;
      unity =  consommables[consommable_length].unity;
    }

    const new_conso = this.formBuilder.group({
      name: new FormControl(name, Validators.required),
      quantity: new FormControl(quantity),
      unity: new FormControl(unity)
    });
    new_conso.controls.unity.disable();
    this.getBaseConso().push(new_conso);
  }

  addInputPrepa(){
    let name = "";
    let quantity = 0;
    const prepa_length = this.getBasePrepa().length - 1;
    const preparations = this.data.plat.preparations;
    if((preparations[prepa_length] !== undefined) && (preparations.length > 0)){
      if(preparations[prepa_length].nom !== null)  name = preparations[prepa_length].nom as string;
      if(preparations[prepa_length].quantity !== null) quantity = preparations[prepa_length].quantity;
    }
    const new_prepa = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      quantity: new FormControl(0)
    });
    this.getBasePrepa().push(new_prepa);
  }

  addInputEtape(){
    let name = "";
    let comm = "";
    let tmps = 0;
    const etape_length = this.getEtapes().length - 1;
    const etapes = this.data.plat.etapes;
    if((etapes[etape_length] !== undefined) && (etapes.length > 0)){
      if(etapes[etape_length].nom !== null)  name = etapes[etape_length].nom as string;
      if(etapes[etape_length].commentaire !== null) comm = etapes[etape_length].commentaire as string;
      if(etapes[etape_length].temps !== null) tmps = etapes[etape_length].temps;
    }

    const new_etape = this.formBuilder.group({
      name: new FormControl(name, Validators.required),
      comm: new FormControl(comm),
      tmps: new FormControl(tmps)
    });
    this.getEtapes().push(new_etape);
  }

  suppInputIng(){
    this.getBaseIng().removeAt(this.getBaseIng().length - 1);
  }

  suppInputConso(){
    this.getBaseConso().removeAt(this.getBaseConso().length - 1);
  }

  suppInputPrepa(){
    this.getBasePrepa().removeAt(this.getBasePrepa().length - 1);
  }

  suppInputEtape(){
    this.getEtapes().removeAt(this.getEtapes().length - 1);
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