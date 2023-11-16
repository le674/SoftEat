import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Unsubscribe } from 'firebase/firestore';
import { Observable, Subscription, map } from 'rxjs';
import { Address } from 'src/app/interfaces/address';
import { InteractionBddFirestore } from 'src/app/interfaces/interaction_bdd';
import { Cplat } from 'src/app/interfaces/plat';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-prise-commande',
  templateUrl: './prise-commande.component.html',
  styleUrls: ['./prise-commande.component.css']
})
export class PriseCommandeComponent implements OnInit{
  private path_plats:string[];
  private req_plats!:Unsubscribe;
  private plats_sub!:Subscription;
  $plats?:Observable<Array<InteractionBddFirestore>>;
  public $_carte:{
    $_plats?:Observable<Cplat[]>,
    $_entree?:Observable<Cplat[]>,
    $_dessert?:Observable<Cplat[]>,
    [index:string]:any
  };
  public $_plats?:Observable<Cplat[]>;
  public $_entree?:Observable<Cplat[]>;
  public $_dessert?:Observable<Cplat[]>;
  public add_client:Array<boolean>;
  public add_commande_section = new FormGroup({
    commande: new FormArray<FormGroup<{
      new_client?:FormGroup<{
        name:FormControl<string | null>,
        surname:FormControl<string | null>,
        email:FormControl<string | null>,
        number:FormControl<string | null>,
        address:FormGroup<{
          postal_code:FormControl<string | null>,
          street_number:FormControl<number | null>,
          street:FormControl<string | null>,
          city:FormControl<string | null>
        }>,  
        order_number:FormControl<number | null>,
        waste_alert:FormControl<string | null>,
        promotion:FormControl<string | null>     
      }>,
      entries:FormArray<FormGroup<{
        name: FormControl<string | null>;
        quantity: FormControl<number | null>;
      }>>,
      plats:FormArray<FormGroup<{
        name: FormControl<string | null>;
        quantity: FormControl<number | null>;
      }>>,
      desserts:FormArray<FormGroup<{
        name: FormControl<string | null>;
        quantity: FormControl<number | null>;
      }>>,
    }>>([])
  });

  constructor(public dialogRef: MatDialogRef<PriseCommandeComponent>,  private formBuilder: FormBuilder, private firestore: FirebaseService, @Inject(MAT_DIALOG_DATA) public data:{
    prop:string,
    restaurant:string,
    table_id: string
    }){
      this.$_carte = {};
      this.add_client = [];
      this.path_plats = Cplat.getPathsToFirestore(this.data.prop);
  }
  ngOnInit(): void {
   let indexs = ['entree', 'plat', 'dessert']; 
   this.req_plats = this.firestore.getFromFirestoreBDD(this.path_plats, Cplat, null);
   let $plats = this.firestore.getFromFirestore() as  Observable<InteractionBddFirestore[]>; 
   indexs.forEach((index) => {
    this.$_carte[index] = $plats.pipe(
      map((plats_lst) => {
        let _plats = plats_lst as Array<Cplat>;
        const plat = _plats.filter((plat) => plat.type === index);
        return plat
      })
     );
   });
  }
  addCommande(){
  }
  addClient(index:number, event:MatCheckboxChange){
    if(event.checked){
      this.add_client[index] = true;
      const form_group = new FormGroup({
        postal_code:new FormControl(""),
        street_number:new FormControl(0),
        street:new FormControl(""),
        city:new FormControl("")
      });
      let client = new FormGroup({
        name:new FormControl(''),
        surname:new FormControl(''),
        email:new FormControl(''),
        number:new FormControl(''),
        address:new FormGroup({
          postal_code:new FormControl(""),
          street_number:new FormControl(0),
          street:new FormControl(""),
          city:new FormControl("")
        }),  
        order_number:new FormControl(0),
        waste_alert:new FormControl(''),
        promotion:new FormControl('')
      })
      this.add_commande_section.controls.commande.at(index).controls.new_client = client; 
    }
    else{
      this.add_client[index] = false;
      this.add_commande_section.controls.commande.at(index).controls.new_client = undefined;
    }

  }
  addInputCmd() {
    let entries = new FormArray<FormGroup<{
      name: FormControl<string | null>;
      quantity: FormControl<number | null>;
    }>>([]);
    let plats = new FormArray<FormGroup<{
      name: FormControl<string | null>;
      quantity: FormControl<number | null>;
    }>>([]);
    let desserts = new FormArray<FormGroup<{
      name: FormControl<string | null>;
      quantity: FormControl<number | null>;
    }>>([]);
    let commande = new FormGroup({
      entries,
      plats,
      desserts
    })
    this.add_commande_section.controls.commande.push(commande)
    this.add_client.push(false);
  }
  addInputPlt(index_cmd:number, type:string){
    let name = "";
    let quantity = 0;
    const new_plt = this.formBuilder.group({
      name: new FormControl(name, Validators.required),
      quantity: new FormControl(quantity),
    });
    if(type === "entry"){
      this.add_commande_section.controls.commande.controls.at(index_cmd)?.controls.entries.push(new_plt);
    }
    if(type === "plat"){
      this.add_commande_section.controls.commande.controls.at(index_cmd)?.controls.plats.push(new_plt);
    }
    if(type === "dessert"){
      this.add_commande_section.controls.commande.controls.at(index_cmd)?.controls.desserts.push(new_plt);
    }
  }
  suppInputPlt(index_cmd:number, index_entry:number, type:string){
    if(type==="entry"){
      this.add_commande_section.controls.commande.controls.at(index_cmd)?.controls.entries.removeAt(index_entry);
    }
    if(type==="plat"){
      this.add_commande_section.controls.commande.controls.at(index_cmd)?.controls.plats.removeAt(index_entry);
    }
    if(type==="dessert"){
      this.add_commande_section.controls.commande.controls.at(index_cmd)?.controls.desserts.removeAt(index_entry);
    }
  }
  suppInputCmd(_index: number) {
    this.add_commande_section.controls.commande.removeAt(_index);
  }
  closePopup($event: MouseEvent) {
    this.dialogRef.close();
  }
}
