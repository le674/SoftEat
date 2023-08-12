import { AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalculService } from '../../../../../../../app/services/menus/menu.calcul/menu.calcul.ingredients/calcul.service';
import { CIngredient } from '../../../../../../../app/interfaces/ingredient';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertesService } from '../../../../../../../app/services/alertes/alertes.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-add.ing',
  templateUrl: './add.ing.component.html',
  styleUrls: ['./add.ing.component.css']
})
export class AddIngComponent implements OnInit, AfterContentInit, AfterViewChecked, AfterViewInit {
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
    dlc: new FormControl(0, Validators.required),
    marge: new FormControl(0, Validators.required),
    vrac: new FormControl('non', Validators.required),
  })
  @ViewChild('taux')
  taux!: ElementRef;

  private current_inputs: number;
  private readonly _mat_dialog_ref: MatDialogRef<AddIngComponent>;
  private is_modif: boolean;

  constructor(public dialogRef: MatDialogRef<AddIngComponent>,
    public calcul_service: CalculService, @Inject(MAT_DIALOG_DATA) public data: {
      restaurant: string,
      prop: string,
      is_modif: boolean,
      ingredient: {
        id:string,
        name: string,
        categorie_restaurant:string | null,
        categorie_tva: string,
        taux_tva: number,
        cost: number,
        categorie: string
        quantity: number,
        quantity_unity: number,
        total_quantity: number, 
        unity: string,
        unitary_cost: number,
        date_reception: string,
        dlc: number,
        cost_ttc: number | null,
        marge: number, 
        vrac: string,
        base_ingredient_id:Array<string> | null,
        base_ing: Array<string> | null,
        not_prep: Array<CIngredient>
      }
    }, private service: FirebaseService, private changeDetector: ChangeDetectorRef,
    private _snackBar: MatSnackBar, private service_alertes: AlertesService) {
    this._mat_dialog_ref = dialogRef;
    /*  this.is_prep = false; */
    this.current_inputs = 1;
    this.index_inputs = [this.current_inputs];
    this.is_modif = this.data.is_modif;
    this.is_vrac = true;
  }
  ngOnInit(): void {
    if (this.data.ingredient.vrac !== undefined) {
      if (this.data.ingredient.vrac === "oui") {
        this.is_vrac = true;
      }
      else {
        this.is_vrac = false;
      }
      // on adapte la quantitée affiché en fonction
      this.clickRadioVrac(this.is_vrac)
    }
  }
  ngAfterContentInit(): void {
    //après initialisatin du contenu ont ajoute les éléments dans le formulaire
    const unity = this.calcul_service.convertUnity(this.data.ingredient.unity, true);
    this.add_ing_section.get("name")?.setValue(this.data.ingredient.name);
    this.add_ing_section.get("name_tva")?.setValue(this.data.ingredient.categorie_tva);
    this.add_ing_section.get("quantity_unitary")?.setValue(this.data.ingredient.quantity_unity);
    this.add_ing_section.get("unity")?.setValue(unity);
    this.add_ing_section.get("quantity")?.setValue(this.data.ingredient.quantity);
    this.add_ing_section.get("unitary_cost")?.setValue(this.data.ingredient.unitary_cost);
    // Si on récupère une date de limite de consommatin négative on dépose 0 sinon on dépose la dlc
    if (this.data.ingredient.dlc > 0) {
      this.add_ing_section.get("dlc")?.setValue(this.data.ingredient.dlc);
    }

    if ((this.data.ingredient.marge > 0) && (this.data.ingredient.marge !== undefined)) {
      this.add_ing_section.get("marge")?.setValue(this.data.ingredient.marge);
    }
    else {
      this.add_ing_section.get("marge")?.setValue(0);
    }
  }
  ngAfterViewInit(): void {
    // après initialisation de la vue on ajoute la tva selon la catégorie
    this.taux.nativeElement.value = this.calcul_service.getTauxFromCat(this.data.ingredient.categorie_tva)
    if (this.data.ingredient.vrac === 'oui') {
      this.clickRadioVrac(true)
    }
  }
  ngAfterViewChecked(): void {
    // on fait ceci car dans le cycle de vie de angular 
    this.changeDetector.detectChanges();
  }
  changeIngredient() {
    let new_ing_aft_prepa = null;
    let new_ing: CIngredient;
    new_ing = new CIngredient(this.calcul_service);
    let act_quant = 0;
    new_ing.proprietary_id = this.data.prop;
    if(this.data.ingredient.base_ingredient_id !== undefined){
      new_ing.base_ingredient_id = this.data.ingredient.base_ingredient_id;
    }
    if(this.data.ingredient.categorie_restaurant !== undefined){
      new_ing.categorie_restaurant = this.data.ingredient.categorie_restaurant;
    }
    if(this.data.ingredient.categorie_tva !== undefined){
      new_ing.categorie_tva = this.data.ingredient.categorie_tva;
    }
    if(this.data.ingredient.total_quantity !== undefined){
      new_ing.total_quantity = this.data.ingredient.total_quantity;
    }
    if((this.data.ingredient.id !== null) && (this.data.ingredient.id !== undefined)){
      new_ing.id = this.data.ingredient.id;
    }
    else{
      this._snackBar.open("id manquant pas de modification de l'ingrédient contacter softeat", "fermer");
      throw "Id missing error";
    }
    // on construit la date limite de consomation à partir de la date de récéption.
    if (this.is_modif) {
      let dlc = this.calcul_service.stringToDate(this.data.ingredient.date_reception);
      let date_reception_date = this.calcul_service.stringToDate(this.data.ingredient.date_reception);
      if(dlc !== null && date_reception_date !== null){
        dlc.setDate(dlc.getDate() + this.data.ingredient.dlc);
        new_ing.date_reception = date_reception_date
      }
      new_ing.dlc = dlc;
    }
    else {
      new_ing.date_reception = new Date();
      new_ing.dlc = new Date();
    }

    //on modifie le nom est l'unitée avant envoie dans le base de donnée 
    const name = this.add_ing_section.value["name"];
    const unity = this.add_ing_section.value["unity"]?.split(' ')[0];

    /* On crée un ingrédient à partir des données récupéré depuis le formulaire puis on l'ajoute à la bdd */
    if (name !== undefined && name !== null) {
      new_ing.name = name;
    }

    if ((this.add_ing_section.value["name_tva"] !== undefined) && (this.add_ing_section.value["name_tva"] !== null)) {
      new_ing.categorie_tva = this.add_ing_section.value["name_tva"];
    }

    if (this.add_ing_section.value["marge"] !== undefined) {
      new_ing.marge = Number(this.add_ing_section.value["marge"]);
    }

    if ((this.add_ing_section.value["quantity"] !== undefined) && (this.add_ing_section.value["quantity"] !== null)) {
      new_ing.quantity = this.add_ing_section.value["quantity"];
      if (this.data.ingredient.quantity !== undefined) {
        new_ing.total_quantity = this.data.ingredient.quantity;
        if ((this.data.ingredient.quantity < this.add_ing_section.value["quantity"]) || (!this.data.is_modif)) {
          new_ing.total_quantity = this.add_ing_section.value["quantity"];
        }
      }
    }

    if ((this.add_ing_section.value["quantity_unitary"] !== undefined) && (this.add_ing_section.value["quantity_unitary"] !== null)) {
      new_ing.quantity_unity = this.add_ing_section.value["quantity_unitary"];
    }

    if ((this.add_ing_section.value["unitary_cost"] !== undefined) && (this.add_ing_section.value["unitary_cost"] !== null)) {
      new_ing.cost = this.add_ing_section.value["unitary_cost"];
    }

    if ((this.add_ing_section.value["taux_tva"] !== undefined) && (this.add_ing_section.value["taux_tva"] !== null)) {
      new_ing.taux_tva = Number(this.taux.nativeElement.value);
    }

    if ((this.add_ing_section.value["vrac"] !== undefined) && (this.add_ing_section.value["vrac"] !== null)) {
      new_ing.vrac = this.add_ing_section.value["vrac"]
      // dans la partie stock si le restaurateur choisit de faire du vrac en pièce exemple : quantitée unitaire 6 tomates -> unitée p -> 9€
      // alors il vaut mieux remplir : quantitée unitaire de 1 -> unitée p -> cost 1.50 -> quantitée 6  
      if ((unity === "p") && (new_ing.vrac === "oui")) {
        new_ing.vrac = "non";
        new_ing.quantity = new_ing.quantity_unity;
        new_ing.quantity_unity = 1;
        new_ing.cost = new_ing.cost / new_ing.quantity;
      }
    }

    if (unity !== undefined) {
      new_ing.unity = unity;
    }

    if ((this.add_ing_section.value["dlc"] !== undefined) && (this.add_ing_section.value["dlc"] !== null)) {
      if(new_ing.dlc !== null){
        new_ing.dlc.setDate(new_ing.dlc.getDate() + this.add_ing_section.value["dlc"])
      }
      new_ing.dlc = new_ing.dlc;
    }
    else {
      new_ing.dlc = this.calcul_service.stringToDate(this.data.ingredient.date_reception);
    }
    if (new_ing.vrac === 'oui') {
      if (new_ing.marge !== null) {
        if (new_ing.quantity_unity < new_ing.marge) {
          // alors on affiche une alerte
          const nom = (new_ing.name === null) ? "" : new_ing.name;
          const msg = "l'ingredient : ".concat(nom).concat(" arrive en rupture de stock.");
          this.service_alertes.setAlertes(msg, this.data.restaurant, this.data.prop, "SoftEat", "", "stock");
        }
      }
    }
    else {
      if (new_ing.marge !== null) {
        if (new_ing.quantity < new_ing.marge) {
          //alors on affiche une alerte 
          const nom = (new_ing.name === null) ? "" : new_ing.name;
          const msg = "l'ingredient ".concat(nom).concat(" arrive en rupture de stock.");
          this.service_alertes.setAlertes(msg, this.data.restaurant, this.data.prop, "softeat", "", "stock");
        }
      }
    }
    if (this.add_ing_section.valid) {
      let path = CIngredient.getPathsToFirestore(this.data.prop, this.data.restaurant);
      if (this.is_modif) {
        this.service.updateFirestoreData(new_ing.id,new_ing as CIngredient, path, CIngredient).then(() => {
          this._snackBar.open("l'ingrédient vient d'être modifié dans la base de donnée du restaurant", "fermer");
        }).catch((e) => {
            this._snackBar.open("nous n'avons pas réussit à modifier l'ingrédient dans la base de donnée", "fermer");
            let error = new Error(e)
            return throwError(() => error).subscribe((error) => {
              console.log(error);
            });
        })
        this.dialogRef.close()
      }
      else {
        this.service.setFirestoreData(new_ing as CIngredient, path, CIngredient).then(() => {
          this._snackBar.open("l'ingrédient vient d'être ajouté dans la base de donnée du restaurant", "fermer");
        }).catch((e) => {
          this._snackBar.open("nous n'avons pas réussit à ajouter l'ingrédient dans la base de donnée", "fermer");
          let error = new Error(e)
          return throwError(() => error).subscribe((error) => {
            console.log(error);
          });
      })
      }
    }
    else{
      this._snackBar.open("veuillez valider l'ensemble des champs", "fermer");
    }
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
  closePopup(click: MouseEvent) {
    this._mat_dialog_ref.close();
  }
}
