import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cplat, Mplat } from '../../../../../../../../app/interfaces/plat';
import { PlatsInteractionService } from '../../../../../../../../app/services/menus/plats-interaction.service';
import { ClientsService } from '../../../../../../../../app/services/clients/clients.service';

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
  });
  constructor(private plat_service:PlatsInteractionService,private client_service:ClientsService ,
    @Inject(MAT_DIALOG_DATA) public data:{
    prop:string,
    restaurant:string
    }) {
      this.plats = [];
      this.plat_names = [];
    }

  ngOnInit(): void {
    this.plat_service.getPlatFromRestaurantBDD(this.data.prop, this.data.restaurant);
    this.plat_service.getPlatFromRestaurant().subscribe((plats) => {
      this.plats = plats;
      this.plat_names = this.plats.map((plat) => plat.nom.split("_").join(" "));
      const first_form = new FormGroup({
        name: new FormControl(this.plat_names[0], Validators.required),
        quantity: new FormControl(0),
        price: new FormControl(0, Validators.required)
      })
      this.form_plats.controls.plats.controls.push(first_form);
    });
  }
  /**
   * soumission d'une campagne de SMS celle-ci concerne le séstockage des aliments 
   * @returns void
   */
  submitCampagne(){
    let plats = new Array<Mplat>;
    const restaurant = this.data.restaurant;
    const prop = this.data.prop;
    this.form_plats.controls.plats.controls.forEach((_plat) => {
       const _plat_name = _plat.controls.name.value;
       const _plat_quantity = _plat.controls.quantity.value;
       const _plat_price = _plat.controls.price.value;
       if((_plat_name !== null) && (_plat_price !== null)){
        let plat = new Mplat(_plat_name, _plat_price);
        if(_plat_quantity !== null){
          plat.quantity = _plat_quantity;
        }
        plats.push(plat)
       }
    });
    this.client_service.sendSmsWastPrev(restaurant, prop, plats);
  }
  /**
   * Cette fonction permet la suppression d'un plat pour une campagne de déstockage parmis l'ensemble des plats 
   * séléctionné pour la réalisation d'une campagne anti gaspillage 
   * @param index indice du plat que l'on souhaite supprimé 
   * @returns void
   */
  remInputPlat(index:number) {
    this.form_plats.controls.plats.controls = this.form_plats.controls.plats.controls.filter((plat,plat_index) => plat_index !== index)
  }
  /**
   * Cette fonction permet l'ajout d'un plat pour une campagne de déstockage parmis l'ensemble des plats
   * @returns void
   */
  addInputPlat() {
    const new_form = new FormGroup({
      name: new FormControl(this.plat_names[0], Validators.required),
      quantity: new FormControl(),
      price: new FormControl(0, Validators.required)
    })
    this.form_plats.controls.plats.controls.push(new_form);
  }
}
