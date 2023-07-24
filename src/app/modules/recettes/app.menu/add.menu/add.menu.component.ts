import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CIngredient, TIngredientBase } from '../../../../../app/interfaces/ingredient';
import { Cmenu } from '../../../../../app/interfaces/menu';
import { Cplat } from '../../../../../app/interfaces/plat';
import { MenuInteractionService } from '../../../../../app/services/menus/menu-interaction.service';
import { MenuCalculMenuService } from '../../../../../app/services/menus/menu.calcul/menu.calcul.menu.service';
import { Cconsommable, TConsoBase } from 'src/app/interfaces/consommable';

@Component({
  selector: 'app-add.menu',
  templateUrl: './add.menu.component.html',
  styleUrls: ['./add.menu.component.css']
})
export class AddMenuComponent implements OnInit {
  public plats: Array<Cplat>;
  public ingredients: Array<CIngredient>;
  public consommables: Array<Cconsommable>;
  public unity_conso: Array<string>;
  public unity_ing: Array<string>;
  public curr_ingredients_vrac: Array<number>;

  public add_menu_section = new FormGroup({
    name: new FormControl('', Validators.required),
    price: new FormControl(0, Validators.required),
    base_ing: new FormArray<FormGroup<{
      name: FormControl<string | null>,
      quantity: FormControl<number | null>,
      unity: FormControl<string | null>
    }>>([]),
    base_conso: new FormArray<FormGroup<{
      name: FormControl<string | null>,
      quantity: FormControl<number | null>,
      unity: FormControl<string | null>
    }>>([]),
    base_plat: new FormArray<FormGroup<{
      name: FormControl<string | null>
    }>>([])
  });

  constructor(public dialogRef: MatDialogRef<AddMenuComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: {
    prop: string,
    restaurant: string,
    ingredients: Array<CIngredient>,
    consommables: Array<Cconsommable>,
    plats: Array<Cplat>,
    menu: Cmenu
  }, private menu_service: MenuInteractionService, private _snackBar: MatSnackBar, private menu_calcul: MenuCalculMenuService) {
    this.unity_conso = [];
    this.unity_ing = [];
    this.curr_ingredients_vrac = [];
    this.plats = this.data.plats;
    this.ingredients = this.data.ingredients;
    this.consommables = this.data.consommables;
  }

  ngOnInit(): void {
    if (this.data.menu !== null) {
      if ((this.data.menu.name !== null) && (this.data.menu.name !== undefined)) {
        this.add_menu_section.controls.name.setValue(this.data.menu.name);
        if ((this.data.menu.cost !== null) && (this.data.menu.cost !== undefined)) {
          this.add_menu_section.controls.price.setValue(this.data.menu.cost);
        }
        if ((this.data.menu.ingredients !== null) && (this.data.menu.ingredients !== undefined)) {

          this.data.menu.ingredients.forEach((ingredient) => {
            let quantity = ingredient.quantity;
            let _ing = this.data.ingredients.find((ing) => ing.name === ingredient.name);
            quantity = ingredient.quantity
            const form_ingredient = new FormGroup({
              name: new FormControl(ingredient.name),
              quantity: new FormControl(quantity),
              unity: new FormControl(ingredient.unity)
            })
            this.getBaseIng().push(form_ingredient);
          })
        }
        if ((this.data.menu.consommables !== null) && (this.data.menu.consommables !== undefined)) {
          this.data.menu.consommables.forEach((consommable) => {
            const form_consommable = new FormGroup({
              name: new FormControl(consommable.name),
              quantity: new FormControl(consommable.quantity),
              unity: new FormControl(consommable.unity)
            })
            this.getBaseConso().push(form_consommable);
          })
        }
        if ((this.data.menu.plats !== null) && (this.data.menu.plats !== undefined)) {
          this.data.menu.plats.forEach((plat) => {
            const form_plat = new FormGroup({
              name: new FormControl(plat.name)
            })
            this.getBasePlat().push(form_plat)
          })
        }
      }
    }
  }

  changeMenu() {
    let menu = new Cmenu();
    let _ing = null;
    let _conso = null;
    let _plats = null;
    const menu_ingredients = this.data.menu.ingredients;
    const menu_consommables = this.data.menu.consommables;
    const menu_plats = this.data.menu.plats;
    const name = this.add_menu_section.controls.name.value;
    const price = this.add_menu_section.controls.price.value;
    const ingredients = this.add_menu_section.controls.base_ing.controls.map((ingredient) => {
      return { name: ingredient.controls.name.value, quantity: ingredient.controls.quantity.value, unity: ingredient.controls.unity.value };
    });
    const consommables = this.add_menu_section.controls.base_conso.controls.map((consommable) => {
      return { name: consommable.controls.name.value, quantity: consommable.controls.quantity.value, unity: consommable.controls.unity.value };
    });

    const plats = this.add_menu_section.controls.base_plat.controls.map((plat) => plat.controls.name.value);
    if ((name !== null) && (name !== undefined)) {
      menu.name = name;
      if ((price !== null) && (price !== undefined)) {
        menu.cost = price;
      }
      if(menu_ingredients !== null){
        _ing = menu_ingredients.filter((ingredient) => ingredients.map((ing) => ing.name)
        .includes(ingredient.name));
        _ing.forEach((full_ingredient) => {
          const _ingredient = ingredients.find((ingredient) => full_ingredient.name === ingredient.name);
          if (_ingredient !== undefined) {
            if (_ingredient.quantity !== null) {
              full_ingredient.quantity = _ingredient.quantity
            }
          }
        });
      }
      if(menu_consommables !== null){
        _conso = menu_consommables.filter((consommable) => consommables.map((conso) => conso.name)
        .includes(consommable.name));
        _conso.forEach((full_consommable) => {
          const _consommable = consommables.find((consommable) => full_consommable.name === consommable.name);
          if (_consommable !== undefined) {
            if (_consommable.quantity !== null) full_consommable.quantity = _consommable.quantity
          }
        })
      }
      if(menu_plats !== null){
        _plats = menu_plats.filter((plat) => plats.includes(plat.name));
      }
      menu.ingredients = _ing;
      menu.consommables = _conso;
      menu.plats = _plats;
      menu.taux_tva = this.menu_calcul.getTauxTvaVentilee(menu, this.data.ingredients, this.data.plats);
      menu.cost_ttc = this.menu_calcul.getPriceTTC(menu.cost, menu.taux_tva);
      this.menu_service.setMenu(this.data.prop, this.data.restaurant, menu).catch(() => {
        this._snackBar.open("le menu n'a pas été ajouté", "fermer");
      }).finally(() => {
        this._snackBar.open("le menu vient d'être ajouté", "fermer");
      });

    }
  }

