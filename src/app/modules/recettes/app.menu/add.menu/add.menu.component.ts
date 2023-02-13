import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cconsommable, CIngredient, Consommable, TIngredientBase } from 'src/app/interfaces/ingredient';
import { Cmenu } from 'src/app/interfaces/menu';
import { Cplat } from 'src/app/interfaces/plat';
import { MenuInteractionService } from 'src/app/services/menus/menu-interaction.service';

@Component({
  selector: 'app-add.menu',
  templateUrl: './add.menu.component.html',
  styleUrls: ['./add.menu.component.css']
})
export class AddMenuComponent implements OnInit {
  public plats: Array<Cplat>;
  public ingredients: Array<CIngredient>;
  public consommables: Array<Cconsommable>;
  public unity_conso:Array<string>;
  public unity_ing:Array<string>;
  public add_menu_section = new FormGroup({
    name: new FormControl('', Validators.required),
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
    base_plat: new FormArray<FormGroup<{
      name:FormControl<string | null>
    }>>([])
  });

  constructor(public dialogRef: MatDialogRef<AddMenuComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data:{
    prop:string,
    restaurant:string,
    ingredients: Array<CIngredient>,
    consommables: Array<Consommable>,
    plats: Array<Cplat>,
    menu: Cmenu
    }, private menu_service:MenuInteractionService, private _snackBar:MatSnackBar) {
      this.unity_conso = [];
      this.unity_ing = [];
      this.plats = this.data.plats;
      this.ingredients = this.data.ingredients;
      this.consommables = this.data.consommables;
     }

  ngOnInit(): void {
    if(this.data.menu !== null){
      if((this.data.menu.nom !== null) && (this.data.menu.nom !== undefined)){
        this.add_menu_section.controls.name.setValue(this.data.menu.nom);
        if((this.data.menu.prix !== null) && (this.data.menu.prix !== undefined)){
          this.add_menu_section.controls.price.setValue(this.data.menu.prix);
        }
        if((this.data.menu.ingredients !== null) && (this.data.menu.ingredients !== undefined)){
          this.data.menu.ingredients.forEach((ingredient) => {
            const form_ingredient = new FormGroup({
              name: new FormControl(ingredient.nom),
              quantity: new FormControl(ingredient.quantity),
              unity: new FormControl(ingredient.unity)
            })
            this.getBaseIng().push(form_ingredient);
          })
        }
        if((this.data.menu.consommables !== null) && (this.data.menu.consommables !== undefined)){
          this.data.menu.consommables.forEach((consommable) => {
            const form_consommable = new FormGroup({
              name: new FormControl(consommable.name),
              quantity: new FormControl(consommable.quantity),
              unity: new FormControl(consommable.unity)
            })
            this.getBaseConso().push(form_consommable);
          })
        }
        if((this.data.menu.plats !== null) && (this.data.menu.plats !== undefined)){
          this.data.menu.plats.forEach((plat) => {
            const form_plat = new FormGroup({
              name: new FormControl(plat.nom)
            })
            this.getBasePlat().push(form_plat)
          })
        }
      }
    }
  }
  
  changeMenu(){
    let menu = new Cmenu();
    const name = this.add_menu_section.controls.name.value;
    const price = this.add_menu_section.controls.price.value;
    const ingredients = this.add_menu_section.controls.base_ing.controls.map((ingredient) =>{
      return {name: ingredient.controls.name.value, quantity: ingredient.controls.quantity.value, unity: ingredient.controls.unity.value};
    });
    const consommables = this.add_menu_section.controls.base_conso.controls.map((consommable) =>{
      return {name: consommable.controls.name.value, quantity: consommable.controls.quantity.value, unity: consommable.controls.unity.value};
    });
    
    const plats = this.add_menu_section.controls.base_plat.controls.map((plat) => plat.controls.name.value);
    if((name !== null) && (name !== undefined)){
      menu.nom = name;
      if((price !== null) && (price !== undefined)){
        menu.prix = price;
      }
      let _ing = this.data.ingredients.filter((ingredient) =>  ingredients.map((ing) => ing.name)
                                          .includes(ingredient.nom))
      let _conso = this.data.consommables.filter((consommable) => consommables.map((conso) => conso.name)
                                             .includes(consommable.name))
      let _plats = this.data.plats.filter((plat) => plats.includes(plat.nom))
      _ing.forEach((full_ingredient) => {
        const _ingredient = ingredients.find((ingredient) => full_ingredient.nom === ingredient.name);
        if(_ingredient !== undefined){
            if(_ingredient.quantity !== null){
              full_ingredient.quantity = _ingredient.quantity
              if((full_ingredient.vrac !== 'oui') && (full_ingredient.quantity_unity !== 0)){
                full_ingredient.quantity = full_ingredient.quantity/full_ingredient.quantity_unity;
            }
          }
        }
      })
      _conso.forEach((full_consommable) => {
        const _consommable = consommables.find((consommable) => full_consommable.name === consommable.name);
        if(_consommable !== undefined){
            if(_consommable.quantity !== null) full_consommable.quantity = _consommable.quantity
        }
      })

      menu.ingredients = _ing;
      menu.consommables = _conso;
      menu.plats = _plats;
      this.menu_service.setMenu(this.data.prop, this.data.restaurant, menu).catch(() => {
        this._snackBar.open("le menu n'a pas été ajouté", "fermer");
      }).finally(() => {
        this._snackBar.open("le menu vient d'être ajouté", "fermer");
      });

    }
  }

  getUnity(new_selection:MatSelectChange, category:string, index:number){

    if(category === 'ing'){
      const ingredients = this.ingredients.filter((ingredient) => ingredient.nom === (new_selection.value as string));
      if(index > this.unity_ing.length){
        if(ingredients.length > 0) this.unity_ing.push(ingredients[0].unity);
      }
      else{
        if(ingredients.length > 0) this.unity_ing[index] = ingredients[0].unity;
      }
    }
    if(category === 'conso'){
      const consommables = this.consommables.filter((consommable) => consommable.name === (new_selection.value) as string);
      if(index > this.unity_conso.length){
        if(consommables.length > 0) this.unity_conso.push(consommables[0].unity);
      }
      else{
        if(consommables.length > 0) this.unity_conso[index] = consommables[0].unity;
      }
    }
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

  addInputPlat(){
    const new_plat = this.formBuilder.group({
      name: new FormControl("", Validators.required),
    });
    this.getBasePlat().push(new_plat);
  }
  getBaseIng(){
    return this.add_menu_section.get("base_ing") as FormArray<FormGroup<{
      name:FormControl<string | null>,
      quantity:FormControl<number | null>,
      unity:FormControl<string | null>
    }>>
  }

  getBaseConso(){
    return this.add_menu_section.get("base_conso") as FormArray<FormGroup<{
      name:FormControl<string | null>,
      quantity:FormControl<number | null>,
      unity:FormControl<string | null>
    }>>
  }

  getBasePlat(){
    return this.add_menu_section.get("base_plat") as FormArray<FormGroup<{
      name:FormControl<string | null>
    }>>
  }

}
