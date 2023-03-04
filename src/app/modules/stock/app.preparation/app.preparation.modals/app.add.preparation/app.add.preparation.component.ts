import { AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CIngredient, TIngredientBase } from 'src/app/interfaces/ingredient';
import { Cpreparation } from 'src/app/interfaces/preparation';
import { AddPreparationsComponent } from 'src/app/modules/recettes/app.preparations/add.preparations/add.preparations.component';
import { AlertesService } from 'src/app/services/alertes/alertes.service';
import { IngredientsInteractionService } from 'src/app/services/menus/ingredients-interaction.service';
import { CalculService } from 'src/app/services/menus/menu.calcul/menu.calcul.ingredients/calcul.service';

@Component({
  selector: 'app-app.add.preparation',
  templateUrl: './app.add.preparation.component.html',
  styleUrls: ['./app.add.preparation.component.css']
})
export class AppAddPreparationComponent implements OnInit, AfterContentInit {

  /* public is_prep: boolean; */
  public is_vrac: boolean;
  public index_inputs: Array<number>;
  public add_preparation = new FormGroup({
    name: new FormControl('', Validators.required),
    quantity: new FormControl(0, Validators.required),
    quantity_unitary: new FormControl(0, Validators.required),
    unity: new FormControl('', Validators.required),
    dlc: new FormControl(0, Validators.required),
    marge: new FormControl(0, Validators.required),
    vrac: new FormControl('', Validators.required),
    preparations: new FormArray<FormGroup<{
      name: FormControl<string | null>,
      quantity: FormControl<number | null>,
      unity: FormControl<string | null>
    }>>([]),
    quantity_after_prep: new FormControl(0, Validators.required)
  })

  private base_ings_prepa: Array<CIngredient>;
  private current_inputs: number;
  /*   private base_ing_full: Array<CIngredient>; */
  private readonly _mat_dialog_ref: MatDialogRef<AddPreparationsComponent>;
  private is_modif: boolean;


  constructor(public dialogRef: MatDialogRef<AddPreparationsComponent>, private changeDetector: ChangeDetectorRef,
    private _snackBar: MatSnackBar, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: {
      restaurant: string,
      prop: string,
      is_modif: boolean,
      preparation: {
        nom: string,
        quantity: number,
        quantity_unity: number,
        unity: string,
        unitary_cost: number,
        dlc: number,
        date_reception: string,
        base_ing: Array<TIngredientBase>,
        not_prep: Array<CIngredient>,
        quantity_after_prep: number,
        marge: number,
        vrac: string
      }
    }, public calcul_service: CalculService, public service: IngredientsInteractionService, public service_alertes: AlertesService) {
    this.current_inputs = 0;
    this.is_vrac = false;
    this.index_inputs = [];
    this.is_modif = false;
    this._mat_dialog_ref = dialogRef;
    this.base_ings_prepa = [];
  }


  ngAfterContentInit(): void {

    const unity = this.calcul_service.convertUnity(this.data.preparation.unity, true);
    this.add_preparation.get("name")?.setValue(this.data.preparation.nom);
    this.add_preparation.get("quantity_unitary")?.setValue(this.data.preparation.quantity_unity);
    this.add_preparation.get("unity")?.setValue(unity);
    this.add_preparation.get("quantity")?.setValue(this.data.preparation.quantity);
    // Si on récupère une date de limite de consommation négative on dépose zéro sinon on dépose la dlc
    if (this.data.preparation.dlc > 0) {
      this.add_preparation.get("dlc")?.setValue(this.data.preparation.dlc);
    }

    if ((this.data.preparation.marge > 0) && (this.data.preparation.marge !== undefined)) {
      this.add_preparation.get("marge")?.setValue(this.data.preparation.marge);
    }
    else {
      this.add_preparation.get("marge")?.setValue(0);
    }


  }

  ngOnInit(): void {
  }


