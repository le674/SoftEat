import {Component, OnInit } from '@angular/core';
import {Inject} from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'modal-selector',
  templateUrl: 'app.modal.component.html',
})
export class AppModalComponent {

  constructor(public dialogRef: MatDialogRef<AppModalComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}