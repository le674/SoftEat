import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-app.help.preparation',
  templateUrl: './app.help.preparation.component.html',
  styleUrls: ['./app.help.preparation.component.css']
})
export class AppHelpPreparationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AppHelpPreparationComponent>) { }

  ngOnInit(): void {
  }

  closePopup(): void{
    this.dialogRef.close()
  }
}