  changePreparation() {
    let new_ing_aft_prepa = null;
    let new_prepa: Cpreparation;
    new_prepa = new Cpreparation(this.calcul_service);
    new_prepa.is_stock = true;
    let act_quant = 0;
    // on construit la date limite de consomation à partir de la date de récéption.
    if (this.is_modif) {

      const date_reception_date = this.calcul_service.stringToDate(this.data.preparation.date_reception);
      const dlc = this.calcul_service.stringToDate(this.data.preparation.date_reception);
      new_prepa.date_reception = date_reception_date
      new_prepa.dlc = dlc;
    }
    else {
      new_prepa.date_reception = new Date();
      new_prepa.dlc = new Date();
    }

    //on modifie le nom est l'unitée avant envoie dans le base de donnée 
    const name = this.add_preparation.value["name"]?.split(' ').join('_');
    const unity = this.add_preparation.value["unity"]?.split(' ')[0];

    /* On crée un ingrédient à partir des données récupéré depuis le formulaire puis on l'ajoute à la bdd */
    if (name !== undefined) {
      new_prepa.setNom(name);
    }


    const quantity_bef = this.add_preparation.controls.preparations.value.map((base_ing) => {
      return { quantity: base_ing.quantity, unity: base_ing.unity }
    }).reduce((ing, next_ing) => {
      let _ing_quantity = 0;
      let _next_ing_quantity = 0;
      let _next_ing_unity = "";
      let _ing_unity = "";
      if ((ing.quantity !== null) && ing.quantity !== undefined) {
        _ing_quantity = ing.quantity;
      }
      if ((ing.unity !== null) && (ing.unity !== undefined)) {
        _ing_unity = ing.unity;
      }
      if ((next_ing.quantity !== null) && (next_ing.quantity !== undefined)) {
        _next_ing_quantity = next_ing.quantity;
      }
      if ((next_ing.unity !== null) && (next_ing.unity !== undefined)) {
        _next_ing_unity = next_ing.unity;
      }
      const number = this.calcul_service.convertQuantity(_ing_quantity, _ing_unity) + this.calcul_service.convertQuantity(_next_ing_quantity, _next_ing_unity);
      return { quantity: number, unity: "" }
    }).quantity;

    if ((quantity_bef !== undefined) && (quantity_bef !== null)) {
      new_prepa.quantity_bef_prep = quantity_bef;
    }
    let prep_base_ing: Array<TIngredientBase> = [];
    this.add_preparation.controls.preparations.value.forEach((base_ing) => {
      const name = base_ing.name?.split(" ").join("_");
      let quantity = base_ing.quantity;
      if ((quantity === null) || (quantity === undefined)) quantity = 0;
      if ((name !== undefined) && (name !== null)) {
        let _base_ings = this.data.preparation.not_prep.filter((ing) => (ing.nom === name));
        this.base_ings_prepa = _base_ings;
        if (_base_ings.length > 0) {
          const _base_ing = _base_ings[0];
          prep_base_ing.push({
            name: name,
            quantity: quantity,
            unity: _base_ing.unity,
            unity_unitary: "",
            cost: _base_ing.cost,
            quantity_unity: _base_ing.quantity_unity,
            material_cost: 0,
            vrac: _base_ing.vrac,
            taux_tva: _base_ing.taux_tva,
            marge: _base_ing.marge
          });
        }
        else {
          prep_base_ing.push({
            name: name,
            quantity: quantity,
            quantity_unity: 0,
            material_cost: 0,
            unity_unitary: "",
            unity: '',
            cost: 0,
            vrac: 'non',
            taux_tva: 0,
            marge: 0
          });
        }
      }
    });
    new_prepa.base_ing = prep_base_ing;

    if(this.data.preparation.vrac === "oui"){
      if ((this.add_preparation.value["quantity_after_prep"] !== undefined) && (this.add_preparation.value["quantity_after_prep"] !== null)) {
        new_prepa.quantity_after_prep = this.add_preparation.value["quantity_after_prep"];
      } 
    }

    if (this.add_preparation.value["marge"] !== undefined) {
      new_prepa.marge = Number(this.add_preparation.value["marge"]);
    }

    if ((this.add_preparation.value["quantity"] !== undefined) && (this.add_preparation.value["quantity"] !== null)) {
      new_prepa.quantity = this.add_preparation.value["quantity"];
      if(this.data.preparation.quantity !== undefined){
        new_prepa.total_quantity = this.data.preparation.quantity;
        if((this.data.preparation.quantity < this.add_preparation.value["quantity"]) || (!this.data.is_modif)){
          new_prepa.total_quantity = this.add_preparation.value["quantity"];
        } 
      }
      new_prepa.total_quantity = this.add_preparation.value["quantity"];
    }

    if ((this.add_preparation.value["quantity_unitary"] !== undefined) && (this.add_preparation.value["quantity_unitary"] !== null)) {
      new_prepa.quantity_unity = this.add_preparation.value["quantity_unitary"];
    }

    if (unity !== undefined) {
      new_prepa.unity = unity;
    }


    if ((this.add_preparation.value["dlc"] !== undefined) && (this.add_preparation.value["dlc"] !== null)) {
      new_prepa.dlc.setHours(new_prepa.dlc.getHours() + 24 * this.add_preparation.value["dlc"])
      new_prepa.dlc = new_prepa.dlc;
    }
    else {
      new_prepa.dlc = this.calcul_service.stringToDate(this.data.preparation.date_reception);
    }


    if ((this.add_preparation.value["quantity"] !== undefined) && (this.add_preparation.value["quantity"] !== null)) {
          new_ing_aft_prepa = this.calcul_service.removeQuantityAftPrepa(this.data.preparation.not_prep,
          this.data.preparation.base_ing, this.data.preparation.quantity, this.add_preparation.value["quantity"], this.is_vrac);
      } 

    if (new_prepa.vrac) {
      if (new_prepa.quantity_unity < new_prepa.marge) {
        // alors on affiche une alerte
        const nom = (new_prepa.nom === null) ? "" : new_prepa.nom;
        const msg = "l'ingredient : ".concat(nom).concat(" arrive en rupture de stock.");
        this.service_alertes.setAlertes(msg, this.data.restaurant, this.data.prop, "SoftEat", "", "stock");
      }
    }
    else {
      if (new_prepa.quantity < new_prepa.marge) {
        //alors on affiche une alerte 
        const nom = (new_prepa.nom === null) ? "" : new_prepa.nom;
        const msg = "l'ingredient ".concat(nom).concat(" arrive en rupture de stock.");
        this.service_alertes.setAlertes(msg, this.data.restaurant, this.data.prop, "softeat", "", "stock");
      }
    }

       new_prepa.base_ing.forEach((_base) => {
         if (_base.vrac === 'oui') {
           if (_base.quantity_unity < _base.marge) {
             // alors on affiche une alerte
             const msg = "l'ingredient : ".concat(_base.name).concat(" arrive en rupture de stock.");
             this.service_alertes.setAlertes(msg, this.data.restaurant, this.data.prop, "softeat", "", "stock");
           }
         }
         else {
           if (_base.quantity < _base.marge) {
             //alors on affiche une alerte 
             const msg = "l'ingredient ".concat(_base.name).concat(" arrive en rupture de stock.");
             this.service_alertes.setAlertes(msg, this.data.restaurant, this.data.prop, "softeat", "", "stock");
           }
         }
       })

    if (this.add_preparation.valid) {
      this.service.setPreparationInBdd(new_prepa as Cpreparation, this.data.prop, this.data.restaurant, this.base_ings_prepa).then(() => {
        if (this.is_modif) {
          this._snackBar.open("l'ingrédient vient d'être modifié dans la base de donnée du restaurant", "fermer");
        }
        else {
          this._snackBar.open("l'ingrédient vient d'être ajouté à la base de donnée du restaurant", "fermer");
        }
      }).catch((e) => {
        if (this.is_modif) {
          this._snackBar.open("nous n'avons pas réussit à modifier l'ingrédient dans la base de donnée", "fermer");
        }
        else {
          this._snackBar.open("nous n'avons pas réussit à envoyer l'ingrédient dans la base de donnée", "fermer");
        }
      })
      this.dialogRef.close()
    }
    else {
      this._snackBar.open("veuillez valider l'ensemble des champs", "fermer");
    }
  }

