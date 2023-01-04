import { AfterContentInit, AfterViewInit, Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalculService } from 'src/app/services/menus/menu.calcul/menu.calcul.ingredients/calcul.service';
import { CIngredient } from 'src/app/interfaces/ingredient';
import { IngredientsInteractionService } from 'src/app/services/menus/ingredients-interaction.service';

@Component({
  selector: 'app-add.ing',
  templateUrl: './add.ing.component.html',
  styleUrls: ['./add.ing.component.css']
})
export class AddIngComponent implements OnInit, AfterContentInit, AfterViewInit {

  public is_prepa: boolean;
  public index_inputs: Array<number>
  public add_ing_section = new FormGroup({
    name: new FormControl('', Validators.required),
    name_tva: new FormControl(''),
    taux_tva: new FormControl(0),
    quantity: new FormControl(0, Validators.required),
    quantity_unitary: new FormControl(0, Validators.required),
    unity: new FormControl('', Validators.required),
    unitary_cost: new FormControl(0, Validators.required),
    dlc: new FormControl(0, Validators.required),
    names_base_ing: new FormArray([
      new FormControl("")
    ]),
    quantity_bef_prep: new FormArray([
      new FormControl(0)
    ]),
    quantity_after_prep: new FormControl(0, Validators.required)
  })
  @ViewChild('taux')
  taux!: ElementRef;

  @ViewChildren('ing_names_prep')
  names_prep!: QueryList<ElementRef>;

  @ViewChildren('quantity_bef_prep')
  quantity_bef_prep!: QueryList<ElementRef>;

  private current_inputs: number;
  private readonly _mat_dialog_ref: MatDialogRef<AddIngComponent>;