  getUnity(new_selection: MatSelectChange, category: string, index: number) {
    if (category === 'ing') {
      const ingredients = this.ingredients.filter((ingredient) => ingredient.name === (new_selection.value as string));
      const ingredient = this.ingredients.find((ingredient) => ingredient.name === (new_selection.value as string));
      if ((this.getBaseIng().at(index) !== undefined) && (ingredient !== undefined)) {
        this.getBaseIng().at(index).controls.unity.setValue(ingredient.unity);
      }
    }
    if (category === 'conso') {
      const consommable = this.consommables.find((consommable) => consommable.name === (new_selection.value) as string);
      if (index > this.unity_conso.length) {
        if (consommable !== undefined) {
          if(consommable.unity !== null){
            this.unity_conso.push(consommable.unity);
          }
        }
      }
      else {
        if (consommable !== undefined){
          if(consommable.unity !== null){
            this.unity_conso[index] = consommable.unity;
          }
        } 
      }
    }
  }
  // lorsque l'ingédient est un ingrédient en vrac ont enlève la possibilité de choisir pièce dans l'outils de séléction 
 changeIng(ingredient: MatOptionSelectionChange<string>, i: number) {
   /*  let ing = this.ingredients.find((_ingredient) => _ingredient.name === ingredient.source.value);
    if (ing !== undefined) {
      if (ing.vrac === "oui") {
        this.curr_ingredients_vrac.push(i);
      }
    } */
  } 
  addInputIng() {
    let _curr_ings_length = this.getBaseIng().length;
    let name = "";
    let quantity = 0;
    let unity = "";
    if (this.data.menu !== null) {
      if (this.data.menu.ingredients !== null) {
        if (this.data.menu.ingredients[_curr_ings_length] !== undefined) {
          let _curr_ing = this.data.menu.ingredients[_curr_ings_length];
          name = _curr_ing.name;
          if((_curr_ing.quantity !== null) && (_curr_ing.unity !== null)){
            quantity = _curr_ing.quantity;
            unity = _curr_ing.unity;
          }
        }
      }
    }
    const new_ing = this.formBuilder.group({
      name: new FormControl(name, Validators.required),
      quantity: new FormControl(quantity),
      unity: new FormControl(unity)
    });
    this.getBaseIng().push(new_ing);
  }

  addInputConso() {
    let _curr_conso_length = this.getBaseConso().length;
    let name = "";
    let quantity = 0;
    let unity = "";
    if (this.data.menu !== null) {
      if (this.data.menu.consommables !== null) {
        if (this.data.menu.consommables[_curr_conso_length] !== undefined) {
          let _curr_conso = this.data.menu.consommables[_curr_conso_length];
          name = _curr_conso.name;
          if(_curr_conso.quantity !== null) quantity = _curr_conso.quantity;
          if(_curr_conso.unity !== null)  unity = _curr_conso.unity;
        }
      }
    }
    const new_conso = this.formBuilder.group({
      name: new FormControl(name, Validators.required),
      quantity: new FormControl(quantity),
      unity: new FormControl(unity)
    });
    new_conso.controls.unity.disable();
    this.getBaseConso().push(new_conso);
  }

  addInputPlat() {
    let curr_plat_length = this.getBasePlat().length;
    let name = ""; if (this.data.menu !== null) {
      if (this.data.menu.plats !== null) {
        if (this.data.menu.plats[curr_plat_length] !== undefined) {
          name = this.data.menu.plats[curr_plat_length].name;
        }
      }
    }
    const new_plat = this.formBuilder.group({
      name: new FormControl(name, Validators.required),
    });
    this.getBasePlat().push(new_plat);
  }

  suppInputIng(index: number) {
    this.getBaseIng().removeAt(index);
  }

  suppInputConso(index: number) {
    this.getBaseConso().removeAt(index);
  }

  suppInputPlat(index: number) {
    this.getBasePlat().removeAt(index);
  }

  getBaseIng() {
    return this.add_menu_section.get("base_ing") as FormArray<FormGroup<{
      name: FormControl<string | null>,
      quantity: FormControl<number | null>,
      unity: FormControl<string | null>
    }>>
  }

  getBaseConso() {
    return this.add_menu_section.get("base_conso") as FormArray<FormGroup<{
      name: FormControl<string | null>,
      quantity: FormControl<number | null>,
      unity: FormControl<string | null>
    }>>
  }

  getBasePlat() {
    return this.add_menu_section.get("base_plat") as FormArray<FormGroup<{
      name: FormControl<string | null>
    }>>
  }
  closePopup($event: MouseEvent) {
    this.dialogRef.close();
  }
}