import { AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalculService } from 'src/app/services/menus/menu.calcul/menu.calcul.ingredients/calcul.service';
import { CIngredient } from 'src/app/interfaces/ingredient';
import { IngredientsInteractionService } from 'src/app/services/menus/ingredients-interaction.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TitleStrategy } from '@angular/router';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-add.ing',
  templateUrl: './add.ing.component.html',
  styleUrls: ['./add.ing.component.css']
})
export class AddIngComponent implements OnInit, AfterContentInit, AfterViewChecked, AfterViewInit {

  public is_prep: boolean;
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
    unity_base: new FormArray([
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

  @ViewChildren('unity_base')
  unity_base!: QueryList<ElementRef>;

  private current_inputs: number;
  private base_ing_full: Array<CIngredient>;
  private readonly _mat_dialog_ref: MatDialogRef<AddIngComponent>;
  private is_modif: boolean;

  constructor(public dialogRef: MatDialogRef<AddIngComponent>,
    public calcul_service: CalculService, @Inject(MAT_DIALOG_DATA) public data: {
      restaurant: string,
      prop: string,
      is_modif: boolean,
      ingredient: {
        cuisinee: string,
        nom: string,
        categorie: string
        quantity: number,
        quantity_unity: number,
        unity: string,
        unitary_cost: number,
        dlc: number,
        date_reception: string,
        base_ing: Array<{ name: string, quantity: number, quantity_unity:number ,unity:string, cost:number}>,
        not_prep: Array<CIngredient>,
        quantity_after_prep: number
      }
    }, private service: IngredientsInteractionService, private changeDetector: ChangeDetectorRef, private _snackBar: MatSnackBar) {
    this.base_ing_full = this.data.ingredient.not_prep.filter((ing) => this.data.ingredient.base_ing.map((ing) => ing.name).includes(ing.nom));
    this.calcul_service.sortTwoListStringByName(this.base_ing_full, this.data.ingredient.base_ing);
    this._mat_dialog_ref = dialogRef;
    this.is_prep = false;
    this.current_inputs = 1;
    this.index_inputs = [this.current_inputs];
    this.is_modif = this.data.is_modif;
  }


  ngOnInit(): void {
  }


  ngAfterContentInit(): void {
    //après initialisatin du contenu ont ajoute les éléments dans le formulaire
    const unity = this.calcul_service.convertUnity(this.data.ingredient.unity, true);
    this.add_ing_section.get("name")?.setValue(this.data.ingredient.nom);
    this.add_ing_section.get("name_tva")?.setValue(this.data.ingredient.categorie);
    this.add_ing_section.get("quantity")?.setValue(this.data.ingredient.quantity);
    this.add_ing_section.get("quantity_unitary")?.setValue(this.data.ingredient.quantity_unity);
    this.add_ing_section.get("unity")?.setValue(unity);
    // on calcul le cout unitaire en fonction des ingrédient de base pour un ingrédient préparé
    // le calcul est pas long mais plus tard ajouter une condition pour ne pas recalculer se qui a été entré dans la bdd 
    if(this.data.ingredient.cuisinee === 'oui'){
      this.data.ingredient.unitary_cost = this.calcul_service.calcCostIngPrep(this.data.ingredient.base_ing) 
    }
    this.add_ing_section.get("unitary_cost")?.setValue(this.data.ingredient.unitary_cost); 
    // Si on récupère une date de limite de consommatin négative on dépose 0 sinon on dépose la dlc
    if(this.data.ingredient.dlc > 0){
      this.add_ing_section.get("dlc")?.setValue(this.data.ingredient.dlc);
    }
    else{
      this.add_ing_section.get("dlc")?.setValue(0);
    }
    // dans le cas d'une préparation on empêche l'utilisateur de modifier la champs correspondnt au coût
    if(this.data.ingredient.cuisinee === 'oui'){
      this.add_ing_section.get("unitary_cost")?.disable();
    }
  }

  ngAfterViewInit(): void {
    // après initialisation de la vue on ajoute la tva selon la catégorie
    this.taux.nativeElement.value = this.calcul_service.getTauxFromCat(this.data.ingredient.categorie) 

    if(this.is_modif && this.data.ingredient.cuisinee === "oui"){
      this.clickRadio(true);
    }
  }

  ngAfterViewChecked(): void {
    // on fait ceci car dans le cycle de vie de angular 
    this.changeDetector.detectChanges();
  }


  changeIngredient(is_prep:boolean) {
    let new_ing_aft_prepa = null;
    let new_ing = new CIngredient(this.calcul_service, this.service);
    // on construit la date limite de consomation à partir de la date de récéption.
    if(this.is_modif){
      const date_reception_date = this.calcul_service.stringToDate(this.data.ingredient.date_reception); 
      const dlc = this.calcul_service.stringToDate(this.data.ingredient.date_reception); 
      new_ing.date_reception =  date_reception_date 
      new_ing.dlc = dlc;
    }
    else{
      new_ing.date_reception = new Date();
      new_ing.dlc = new Date();
    }

    //on modifie le nom est l'unitée avant envoie dans le base de donnée 
    const name = this.add_ing_section.value["name"]?.split(' ').join('_');
    const unity = this.add_ing_section.value["unity"]?.split(' ')[0];
    
    /* On crée un ingrédient à partir des données récupéré depuis le formulaire puis on l'ajoute à la bdd */
    if (name !== undefined) {
      new_ing.setNom(name);
    }

    if ((this.add_ing_section.value["quantity_bef_prep"] !== undefined) && (this.quantity_bef_prep.length > 0)) {
      const total_quantity = this.quantity_bef_prep
        .map((prep_dom) => prep_dom.nativeElement.value)
        .reduce(((quantity, next_quantity) => Number(quantity) + Number(next_quantity)));
      new_ing.setQuantityBefPrep(total_quantity as number);
    }

    if ((this.add_ing_section.value !== undefined) && (this.names_prep.length > 0)) {
      let base_ing: Array<{name: string, quantity: number, quantity_unity:number ,unity:string, cost:number}> = [];
      const lst_quantity_bas_ing = this.quantity_bef_prep
                                   .map((prep_dom) => prep_dom.nativeElement.value)
      if(this.add_ing_section.value.quantity !== null && this.add_ing_section.value.quantity_unitary !== null){
        if(this.add_ing_section.value.quantity !== undefined && this.add_ing_section.value.quantity_unitary !== undefined){
          const sum_quantity = lst_quantity_bas_ing.reduce((quantity:string, next_quantity:string) => Number(quantity) + Number(next_quantity));
          const quantity_total = this.add_ing_section.value.quantity*this.add_ing_section.value.quantity_unitary;
          // on regarde si la  quantitée pour l'ingrédient préparé est supérieur à la somme des quantitée pour les ingrédient de base 
          // si c'est le cas alors on lève une erreur. 
          if(sum_quantity < quantity_total){
            this.add_ing_section.controls.quantity.setErrors({
              impossibleSize: true
            })
          }
        }
      }
      // fonctionne uniquement si es liste on même taille TO DO (Ajouter la validation) 
      const lst_name_bas_ing = this.names_prep.map((names_dom) => names_dom.nativeElement.value);
      if (lst_quantity_bas_ing.length === lst_name_bas_ing.length) {

        lst_quantity_bas_ing.forEach((quantity: any,index: number) => {
          const name = lst_name_bas_ing[index].split(' ').join('_')
          const _base_ing = this.data.ingredient.not_prep.filter((ing) => (ing.nom === name))[0];

          base_ing.push({
            name: name,
            quantity: quantity,
            unity: _base_ing.unity,
            cost: _base_ing.cost,
            quantity_unity: _base_ing.quantity_unity
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
      new_ing.dlc.setHours( new_ing.dlc.getHours() + 24*this.add_ing_section.value["dlc"])
      new_ing.setDlc(new_ing.dlc)
    }
    else{
      new_ing.setDlc(this.calcul_service.stringToDate(this.data.ingredient.date_reception))
    }
    
    if(this.is_prep){
      new_ing_aft_prepa = this.calcul_service.removeQuantityAftPrepa(this.base_ing_full, this.data.ingredient.base_ing, this.data.ingredient.quantity_after_prep);
    } 

    if(this.add_ing_section.valid){
      
      this.service.setIngInBdd(new_ing, this.data.prop, this.data.restaurant, is_prep, new_ing_aft_prepa).then(() => {
        if(this.is_modif){
          this._snackBar.open("l'ingrédient vient d'être modifié dans la base de donnée du restaurant", "fermer")
        }
        else{
          this._snackBar.open("l'ingrédient vient d'être ajouté à la base de donnée du restaurant", "fermer")
        }
      }).catch((e) => {
        if(this.is_modif){
          this._snackBar.open("nous n'avons pas réussit à modifier l'ingrédient dans la base de donnée", "fermer")
        }
        else{
          this._snackBar.open("nous n'avons pas réussit à envoyer l'ingrédient dans la base de donnée", "fermer")
        }
      })
      this.dialogRef.close()
    }
    else{
      this._snackBar.open("veuillez valider l'ensemble des champs", "fermer")
    }
  }

  clickRadio(state: boolean) {
    this.is_prep = state
    if (this.is_prep) {
        if(this.data.ingredient.cuisinee === 'oui'){
          this.index_inputs = Array(this.data.ingredient.base_ing.length).fill(0).map((value :any, index:number) => index + 1);
          this.current_inputs = this.data.ingredient.base_ing.length;
        }
    
      this.names_prep.changes.subscribe((notif) => {
        for (let index_input = 0; index_input < this.current_inputs; index_input++) {
          let currentElement = this.names_prep.get(index_input);
          if (currentElement !== undefined) {
            currentElement.nativeElement.value = this.data.ingredient.base_ing[index_input].name;
          }
        }
      })

      this.quantity_bef_prep.changes.subscribe((notif) => {
        for (let index_input = 0; index_input < this.current_inputs; index_input++) {
          let currentElement = this.quantity_bef_prep.get(index_input);
          if (currentElement !== undefined) {
            currentElement.nativeElement.value = this.data.ingredient.base_ing[index_input].quantity;
          }
        }
      })
      this.unity_base.changes.subscribe((notif) => {
        for (let index_input = 0; index_input < this.current_inputs; index_input++) {
          let currentElement = this.unity_base.get(index_input);
          if (currentElement !== undefined) {
            const base_ing = this.base_ing_full.map((ing) => ing.nom);
            if(base_ing.includes(this.base_ing_full[index_input].nom)){
              currentElement.nativeElement.value = this.calcul_service.convertUnity(this.base_ing_full[index_input].unity, true);
            }
            else{
              currentElement.nativeElement.value = "entrer l'ingrédient dans la base de donnée";
            }
          }
        }
      })
      this.add_ing_section.get("quantity_after_prep")?.setValue(this.data.ingredient.quantity_after_prep);
    
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
