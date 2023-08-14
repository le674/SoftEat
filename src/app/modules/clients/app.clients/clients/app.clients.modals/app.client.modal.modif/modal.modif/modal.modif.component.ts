import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Client, DisplayedClient } from '../../../../../../../../app/interfaces/client';
import { ClientsService } from '../../../../../../../../app/services/clients/clients.service';
import { Address } from 'src/app/interfaces/address';
import { throwError } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-modal.modif',
  templateUrl: './modal.modif.component.html',
  styleUrls: ['./modal.modif.component.css']
})
export class ModalModifComponent implements OnInit {
  public modif_clients_section = new FormGroup({
    name: new FormControl(''),
    surname: new FormControl(''),
    email: new FormControl(''),
    number: new FormControl('', Validators.required),
    postal_code: new FormControl(""),
    street: new FormControl(""),
    street_number: new FormControl(0),
    city: new FormControl("", Validators.required),
    waste_alert: new FormControl(""),
    promotion: new FormControl(""),
    order_number: new FormControl(0)
  })
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    restaurant: string,
    prop: string,
    client:DisplayedClient, 
    clients: Array<Client>
  },private service:FirebaseService,
  private _snackBar: MatSnackBar, public dialogRef: MatDialogRef<ModalModifComponent>) { 

  }
  ngOnInit(): void {
    
    this.data.clients
    if(this.data.client.name !== undefined){
      this.modif_clients_section.controls.name.setValue(this.data.client.name);
    }
    if(this.data.client.surname !== undefined){
      this.modif_clients_section.controls.surname.setValue(this.data.client.surname);
    }
    if(this.data.client.email !== undefined){
      this.modif_clients_section.controls.email.setValue(this.data.client.email);
    }
    if(this.data.client.postal_code !== undefined){
      this.modif_clients_section.controls.postal_code.setValue(this.data.client.postal_code)
    }
    if(this.data.client.city !== undefined){
      this.modif_clients_section.controls.city.setValue(this.data.client.city)
    }
    if(this.data.client.street !== undefined){
      this.modif_clients_section.controls.street.setValue(this.data.client.street)
    }
    if(this.data.client.street_number !== undefined){
      this.modif_clients_section.controls.street_number.setValue(this.data.client.street_number)
    }
    if(this.data.client.order_number !== undefined){
      this.modif_clients_section.controls.order_number.setValue(this.data.client.order_number)
    }
    if(this.data.client.number !== undefined){
      this.modif_clients_section.controls.number.setValue(this.data.client.number)
    }
    if(this.data.client.waste_alert !== undefined){
      this.modif_clients_section.controls.waste_alert.setValue(this.data.client.waste_alert);
    }
    if(this.data.client.promotion !== undefined){
      this.modif_clients_section.controls.promotion.setValue(this.data.client.promotion);
    }
  }
  closePopup(click:MouseEvent){
    this.dialogRef.close();
  }
  changeClient(){
    let path_to_client = Client.getPathsToFirestore(this.data.prop, this.data.restaurant);
    if(this.data.client.number !== undefined){
      const client = this.data.clients.find((client) => this.data.client.number === client.number);
      if(client !== undefined){
        client.address = new Address(null, null, "", null);
        const postal_code = this.modif_clients_section.controls.postal_code.value;
        const city = this.modif_clients_section.controls.city.value;
        const street = this.modif_clients_section.controls.street.value;
        const street_number = this.modif_clients_section.controls.street_number.value;
        const name =  this.modif_clients_section.controls.name.value;
        const surname =  this.modif_clients_section.controls.surname.value;
        const email =  this.modif_clients_section.controls.email.value;
        const number =  this.modif_clients_section.controls.number.value;
        const order_number =  this.modif_clients_section.controls.order_number.value;
        const promotion = this.modif_clients_section.controls.promotion.value;
        const waste_alert = this.modif_clients_section.controls.waste_alert.value;
        if((name !== null) && (name !== undefined)){
          client.name = name;
        }
        if((surname !== null) && (surname !== undefined)){
          client.surname = surname;
        }
        if((email !== null) && (email !== undefined)){
          client.email = email;
        }
        if((number !== null) && (number !== undefined)){
          client.number = number;
        }
        if((postal_code !== null) && (postal_code !== undefined)){
          client.address.postal_code = postal_code;
        }
        if((city !== null) && (city !== undefined)){
          client.address.city = city;
        }
        if((street !== null) && (street !== undefined)){
          client.address.street = street;
        }
        if((street_number !== null) && (street_number !== undefined)){
          client.address.street_number = street_number;
        }
        if((order_number !== null) && (order_number !== undefined)){
          client.order_number = order_number;
        }
        if((promotion !== null) && (promotion !== undefined)){
          if(promotion === "oui"){
            client.promotion = true;
          }
          else{
            client.promotion = false;
          }
        }
        if((waste_alert !== null) && (waste_alert !== undefined)){
          if(waste_alert === "oui"){
            client.waste_alert = true;
          }
          else{
            client.waste_alert = false;
          }
        }
        this.service.updateFirestoreData(client.id, client, path_to_client, Client).catch((e) => {
          this._snackBar.open("le client n'a pas pu être modifié","fermer")
          const err = new Error(e);
          return throwError(() => err).subscribe((error) => {
            console.log(error);
          });
        }).then(() => {
          this._snackBar.open("le client vient d'être modifié","fermer")
        });
      }
    }
  }
}
