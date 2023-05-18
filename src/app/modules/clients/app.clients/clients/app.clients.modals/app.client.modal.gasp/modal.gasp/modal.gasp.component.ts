import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cplat } from '../../../../../../../../app/interfaces/plat';
import { PlatsInteractionService } from '../../../../../../../../app/services/menus/plats-interaction.service';

@Component({
  selector: 'app-modal.gasp',
  templateUrl: './modal.gasp.component.html',
  styleUrls: ['./modal.gasp.component.css']
})
export class ModalGaspComponent implements OnInit {
  public plats:Array<Cplat>;
  public plat_names:Array<string>;
  public form_plats = new FormGroup({
    plats: new FormArray<FormGroup<{
      name: FormControl<string | null>,
      quantity: FormControl<number | null>,
      price: FormControl<number | null>
    }>>([])
  })
  constructor(private plat_service:PlatsInteractionService, @Inject(MAT_DIALOG_DATA) public data:{
    prop:string,
    restaurant:string
    }) {
      this.plats = [];
      this.plat_names = [];
    }

  ngOnInit(): void {
    this.plat_service.getPlatFromRestaurant(this.data.prop, this.data.restaurant).then((plats) => {
      this.plats = plats;
      this.plat_names = this.plats.map((plat) => plat.nom.split("_").join(" "));
      const first_form = new FormGroup({
        name: new FormControl(this.plat_names[0]),
        quantity: new FormControl(0),
        price: new FormControl(0)
      })
      this.form_plats.controls.plats.controls.push(first_form);
    });
  }
  submitCampagne() {
  }
  remInputPlat(index:number) {
    this.form_plats.controls.plats.controls = this.form_plats.controls.plats.controls.filter((plat,plat_index) => plat_index !== index)
  }
  addInputPlat() {
    const new_form = new FormGroup({
      name: new FormControl(this.plat_names[0]),
      quantity: new FormControl(0),
      price: new FormControl(0)
    })
    this.form_plats.controls.plats.controls.push(new_form);
  }
}
