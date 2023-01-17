import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router, UrlTree } from '@angular/router';
import { Cconsommable } from 'src/app/interfaces/ingredient';
import { ConsommableInteractionService } from 'src/app/services/menus/consommable-interaction.service';
import { CalculConsoServiceTsService } from 'src/app/services/menus/menu.calcul/menu.calcul.consommable/calcul.conso.service.ts.service';
import { AddConsoComponent } from './app.conso.modals/add-ing/add.ing/add.conso.component';

@Component({
  selector: 'app-conso',
  templateUrl: './app.conso.component.html',
  styleUrls: ['./app.conso.component.css']
})
export class AppConsoComponent implements OnInit {

  public displayedColumns: string[] = ['nom', 'quantity', 'unity','cost', 'cost_ttc', 'date_reception', 'actions'];
  public dataSource: MatTableDataSource<{
    nom:string;
    cost:number;
    cost_ttc:number;
    quantity:number;
    unity:string;
    date_reception: string;
  }>;

  public consommable_displayed: Array<{
    nom:string;
    cost:number;
    cost_ttc:number;
    quantity:number;
    unity:string;
    date_reception: string;
  }>;

  private page_number: number;
  private router: Router;
  private consommable_table: Array<Cconsommable>;
  private url: UrlTree;
  private prop:string;
  private restaurant:string;

  constructor(private service:ConsommableInteractionService, private calc_service:CalculConsoServiceTsService,
    router: Router, public dialog: MatDialog,  private _snackBar: MatSnackBar) { 
    this.page_number = 1;
    this.prop = "";
    this.restaurant = "";
    this.router = router;
    this.consommable_table = [];
    this.consommable_displayed = [];
    this.dataSource = new MatTableDataSource(this.consommable_displayed);
    this.url = this.router.parseUrl(this.router.url);
  }

ngOnInit(): void{
     let user_info = this.url.queryParams;
     this.prop = user_info["prop"];
     this.restaurant = user_info["restaurant"];

    const first_step = this.service.getConsommablesFromRestaurants(this.prop, this.restaurant).then(async (consommables) => {
       for(let i = 0; i < consommables.length; i++){
          if(consommables[i].date_reception === undefined){
            consommables[i].date_reception = new Date();
          }
          else{
            consommables[i].date_reception = new Date(consommables[i].date_reception);
          }
          if((consommables[i].cost_ttc === undefined) || (consommables[i].cost_ttc === 0)){
            if(consommables[i].taux_tva !== undefined){
              consommables[i].cost_ttc = this.calc_service.getCostTtc(consommables[i].taux_tva, consommables[i].cost);
            }
          }
          let row_consommable = {
            nom: consommables[i].nom.split('_').join('<br>'),
            cost: consommables[i].cost,
            cost_ttc: consommables[i].cost_ttc,
            quantity: consommables[i].quantity,
            unity: consommables[i].unity,
            date_reception: consommables[i].date_reception.toLocaleString()
          };
          this.consommable_displayed.push(row_consommable);
          if(i === consommables.length - 1){
            this.consommable_table = consommables;
            this.dataSource.data = this.consommable_displayed;
          }
        }
      })
      const first_event = new PageEvent();
      first_event.length = this.consommable_displayed.length
      first_event.pageSize = 6
      first_event.pageIndex = 0
      this.pageChanged(first_event);
  }

    

  OpenAddConsoForm(){
    const dialogRef = this.dialog.open(AddConsoComponent, {
      height: `${window.innerHeight - window.innerHeight/2}px`,
      width:`${window.innerWidth - window.innerWidth/15}px`,
      data: {
        restaurant: this.restaurant,
        prop: this.prop,
        is_modif: false,
        consommable: {
          nom: "",
          quantity: 0,
          cost: 0,
          cost_ttc: 0,
          taux_tva: 0,
          unity: "",
          date_reception: new Date(),
        }
      }
    });
  }

  modifConso(ele:{
    nom: string,
    quantity: number,
    cost: number
    cost_ttc: number,
    unity: string,
    date_reception: string,
  }){
    
    const date_reception = this.calc_service.stringToDate(ele.date_reception);
    ele.nom = ele.nom.split('<br>').join('_');
    console.log(ele.unity);
    // afin de récupérer le taux de tva comme celui-ci ne passe pas par le tableau affiché on eut le récupérer directment depuis la bdd 
    const conso = this.consommable_table.filter((conso) => conso.nom === ele.nom)[0];
    const dialogRef = this.dialog.open(AddConsoComponent, {
      height: `${window.innerHeight - window.innerHeight/2}px`,
      width:`${window.innerWidth - window.innerWidth/15}px`,
      data: {
        restaurant: this.restaurant,
        prop: this.prop,
        is_modif: true,
        consommable: {
          nom: ele.nom,
          quantity: ele.quantity,
          unity: ele.unity,
          cost: ele.cost,
          cost_ttc: ele.cost_ttc,
          taux_tva: conso.taux_tva,
          date_reception: ele.date_reception,

        }
      }
    });
   
  }

  suppConso(ele:{
    nom:string;
    cost:number;
    cost_ttc:number;
    quantity:number;
    unity:string;
    date_reception: string;
  }){
    let is_prep = false

    console.log(ele.nom);
    this.service.removeConsoInBdd(ele.nom.split('<br>').join('_'), this.prop, this.restaurant).then(() => {
      this._snackBar.open("l'ingrédient vient d'être supprimé de la base de donnée du restaurant", "fermer")
    }).catch(() => {
      this._snackBar.open("l'ingrédient n'a pas pu être supprimé de la base de donnée du restaurant", "fermer")
    });

    //on regénère la datasource 
    this.consommable_displayed = this.consommable_displayed.filter((consommable) => consommable.nom !== ele.nom.split('<br>').join('_')); 
    const supp_event = new PageEvent();
                  supp_event.length = this.consommable_displayed.length
                  supp_event.pageSize = 6
                  supp_event.pageIndex = this.page_number
    this.pageChanged(supp_event);
  }

  pageChanged(event: PageEvent) {
    event.length;
    let datasource = [... this.consommable_displayed];
    this.page_number = event.pageIndex;    
    this.dataSource.data = datasource.splice(event.pageIndex * event.pageSize, event.pageSize);
  }

}


