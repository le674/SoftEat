import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FactureImgService } from '../../../../../../app/services/factures/facture_img/facture-img.service';
import { FacturePdfService } from '../../../../../../app/services/factures/facture_pdf/facture-pdf.service';
import { BehaviorSubject } from 'rxjs';
import { FacturePrintedResult } from 'src/app/interfaces/facture';

@Component({
  selector: 'app-facture-load',
  templateUrl: './facture-load.component.html',
  styleUrls: ['./facture-load.component.css']
})
export class FactureLoadComponent implements OnInit {
  private dataSubject = new BehaviorSubject<FacturePrintedResult[] | null>(null); // Initialisez avec une valeur par défaut
  constructor(private service_facture_img:FactureImgService, private service_facture_pdf:FacturePdfService,@Inject(MAT_DIALOG_DATA) public data:{
    url: string;
    type: string;
}, private _mat_dialog_ref:MatDialogRef<FactureLoadComponent>) { }

  ngOnInit(): void {
    if(this.data.type === "image"){
      this.service_facture_img.parseFacturesImg(this.data.url).then((parsed_img) => {
        this.dataSubject.next(parsed_img); // Émettez la valeur
        this._mat_dialog_ref.close(); // Fermez le dialog
      }) 
    }
  }

  getDataSubject() {
    return this.dataSubject.asObservable();
  }
  
}
