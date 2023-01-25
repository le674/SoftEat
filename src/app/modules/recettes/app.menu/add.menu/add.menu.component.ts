import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add.menu',
  templateUrl: './add.menu.component.html',
  styleUrls: ['./add.menu.component.css']
})
export class AddMenuComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddMenuComponent>) { }

  ngOnInit(): void {
    
  }

}
