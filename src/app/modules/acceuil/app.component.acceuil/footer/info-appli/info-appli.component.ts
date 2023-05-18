import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-info-appli',
  templateUrl: './info-appli.component.html',
  styleUrls: ['./info-appli.component.css']
})
export class InfoAppliComponent implements OnInit {

  public section:string;
  public message:string;
  public aides:boolean;

  constructor(public dialogRef: MatDialogRef<InfoAppliComponent>, @Inject(MAT_DIALOG_DATA) public data: {
    aides:boolean,
    message:string,
    section: string
  }) { 
    this.aides = this.data.aides;
    this.section = this.data.section;
    this.message = this.data.message;
  }

  ngOnInit(): void {

  }
  
  closePopup(): void{
    this.dialogRef.close()
  }
}
