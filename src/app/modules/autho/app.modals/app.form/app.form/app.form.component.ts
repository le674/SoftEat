import { Component, ElementRef, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Restaurant } from '../../../../../../app/interfaces/restaurant';
import { Address } from 'src/app/interfaces/address';
import { RestaurantService } from 'src/app/services/restaurant/restaurant.service';

@Component({
  selector: 'app-app.form',
  templateUrl: './app.form.component.html',
  styleUrls: ['./app.form.component.css']
})
export class AppFormComponent implements OnInit {
  private readonly _mat_dialog_ref: MatDialogRef<AppFormComponent>;
  private readonly triggerElementRef: ElementRef;
  private uid: string;
  private proprietaire: string;
  public restaurant_section = new FormGroup({
    id: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    postal_code: new FormControl('', Validators.required),
    street_number: new FormControl(0, Validators.required),
    street: new FormControl('', Validators.required)
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data:{
    prop:string
    uid: string,
    trigger: ElementRef
  }, _mat_dialog_ref:MatDialogRef<AppFormComponent>,
  private restaurant:RestaurantService) { 
    this._mat_dialog_ref = _mat_dialog_ref;
    this.triggerElementRef = data.trigger;
    this.uid = data.uid;
    this.proprietaire = data.prop
  }

  ngOnInit(): void {
  }
  on_no_click(): void {
    this._mat_dialog_ref.close();
  }
  on_validate(): void {
    let postal_code = this.restaurant_section.controls.postal_code.value;
    let street = this.restaurant_section.controls.street.value;
    let street_number = this.restaurant_section.controls.street_number.value;
    let city = this.restaurant_section.controls.city.value;
    if((postal_code!==null) && (street!==null) && (street_number!==null) && (city!==null)){
      let address:Address = new Address(postal_code,street_number,city, street);
      //envoyer le restaurant dans la base de donnée 
      let restaurant = new Restaurant(address); 
      this.restaurant.setRestaurant(this.proprietaire,restaurant)
    }
  }
}
