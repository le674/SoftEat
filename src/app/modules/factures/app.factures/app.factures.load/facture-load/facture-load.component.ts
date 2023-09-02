import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FactureImgService } from '../../../../../../app/services/factures/facture_img/facture-img.service';
import { FacturePdfService } from '../../../../../../app/services/factures/facture_pdf/facture-pdf.service';
import { BehaviorSubject, throwError } from 'rxjs';
import { Facture, FacturePrintedResult } from 'src/app/interfaces/facture';
import { FactureInteractionService } from 'src/app/services/factures/facture-interaction/facture-interaction.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-facture-load',
  templateUrl: './facture-load.component.html',
  styleUrls: ['./facture-load.component.css']
})
export class FactureLoadComponent implements OnInit {
  private dataSubject = new BehaviorSubject<FacturePrintedResult[] | null>(null); // Initialisez avec une valeur par défaut
  public load: boolean;
  public form:boolean;
  constructor(private service_facture_img:FactureImgService, private service_facture_pdf:FacturePdfService,@Inject(MAT_DIALOG_DATA) public data:{
    url: string;
    type: string;
    prop: string;
    facture: Facture,
    file: File
}, private _mat_dialog_ref:MatDialogRef<FactureLoadComponent>, private _snackBar:MatSnackBar) {
  this.load = true;
  this.form = false;
  if(this.data.type === "archive-facture"){
    this.form = true;
  }
 }

  ngOnInit(): void {
    if(this.data.type === "image"){
      this.service_facture_img.parseFacturesImg(this.data.url).then((parsed_img) => {
        this.dataSubject.next(parsed_img); // Émettez la valeur
        this.load = false;
        this.sleep(1000).then(() => {
          this._mat_dialog_ref.close(); // Fermez le dialog
        })
      }).catch((error) => {
        this._snackBar.open("problème lors de l'import de l'image veuillez contacter softeat", "fermer");
        this._mat_dialog_ref.close();
        let err = new Error(error);
        return throwError(() => err).subscribe((error) => {
          console.log(error);
        });
      }).finally(() => {
        this._snackBar.open("Import de la facture sous format image terminé", "fermer");
      }) 
    }
    if(this.data.type === "pdf"){
      this.service_facture_pdf.parseFacture(this.data.url).then((parsed_pdf) => {
        this.dataSubject.next(parsed_pdf); // Émettez la valeur
        this.load = false;
        this.sleep(1000).then(() => {
          this._mat_dialog_ref.close(); // Fermez le dialog
        })
      }).catch((error) => {
        this._snackBar.open("problème lors de l'import du pdf veuillez contacter softeat", "fermer");
        this._mat_dialog_ref.close();
        let err = new Error(error);
        return throwError(() => err).subscribe((error) => {
          console.log(error);
        });
      }).finally(() => {
        this._snackBar.open("Import de la facture sous format pdf terminé", "fermer");
      }) 
    }
    if(this.data.type === "archive-facture"){
      this.form = true;
    }
  }
  endPopup(event:any){
    this.form = false;
    this.load = false;
    this._mat_dialog_ref.close();
  }
  getDataSubject() {
    return this.dataSubject.asObservable();
  }
  sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
