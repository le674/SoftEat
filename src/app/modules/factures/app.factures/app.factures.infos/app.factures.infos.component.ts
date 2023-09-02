import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { Facture } from 'src/app/interfaces/facture';
import { FactureInteractionService } from 'src/app/services/factures/facture-interaction/facture-interaction.service';

@Component({
  selector: 'app-factures-infos',
  templateUrl: './app.factures.infos.component.html',
  styleUrls: ['./app.factures.infos.component.css']
})
export class AppFacturesInfosComponent implements OnInit {
  public add_facture_infos = new FormGroup({
    name:new FormControl('', Validators.required),
    nature:new FormControl('', Validators.required),
    cost:new FormControl(0, Validators.required),
    id:new FormControl(''),
    account_number:new FormControl('')
  });
  public natures;
  @Output() myEvent = new EventEmitter<boolean>();
  @Input() prop:string;
  @Input() file!:File;
  @Input() facture!:Facture;
  constructor(public facture_service:FactureInteractionService,  private _snackBar:MatSnackBar){
    this.prop = "";
    this.natures = Facture.getNatures();
  }
  ngOnInit(): void {
  }
  submitInfo() {
    if(this.add_facture_infos.valid){
      const cost = this.add_facture_infos.controls.cost.value;
      const name = this.add_facture_infos.controls.name.value;
      const account_id = this.add_facture_infos.controls.account_number.value;
      const id = this.add_facture_infos.controls.id.value;
      const nature = this.add_facture_infos.controls.nature.value;
      if(cost){
        this.facture.ammount_total = cost;
      }
      if(name){
        this.facture.supplier = name;
      }
      if(nature){
        this.facture.nature = nature;
      }
      if(id){
        this.facture.identifiant = id;
      }
      if(account_id){
        this.facture.account_id = account_id;
      }
      this.facture_service.setFactureFirestore(this.prop, this.facture).then((facture) => {
        const result = facture.creatPath(this.prop);
        if(!result){
          this._snackBar.open("problème lors de l'archivage de la facture veuillez contacter softeat", "fermer");
          throw "identifiant du propriétaire null ou identifiant de la facture non existant"
        }
        this.facture_service.setFactureStorage(this.file, facture).catch((error) => {
          this._snackBar.open("problème lors de l'archivage de la facture veuillez contacter softeat", "fermer");
          let err = new Error(error);
          return throwError(() => err).subscribe((error) => {
            console.log(error);
          });
        }).finally(() => {
          this.sleep(10).then(() => {
            this.myEvent.emit(true);
            this._snackBar.open("Téléchargement de la facture terminé", "fermer");
          })
        });
      })
    }
  }
  sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