  constructor(public dialogRef: MatDialogRef<AddIngComponent>,
    public calcul_service: CalculService, @Inject(MAT_DIALOG_DATA) public data: {
      restaurant: string,
      prop: string,
      ingredient: {
        nom: string,
        categorie: string
        quantity: number,
        quantity_unity: number,
        unity: string,
        unitary_cost: number,
        dlc: number,
        base_ing: Array<{ name: string, quantity: number }>
      }
    }, private service: IngredientsInteractionService) {
    this._mat_dialog_ref = dialogRef;
    this.is_prepa = false;
    this.current_inputs = 1;
    this.index_inputs = [this.current_inputs];
  }



  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
  }

  ngAfterContentInit(): void {
    const unity = this.calcul_service.convertUnity(this.data.ingredient.unity, true);
    this.add_ing_section.get("name")?.setValue(this.data.ingredient.nom);
    this.add_ing_section.get("name_tva")?.setValue(this.data.ingredient.categorie);
    this.add_ing_section.get("quantity")?.setValue(this.data.ingredient.quantity);
    this.add_ing_section.get("quantity_unitary")?.setValue(this.data.ingredient.quantity_unity);
    this.add_ing_section.get("unity")?.setValue(unity);
    this.add_ing_section.get("unitary_cost")?.setValue(this.data.ingredient.unitary_cost);
    this.add_ing_section.get("dlc")?.setValue(this.data.ingredient.dlc);
    console.log("nom des ingrédients préparés : ", this.names_prep);
    console.log("nom des ingrédients quantitées : ", this.quantity_bef_prep);

  }

  addIngredient() {
    
    let new_ing = new CIngredient(this.calcul_service, this.service);
    let is_prep = false;
    new_ing.date_reception = new Date();
    new_ing.dlc = new Date();


    const name = this.add_ing_section.value["name"]?.split(' ').join('_');
    const unity = this.add_ing_section.value["unity"]?.split(' ')[0]
    /* On crée un ingrédient à ârtir des données récupéré depuis le formulaire puis on l'ajoute à la bdd */
    if (name !== undefined) {
      new_ing.setNom(name);
    }
    if ((this.add_ing_section.value["quantity_bef_prep"] !== undefined) && (this.quantity_bef_prep.length > 0)) {
      is_prep = true;
      const total_quantity = this.quantity_bef_prep
        .map((prep_dom) => prep_dom.nativeElement.value)
        .reduce(((quantity, next_quantity) => Number(quantity) + Number(next_quantity)));
      new_ing.setQuantityBefPrep(total_quantity as number);
    }

    if ((this.add_ing_section.value !== undefined) && (this.names_prep.length > 0)) {
      let base_ing: Array<{ name: string, quantity: number }> = [];
      const lst_quantity_bas_ing = this.quantity_bef_prep.map((prep_dom) => prep_dom.nativeElement.value)
        .map((prep_dom) => prep_dom.nativeElement.value)
      // fonctionne uniquement si es liste on même taille TO DO (Ajouter la validation) 
      const lst_name_bas_ing = this.names_prep.map((names_dom) => names_dom.nativeElement.value);
      if (lst_quantity_bas_ing.length === lst_name_bas_ing.length) {
        lst_quantity_bas_ing.forEach((index: number) => {
          base_ing.push({
            name: lst_name_bas_ing[index],
            quantity: lst_quantity_bas_ing[index]
          })
        })
        new_ing.setBaseIng(base_ing)
      }
    }
    if ((this.add_ing_section.value["quantity_after_prep"] !== undefined)) {
      new_ing.setQuantityAfterPrep(this.add_ing_section.value["quantity_after_prep"]);
    }
    if (this.add_ing_section.value["name_tva"] !== undefined) {
      new_ing.setCategorieTva(this.add_ing_section.value["name_tva"]);
    }
    if (this.add_ing_section.value["taux_tva"] !== undefined) {
      new_ing.setTauxTva(Number(this.taux.nativeElement.value));
    }

    if (this.add_ing_section.value["quantity"] !== undefined) {
      new_ing.setQuantity(this.add_ing_section.value["quantity"]);
    }

    if (this.add_ing_section.value["quantity_unitary"] !== undefined) {
      new_ing.setQuantityUniy(this.add_ing_section.value["quantity_unitary"]);
    }

    if (unity !== undefined) {
      new_ing.setUnity(unity);
    }

    if (this.add_ing_section.value["unitary_cost"] !== undefined) {
      new_ing.setCost(this.add_ing_section.value["unitary_cost"]);
    }
    if ((this.add_ing_section.value["dlc"] !== undefined) && (this.add_ing_section.value["dlc"] !== null)) {

      new_ing.getDlc().setHours(new_ing.dlc.getHours() + 24 * this.add_ing_section.value["dlc"]);
    }

    console.log(this.data.prop);
    console.log(this.data.restaurant);


    this.service.setIngInBdd(new_ing, this.data.prop, this.data.restaurant, is_prep)
    console.log(new_ing);

  }

  clickRadio(state: boolean) {
    this.is_prepa = state
    if(this.is_prepa){
      this.names_prep.changes.subscribe((notif) => {
        if((this.current_inputs <= this.data.ingredient.base_ing.length)) {
          let currentElement = this.names_prep.get(this.current_inputs - 1);
          console.log(currentElement);     
          if(currentElement !== undefined){
            currentElement.nativeElement.value =  this.data.ingredient.base_ing[this.current_inputs - 1].name;
          }
        }
      })
  
      this.quantity_bef_prep.changes.subscribe((notif) => {
        if (this.current_inputs <= this.data.ingredient.base_ing.length) {
          let currentElement = this.quantity_bef_prep.get(this.current_inputs - 1);
          if(currentElement !== undefined){
            currentElement.nativeElement.value = this.data.ingredient.base_ing[this.current_inputs - 1].quantity;
          }
        }
      })
    }
  }

  addInput(): void {
    this.current_inputs = this.current_inputs + 1;
    this.index_inputs.push(this.current_inputs);

/*     //on notifie la liste des element ref des ingrédient de base que l'on vient d'ajouter un input
    this.names_prep.notifyOnChanges();
    this.quantity_bef_prep.notifyOnChanges();  */
  }

  addTaux(event: Object): void {
    const taux = this.calcul_service.getTauxFromCat(event["value" as keyof typeof event].toString());
    this.taux.nativeElement.value = taux;

  }
}
