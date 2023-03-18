import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-recette.help.preparations',
  templateUrl: './recette.help.preparations.component.html',
  styleUrls: ['./recette.help.preparations.component.css']
})
export class RecetteHelpPreparationsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RecetteHelpPreparationsComponent>) { }

  ngOnInit(): void {
  }
  closePopup(): void{
    this.dialogRef.close()
  }
}
