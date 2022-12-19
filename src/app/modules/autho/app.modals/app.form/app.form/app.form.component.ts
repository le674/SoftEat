import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Restaurant } from 'src/app/interfaces/restaurant';
import { InteractionRestaurantService } from '../../../app.autho/interaction-restaurant.service';

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
    adresse: new FormControl('')
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data:{
    prop:string
    uid: string,
    trigger: ElementRef
  }, _mat_dialog_ref:MatDialogRef<AppFormComponent>, private service : InteractionRestaurantService) { 
    this._mat_dialog_ref = _mat_dialog_ref;
    this.triggerElementRef = data.trigger;
    this.uid = data.uid;
    this.proprietaire = data.prop
  }

  ngOnInit(): void {
  }
  on_no_click(): void {
    this._mat_dialog_ref.close();
    console.log(this.proprietaire);
    
  }
  on_validate(): void {
    
    //envoyer le restaurant dans la base de donnée 
    let restaurant = new Restaurant()
    const adresse = this.restaurant_section.value.adresse 
    const id =  this.restaurant_section.value.id
    restaurant.adresse = ((adresse !== null) && (adresse !== undefined)) ? adresse : ""
    restaurant.id = ((id !== null) && (id !== undefined)) ? id : ""
    this.service.setRestaurant(this.proprietaire, restaurant)
    
  }
}
