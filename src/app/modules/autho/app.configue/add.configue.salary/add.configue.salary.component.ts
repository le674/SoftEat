import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add.configue.salary',
  templateUrl: './add.configue.salary.component.html',
  styleUrls: ['./add.configue.salary.component.css']
})
export class AddConfigueSalaryComponent implements OnInit {
  public restaurants: Array<string>;
  public add_salary = new FormGroup({
    restaurant: new FormControl('', Validators.required),
    salary: new FormControl(0, Validators.required)
  });

  constructor(public dialogRef: MatDialogRef<AddConfigueSalaryComponent>, @Inject(MAT_DIALOG_DATA) public data:{
    restaurants:Array<string>
    }) { 
      this.restaurants = [];
    }

  ngOnInit(): void {

    this.restaurants = this.data.restaurants;
  }

  addSalary(){
    
  }
}