  addInput() {
    this.current_inputs = this.current_inputs + 1;

    this.index_inputs.push(this.current_inputs);
    let new_ing = this.formBuilder.group({
      name: new FormControl(""),
      quantity: new FormControl(0),
      unity: new FormControl("")
    });

    if (this.data.is_modif) {
      if (this.data.preparation.base_ing[this.current_inputs - 1] !== undefined) {
        const name = this.data.preparation.base_ing[this.current_inputs - 1].name;
        let quantity = this.data.preparation.base_ing[this.current_inputs - 1].quantity_unity * this.data.preparation.base_ing[this.current_inputs - 1].quantity;
        if (this.data.preparation.base_ing[this.current_inputs - 1].vrac === 'oui') {
          quantity = this.data.preparation.base_ing[this.current_inputs - 1].quantity_unity;
        }
        const unity = this.data.preparation.base_ing[this.current_inputs - 1].unity;
        new_ing = this.formBuilder.group({
          name: new FormControl(name),
          quantity: new FormControl(quantity),
          unity: new FormControl(unity)
        });
      }
    }
    new_ing.disable()
    this.getBaseIng().push(new_ing);
  }

  suppInput(){
    this.current_inputs = this.current_inputs - 1;
    this.index_inputs.pop();
    this.getBaseIng().removeAt(this.getBaseIng().length - 1);
  }

  clickRadioVrac(state: boolean) {
    this.is_vrac = state
    // dans le cas ou on a clické sur le boutton pour spécifier l'ingrésient en vrac on remet l'input à 0 
    // sinon on met l'input à la valeur de quantitée récupéré dans la base de donnée
    if (state) {
      this.add_preparation.get("quantity")?.setValue(0);
    }
    else {
      this.add_preparation.get("quantity")?.setValue(this.data.preparation.quantity);
    }

  }

  getBaseIng() {
    return this.add_preparation.get("preparations") as FormArray<FormGroup<{
      name: FormControl<string | null>,
      quantity: FormControl<number | null>,
      unity: FormControl<string | null>
    }>>
  }

}
