import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CIngredient } from '../../../../../../app/interfaces/ingredient';
import { IngredientsInteractionService } from '../../../../../../app/services/menus/ingredients-interaction.service';
import { CalculService } from '../../../../../../app/services/menus/menu.calcul/menu.calcul.ingredients/calcul.service';

@Component({
  selector: 'app-modif.ing',
  templateUrl: './modif.ing.component.html',
  styleUrls: ['./modif.ing.component.css']
})
export class ModifIngComponent implements OnInit {
  public is_vrac: boolean;
  public index_inputs: Array<number>;
  public add_ing_section = new FormGroup({
    name: new FormControl('', Validators.required),
    name_tva: new FormControl(''),
    taux_tva: new FormControl(0),
    quantity: new FormControl(0, Validators.required),
    quantity_unitary: new FormControl(0, Validators.required),
    unity: new FormControl('', Validators.required),
    unitary_cost: new FormControl(0, Validators.required),
    marge: new FormControl(0, Validators.required),
    vrac: new FormControl('', Validators.required),
  })
  @ViewChild('taux')
  taux!: ElementRef;

  private current_inputs: number;
  private readonly _mat_dialog_ref: MatDialogRef<ModifIngComponent>;
  private is_modif: boolean;

  @Output() myEvent = new EventEmitter<CIngredient>();

  constructor(public dialogRef: MatDialogRef<ModifIngComponent>,
    public calcul_service: CalculService, @Inject(MAT_DIALOG_DATA) public data: {
      restaurant: string,
      prop: string,
      is_modif: boolean,
      ingredient: {
        nom: string,
        categorie: string
        quantity: number,
        quantity_unity: number,
        unity: string,
        unitary_cost: number,
        dlc: number,
        date_reception: string,
        marge: number,
        vrac: string
      }
    }, private service: IngredientsInteractionService,
    private changeDetector: ChangeDetectorRef, private _snackBar: MatSnackBar) {
    this._mat_dialog_ref = dialogRef;
   /*  this.is_prep = false; */
    this.current_inputs = 1;
    this.index_inputs = [this.current_inputs];
    this.is_modif = this.data.is_modif;
    this.is_vrac = true;
  }
  ngOnInit(): void {
    if(this.data.ingredient.vrac !== undefined){
      if(this.data.ingredient.vrac === "oui"){
        this.is_vrac = true;
      }
      else{
        this.is_vrac = false;
      }
      // on adapte la quantitée affiché en fonction
      this.clickRadioVrac(this.is_vrac)
    }
  }
  ngAfterContentInit(): void {

    //après initialisatin du contenu ont ajoute les éléments dans le formulaire
    const unity = this.calcul_service.convertUnity(this.data.ingredient.unity, true);
    this.add_ing_section.get("name")?.setValue(this.data.ingredient.nom);
    this.add_ing_section.get("name_tva")?.setValue(this.data.ingredient.categorie);
    this.add_ing_section.get("quantity_unitary")?.setValue(this.data.ingredient.quantity_unity);
    this.add_ing_section.get("unity")?.setValue(unity);
    this.add_ing_section.get("quantity")?.setValue(this.data.ingredient.quantity);
    this.add_ing_section.get("unitary_cost")?.setValue(this.data.ingredient.unitary_cost);

    if ((this.data.ingredient.marge > 0) && (this.data.ingredient.marge !== undefined)) {
      this.add_ing_section.get("marge")?.setValue(this.data.ingredient.marge);
    }
    else {
      this.add_ing_section.get("marge")?.setValue(0);
    }
  }
  ngAfterViewInit(): void {
    // après initialisation de la vue on ajoute la tva selon la catégorie
    this.taux.nativeElement.value = this.calcul_service.getTauxFromCat(this.data.ingredient.categorie)
    if (this.data.ingredient.vrac === 'oui') {
      this.clickRadioVrac(true)
    }
  }
  ngAfterViewChecked(): void {
    // on fait ceci car dans le cycle de vie de angular 
    this.changeDetector.detectChanges();
  }
  clickRadioVrac(state: boolean) {
    this.is_vrac = state
    // dans le cas ou on a clické sur le boutton pour spécifier l'ingrésient en vrac on remet l'input à 0 
    // sinon on met l'input à la valeur de quantitée récupéré dans la base de donnée
    if (state) {
      this.add_ing_section.get("quantity")?.setValue(0);
    }
    else {
      this.add_ing_section.get("quantity")?.setValue(this.data.ingredient.quantity);
    }
  }
  addTaux(event: Object): void {
    const taux = this.calcul_service.getTauxFromCat(event["value" as keyof typeof event].toString());
    this.taux.nativeElement.value = taux;

  }
  changeIngredient() {
    let ingredient = new CIngredient(this.calcul_service, this.service);
    if(this.add_ing_section.controls.name.value !== null){
      const name =  this.add_ing_section.controls.name.value.trim()
      ingredient.nom = name.split(" ").join("_");
    }
    if(this.add_ing_section.controls.name_tva.value !== null){
      ingredient.categorie_tva = this.add_ing_section.controls.name_tva.value;
    }
    if(this.add_ing_section.controls.taux_tva.value !== null){
      ingredient.taux_tva = this.add_ing_section.controls.taux_tva.value;
    }
    if(this.add_ing_section.controls.quantity.value !== null){
      ingredient.quantity = this.add_ing_section.controls.quantity.value;
    }
    if(this.add_ing_section.controls.quantity.value !== null){
      ingredient.total_quantity = this.add_ing_section.controls.quantity.value;
    }
    if(this.add_ing_section.controls.quantity_unitary.value !== null){
      ingredient.quantity_unity = this.add_ing_section.controls.quantity_unitary.value;
    }
    if(this.add_ing_section.controls.unity.value !== null){
      ingredient.unity_unitary = this.add_ing_section.controls.unity.value;
    }
    if(this.add_ing_section.controls.unitary_cost.value !== null){
      ingredient.cost = this.add_ing_section.controls.unitary_cost.value
      ingredient.cost_ttc = 0;
    }
    if(this.add_ing_section.controls.marge.value !== null){
      ingredient.marge = this.add_ing_section.controls.marge.value;
    }
    if(this.add_ing_section.controls.vrac.value !== null){
      ingredient.vrac = this.add_ing_section.controls.vrac.value;
    }
    this.myEvent.emit(ingredient);
    this.dialogRef.close();
  }
}
