import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestaurantService } from 'src/app/services/restaurant/restaurant.service';

@Component({
  selector: 'app-add.configue.salary',
  templateUrl: './add.configue.salary.component.html',
  styleUrls: ['./add.configue.salary.component.css']
})
export class AddConfigueSalaryComponent implements OnInit {
  public restaurants: Array<string>;
  public salary: number;
  public add_salary = new FormGroup({
    restaurant: new FormControl('', Validators.required),
    salary: new FormControl(0, Validators.required)
  });

  constructor(public dialogRef: MatDialogRef<AddConfigueSalaryComponent>, @Inject(MAT_DIALOG_DATA) public data:{
    restaurants:Array<string>
    prop:string
    },private service_restaurant:RestaurantService) {
      this.salary = 0; 
      this.restaurants = [];
    }

  ngOnInit(): void {
    this.restaurants = this.data.restaurants;
    this.add_salary.controls.salary.setValue(1300);
  }

  addSalary(){
    const salary = this.add_salary.controls.salary.value;
    const restaurant = this.add_salary.controls.restaurant.value;
    if(salary !== null) this.salary = salary;
    if(restaurant !== null){
      this.service_restaurant.setCuisinieSalary(this.data.prop, restaurant, this.salary);
    }
  }
}
