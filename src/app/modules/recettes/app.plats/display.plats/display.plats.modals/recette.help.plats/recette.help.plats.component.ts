import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RecetteHelpPreparationsComponent } from '../../../../../../../app/modules/recettes/app.preparations/display.preparation/display.preparations/display.preparations.modals/recette.help.preparations/recette.help.preparations.component';

@Component({
  selector: 'app-recette.help.plats',
  templateUrl: './recette.help.plats.component.html',
  styleUrls: ['./recette.help.plats.component.css']
})
export class RecetteHelpPlatsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RecetteHelpPreparationsComponent>) { }

  ngOnInit(): void {
  }
  closePopup(): void{
    this.dialogRef.close()
  }
}
