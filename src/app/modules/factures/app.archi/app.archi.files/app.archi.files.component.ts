import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Unsubscribe } from 'firebase/firestore';
import { Facture } from 'src/app/interfaces/facture';
import { CommonService } from 'src/app/services/common/common.service';
import { FactureInteractionService } from 'src/app/services/factures/facture-interaction/facture-interaction.service';
import { FacturePdfService } from 'src/app/services/factures/facture_pdf/facture-pdf.service';

@Component({
  selector: 'app-files',
  templateUrl: './app.archi.files.component.html',
  styleUrls: ['./app.archi.files.component.css']
})
export class AppArchiFilesComponent implements OnInit {
  @Input() prop:string;
  @Input() restaurant:string;
  @Input() dates:Array<string>;
  private req_factures!:Unsubscribe;
  public files:Array<Facture>;
  constructor(private service_common:CommonService,
    private service:FactureInteractionService,
    private service_pdf:FacturePdfService,
    private router:Router) { 
    this.files = [];
    this.dates = [];
    this.prop = "";
    this.restaurant = "";
  }

  ngOnInit(): void {
    const month = this.service_common.getMonths().findIndex((month) => month === this.dates[1]);
    const day =  this.dates[2];
    const year = this.dates[0];
    this.req_factures = this.service.getFactureBDD(this.prop, +day, month, +year);
    this.service.getFacture().subscribe((factures:Facture[]) => {
      this.files = factures;
    })
  }
  decouperListe(liste:Array<any>, tailleSousListe:number) {
    const sousListes = [];
    const nombreDeSousListes = Math.ceil(liste.length / tailleSousListe);
  
    for (let i = 0; i < nombreDeSousListes; i++) {
      const debut = i * tailleSousListe;
      const fin = debut + tailleSousListe;
      sousListes.push(liste.slice(debut, fin));
    } 
    return sousListes;
  }
  displayFile(facture: Facture) {
    if(facture.path !== null){
      let path = facture.path + "/" + facture.id + "." + facture.extension;
      this.service.getFactureFromStorage(path).then((url) => {
        window.location.href = url;
      })
    }
  } 
}
