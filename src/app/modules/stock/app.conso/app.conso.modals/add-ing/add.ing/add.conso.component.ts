import { AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalculService } from 'src/app/services/menus/menu.calcul/menu.calcul.ingredients/calcul.service';
import { Cconsommable, CIngredient } from 'src/app/interfaces/ingredient';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TitleStrategy } from '@angular/router';
import { ConsommableInteractionService } from 'src/app/services/menus/consommable-interaction.service';
import { AlertesService } from 'src/app/services/alertes/alertes.service';

@Component({
  selector: 'app-add.conso',
  templateUrl: './add.conso.component.html',
  styleUrls: ['./add.conso.component.css']
})
export class AddConsoComponent implements OnInit, AfterContentInit{


  public add_cons_section = new FormGroup({
    name: new FormControl('', Validators.required),
    taux_tva: new FormControl(0),
    quantity: new FormControl(0, Validators.required),
    unity: new FormControl('', Validators.required),
    cost_ttc: new FormControl(0),
    cost: new FormControl(0, Validators.required),
    marge: new FormControl(0, Validators.required)
  })
  @ViewChild('taux')
  taux!: ElementRef;
  private readonly _mat_dialog_ref: MatDialogRef<AddConsoComponent>;
  is_modif: boolean;

  constructor(public dialogRef: MatDialogRef<AddConsoComponent>,
    public calcul_service: CalculService, @Inject(MAT_DIALOG_DATA) public data: {
      restaurant: string,
      prop: string,
      is_modif: boolean,
      consommable: {
        nom: string,
        quantity: number,
        cost: number
        cost_ttc: number,
        taux_tva: number,
        unity: string,
        date_reception: string,
      }
    }, private service: ConsommableInteractionService,
    private _snackBar: MatSnackBar, private service_alertes:AlertesService ) {
    this._mat_dialog_ref = dialogRef;
    this.is_modif = this.data.is_modif;
  }

  ngOnInit(): void {

  }


  ngAfterContentInit(): void {
    //après initialisatin du contenu ont ajoute les éléments dans le formulaire
    const unity = this.data.consommable.unity
    this.add_cons_section.get("name")?.setValue(this.data.consommable.nom);
    this.add_cons_section.get("quantity")?.setValue(this.data.consommable.quantity);
    this.add_cons_section.get("unity")?.setValue(unity);
    this.add_cons_section.get("cost")?.setValue(this.data.consommable.cost); 
    this.add_cons_section.get("cost_ttc")?.setValue(this.data.consommable.cost_ttc); 
    this.add_cons_section.get("taux_tva")?.setValue(this.data.consommable.taux_tva);
    // Si on récupère une date de limite de consommatin négative on dépose 0 sinon on dépose la dlc
   
    
  }



  changeConsommable() {
    let new_conso = new Cconsommable();
    // on construit la date limite de consomation à partir de la date de récéption.
    if(this.is_modif){
      const date_reception_date = this.calcul_service.stringToDate(this.data.consommable.date_reception); 
      const dlc = this.calcul_service.stringToDate(this.data.consommable.date_reception); 
      new_conso.date_reception =  date_reception_date 
    }
    else{
      new_conso.date_reception = new Date();
    }

    //on modifie le nom est l'unitée avant envoie dans le base de donnée 
    const name = this.add_cons_section.value["name"]?.split(' ').join('_');
    const unity = this.add_cons_section.value["unity"]?.split(' ')[0];
    
    /* On crée un ingrédient à partir des données récupéré depuis le formulaire puis on l'ajoute à la bdd */
    if (name !== undefined) {
      new_conso.setNom(name);
    }


    if (this.add_cons_section.value["taux_tva"] !== undefined) {
      new_conso.setTauxTva(Number(this.taux.nativeElement.value));
    }

    if (this.add_cons_section.value["quantity"] !== undefined) {
      new_conso.setQuantity(this.add_cons_section.value["quantity"]);
    }

    if (unity !== undefined) {
      new_conso.setUnity(unity);
    }

    if(this.add_cons_section.value["cost"] !== undefined){
      new_conso.setCost(this.add_cons_section.value["cost"]);
    }

    if(this.add_cons_section.value["cost_ttc"] !== undefined){
      new_conso.setCostTTC(this.add_cons_section.value["cost_ttc"]);
    }

    if(this.add_cons_section.value["marge"] !== undefined){
     if(this.add_cons_section.value["marge"] !== null) new_conso.setMarge(this.add_cons_section.value["marge"]);
    }


    if(new_conso.getQuantity() < new_conso.getMarge()){
      //alors on affiche une alerte 
      const msg = "le consommable ".concat(new_conso.name).concat(" arrive en rupture de stock.");
      this.service_alertes.setAlertes(msg, this.data.restaurant, this.data.prop, "softeat", "", "conso");
    }

    if(this.add_cons_section.valid){
      
      this.service.setConsoInBdd(new_conso, this.data.prop, this.data.restaurant).then(() => {
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

}
