import { Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cetape } from 'src/app/interfaces/etape';
import {TConsoBase, TIngredientBase } from 'src/app/interfaces/ingredient';
import { CalculService } from 'src/app/services/menus/menu.calcul/menu.calcul.ingredients/calcul.service';
import { PreparationInteractionService } from 'src/app/services/menus/preparation-interaction.service';

@Component({
  selector: 'app-add.preparations',
  templateUrl: './add.preparations.component.html',
  styleUrls: ['./add.preparations.component.css']
})
export class AddPreparationsComponent implements OnInit {
  public index_ings_inputs: Array<number>;
  public index_consos_inputs: Array<number>;
  public index_etapes_inputs: Array<number>;
  private current_inputs_ing: number;
  private current_inputs_conso: number;
  private current_inputs_etapes: number;
  public add_prepa_section = new FormGroup({
    name: new FormControl('', Validators.required),
    base_ing: new FormArray<FormGroup<{
      name:FormControl<string | null>,
      quantity:FormControl<number | null>,
      unity:FormControl<string | null>
    }>>([
      new FormGroup({
      name: new FormControl(""),
      quantity: new FormControl(0),
      unity: new FormControl("")
      })
    ]),
    base_conso: new FormArray<FormGroup<{
      name:FormControl<string | null>,
      quantity:FormControl<number | null>,
      unity:FormControl<string | null>
    }>>([
      new FormGroup({
        name: new FormControl(""),
        quantity: new FormControl(0),
        unity: new FormControl("")
        })
    ]),
    etapes: new FormArray<FormGroup<{
      name:FormControl<string | null>,
      comm:FormControl<string | null>,
      tmps:FormControl<number | null>
    }>>([
      new FormGroup({
        name: new FormControl(""),
        comm: new FormControl(""),
        tmps: new FormControl(0),
      })
    ])
  });
  private base_ings: Array<TIngredientBase>;
  private base_conso: Array<TConsoBase>;
  private etapes: Array<Cetape>;
  
  @ViewChild('taux')
  taux!: ElementRef;


  constructor(public dialogRef: MatDialogRef<AddPreparationsComponent>,
    public calcul_service: CalculService, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data:{
    prop:string,
    restaurant:string,
    names: Array<string | null>
    }, private preparation_service: PreparationInteractionService) { 
    this.base_ings = [];
    this.base_conso = [];
    this.etapes = [];
    this.index_consos_inputs = [];
    this.index_ings_inputs = [];
    this.index_etapes_inputs = [];
    this.current_inputs_ing = 1;
    this.current_inputs_conso = 1;
    this.current_inputs_etapes = 1;

  }

  ngOnInit(): void {
    this.index_consos_inputs.push(1);
    this.index_ings_inputs.push(1);
    this.index_etapes_inputs.push(1);
  }


  changePreparation(){
    let to_add_preparation_name:string = "";

    const name_prepa = this.add_prepa_section.value.name
    if(name_prepa !== undefined){

      if(!this.data.names.includes(name_prepa)){
        if(name_prepa !== null){
          to_add_preparation_name = name_prepa;
          
          const base_ings = this.getBaseIng();
          const base_conso = this.getBaseConso();
          const etapes_prepa = this.getEtapes();
          
          base_ings.value.forEach((ing:Partial<{name:string | null, quantity:number | null, unity:string | null}>) => {
            let full_ing:TIngredientBase = {name:"", quantity:0,quantity_unity:0,unity:"",cost:0,vrac:false,marge:0};
            if((ing.name !== undefined) || (ing.name !== null)){
              full_ing.name = ing.name as string;
              if((ing.quantity !== undefined) || (ing.quantity !== null)){
                full_ing.quantity = ing.quantity as number;
              } 
              if((ing.unity !== undefined) || (ing.unity !== null)){
                full_ing.unity =  ing.unity as string;
              } 
              this.base_ings.push(full_ing);
            }
          })
          base_conso.value.forEach((conso:Partial<{name:string | null, quantity:number | null, unity:string | null}>) => {
            if(conso.name !== undefined || (conso.name !== null)){
              
              if((conso.quantity === undefined) || (conso.quantity === null)) conso.quantity = 0;
              if((conso.unity === undefined) || (conso.unity === null)) conso.unity = "";
              this.base_conso.push(conso as {name:string, quantity:number, unity:string})
            } 
          })
          etapes_prepa.value.forEach((etape:Partial<{name:string | null, comm:string | null, tmps:number | null}>) => {
            if(etape.name !== undefined || (etape.name !== null)){
              if((etape.tmps !== undefined) || (etape.tmps !== null)){
                if((etape.comm === undefined) || (etape.comm === null)) etape.comm = "";
                let add_etape = new Cetape();
                add_etape.nom = (etape.name as string);
                add_etape.temps = (etape.tmps as number);
                add_etape.commentaire = (etape.comm as string); 
                this.etapes.push(add_etape);
              }
            } 
          });
          this.preparation_service.setNewPreparation(this.data.restaurant, this.data.prop,
             name_prepa.split(" ").join('_'), this.etapes, this.base_ings, this.base_conso);
        }
      }
    }    
  }

  addTaux(event: Object): void {
    const taux = this.calcul_service.getTauxFromCat(event["value" as keyof typeof event].toString());
    this.taux.nativeElement.value = taux;
  }

  addInputIng(){
    this.current_inputs_ing = this.current_inputs_ing + 1;
    this.index_ings_inputs.push(this.current_inputs_ing);
    const new_ing = this.formBuilder.group({
      name: new FormControl(""),
      quantity: new FormControl(0),
      unity: new FormControl("")
    });
    this.getBaseIng().push(new_ing);

  }

  addInputConso(){
    this.current_inputs_conso = this.current_inputs_conso + 1;
    this.index_consos_inputs.push(this.current_inputs_conso);
    const new_conso = this.formBuilder.group({
      name: new FormControl(""),
      quantity: new FormControl(0),
      unity: new FormControl("")
    });
    this.getBaseConso().push(new_conso);
  }

  addInputEtape(){
    this.current_inputs_etapes = this.current_inputs_etapes + 1;
    this.index_etapes_inputs.push(this.current_inputs_etapes);
    const new_etape = this.formBuilder.group({
      name: new FormControl(""),
      comm: new FormControl(""),
      tmps: new FormControl(0),
    });
    this.getEtapes().push(new_etape);
  }

  getBaseIng(){
    return this.add_prepa_section.get("base_ing") as FormArray<FormGroup<{
      name:FormControl<string | null>,
      quantity:FormControl<number | null>,
      unity:FormControl<string | null>
    }>>
  }

  getBaseConso(){
    return this.add_prepa_section.get("base_conso") as FormArray<FormGroup<{
      name:FormControl<string | null>,
      quantity:FormControl<number | null>,
      unity:FormControl<string | null>
    }>>
  }

  getEtapes(){
    return this.add_prepa_section.get("etapes") as FormArray<FormGroup<{
      name:FormControl<string | null>,
      comm:FormControl<string | null>,
      tmps:FormControl<number | null>
    }>>
  }

}
