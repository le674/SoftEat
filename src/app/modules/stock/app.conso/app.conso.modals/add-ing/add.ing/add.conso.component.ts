import { AfterContentInit, Component, Inject, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalculService } from '../../../../../../../app/services/menus/menu.calcul/menu.calcul.ingredients/calcul.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertesService } from '../../../../../../../app/services/alertes/alertes.service';
import { Cconsommable } from 'src/app/interfaces/consommable';
import { FirebaseService } from 'src/app/services/firebase.service';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-add.conso',
  templateUrl: './add.conso.component.html',
  styleUrls: ['./add.conso.component.css']
})
export class AddConsoComponent implements OnInit, AfterContentInit{
  private readonly _mat_dialog_ref: MatDialogRef<AddConsoComponent>;
  public is_modif: boolean;
  public cost_ttc_val:number | null;
  public add_cons_section = new FormGroup({
    name: new FormControl('', Validators.required),
    taux_tva: new FormControl(0),
    quantity: new FormControl(0, Validators.required),
    unity: new FormControl('', Validators.required),
    cost_ttc: new FormControl(0),
    cost: new FormControl(0, Validators.required),
    marge: new FormControl(0, Validators.required)
  });

  constructor(public dialogRef: MatDialogRef<AddConsoComponent>,
    public calcul_service: CalculService, @Inject(MAT_DIALOG_DATA) public data: {
      restaurant: string,
      prop: string,
      is_modif: boolean,
      consommable: {
        categorie_restaurant:string | null,
        quantity: number,
        total_quantity:number;
        name: string,
        cost: number,
        unity: string,
        taux_tva: number,
        cost_ttc: number,
        date_reception: string,
        marge:number,
        id:string,
      }
    },
    private firestore:FirebaseService,
    private _snackBar: MatSnackBar, private service_alertes:AlertesService ) {
    this._mat_dialog_ref = dialogRef;
    this.is_modif = this.data.is_modif;
    this.cost_ttc_val = 0;
  }
  ngOnInit(): void {

  }
  ngAfterContentInit(): void {
    //Pour le moment ont ne met pas unity mais p, car on ne gère pas les quantitée unitaire
    // et quantitée dans l'application 
    const unity = this.data.consommable.unity
    this.add_cons_section.get("name")?.setValue(this.data.consommable.name);
    this.add_cons_section.get("quantity")?.setValue(this.data.consommable.quantity);
    this.add_cons_section.get("unity")?.setValue('p');
    this.add_cons_section.get("cost")?.setValue(this.data.consommable.cost); 
    this.add_cons_section.get("cost_ttc")?.setValue(this.data.consommable.cost_ttc); 
    this.add_cons_section.get("taux_tva")?.setValue(this.data.consommable.taux_tva);
    this.add_cons_section.get("marge")?.setValue(this.data.consommable.marge);
    //
    this.add_cons_section.controls.unity.disable();
    // Si on récupère une date de limite de consommatin négative on dépose 0 sinon on dépose la dlc
   
    
  }
  changeConsommable() {
    let path_to_conso = Cconsommable.getPathsToFirestore(this.data.prop, this.data.restaurant);
    let new_conso = new Cconsommable();
    if(this.data.prop !== undefined){
      new_conso.proprietary_id = this.data.prop;
    }
    if(this.data.consommable.id !== undefined){
      new_conso.id = this.data.consommable.id; 
    }
    if(this.data.consommable.total_quantity !== undefined){
      new_conso.total_quantity = this.data.consommable.total_quantity; 
    }
    if(this.data.consommable.categorie_restaurant !== undefined){
      new_conso.categorie_restaurant = this.data.consommable.categorie_restaurant;
    }
    else{
      this._snackBar.open("le consommable n'a pas d'identifiant", "fermer");
      throw "le consommable n'a pas d'identifiant";
    }
    // on construit la date limite de consomation à partir de la date de récéption.
    if(this.is_modif){
      const date_reception_date = this.calcul_service.stringToDate(this.data.consommable.date_reception); 
      const dlc = this.calcul_service.stringToDate(this.data.consommable.date_reception);
      if(date_reception_date !== null){
        new_conso.date_reception =  date_reception_date 
      } 
      else{
        new_conso.date_reception = new Date();
      }
    }
    else{
      new_conso.date_reception = new Date();
    }

    //on modifie le nom est l'unitée avant envoie dans le base de donnée 
    const name = this.add_cons_section.value["name"];
    const unity = this.add_cons_section.controls.unity.value;
    /* On crée un ingrédient à partir des données récupéré depuis le formulaire puis on l'ajoute à la bdd */
    if (name !== undefined && name !== null) {
      new_conso.name = name;
    }
    if (this.add_cons_section.value["taux_tva"] !== undefined && this.add_cons_section.value["taux_tva"] !== null) {
      new_conso.taux_tva = this.add_cons_section.value["taux_tva"];
    }
    if (this.add_cons_section.value["quantity"] !== undefined) {
      if(this.add_cons_section.value["quantity"] !== null) {
        new_conso.quantity = this.add_cons_section.value["quantity"];
        new_conso.total_quantity = this.add_cons_section.value["quantity"];
        if(this.data.consommable.quantity !== undefined){
          if((this.data.consommable.quantity < this.add_cons_section.value["quantity"]) || (!this.data.is_modif)){
            new_conso.total_quantity =  this.add_cons_section.value["quantity"];
          }
        }
      }
    }
    if (unity !== undefined && unity !== null) {
      new_conso.unity = unity;
    }
    if(this.add_cons_section.value["cost"] !== undefined && this.add_cons_section.value["cost"] !== null){
      new_conso.cost = this.add_cons_section.value["cost"];
    }

    if(this.add_cons_section.value["cost_ttc"] !== undefined && this.add_cons_section.value["cost_ttc"] !== null){
      new_conso.cost_ttc = this.add_cons_section.value["cost_ttc"]
    }
    if(this.add_cons_section.value["marge"] !== undefined && this.add_cons_section.value["marge"] !== null){
      new_conso .marge = this.add_cons_section.value["marge"];
    }
    if(new_conso.quantity < new_conso.marge){
      //alors on affiche une alerte 
      const msg = "le consommable ".concat(new_conso.name).concat(" arrive en rupture de stock.");
     // this.service_alertes.setAlertes(msg, this.data.restaurant, this.data.prop, "softeat", "", "conso");
    }
    if(this.add_cons_section.valid){
      if(this.is_modif){
        this.firestore.updateFirestoreData(new_conso.id,new_conso, path_to_conso, Cconsommable).then(() => {
          this._snackBar.open("le consommable vient d'être modifié à la base de donnée du restaurant", "fermer");
        }).catch((e) => {
          this._snackBar.open("nous n'avons pas réussit à modifier le consommable dans la base de donnée", "fermer");
          let error = new Error(e);
          return throwError(() => error).subscribe((error) => {
            console.log(error);
          });
        })
      }
      else{
        this.firestore.setFirestoreData(new_conso, path_to_conso, Cconsommable).then(() => {
          this._snackBar.open("le consommable vient d'être ajouté à la base de donnée du restaurant", "fermer");
        }).catch((e) => {
          this._snackBar.open("nous n'avons pas réussit à envoyer le consommable dans la base de donnée", "fermer");
          let error = new Error(e);
          return throwError(() => error).subscribe((error) => {
            console.log(error);
          });
        });
        this.dialogRef.close()
      }
    }
    else{
      this._snackBar.open("veuillez valider l'ensemble des champs", "fermer")
    }
  }

  setPrixTTCfHT(event:any){
    let curr_cost = 0;
    curr_cost = event.target.value;
    const taux = this.add_cons_section.controls.taux_tva.value;
    if(taux !== null){
      curr_cost = Number(curr_cost);
      this.cost_ttc_val =  this.calcul_service.getCostTtcFromTaux(taux, curr_cost);
    }
  }

  setPrixTTC(event:any){
    const taux = event.target.value;
    const curr_cost = this.add_cons_section.controls.cost.value;
    if(curr_cost!== null){
      this.cost_ttc_val = this.calcul_service.getCostTtcFromTaux(taux, curr_cost);
    }
  }
  closePopup($event: MouseEvent) {
    this._mat_dialog_ref.close();
  }
}
