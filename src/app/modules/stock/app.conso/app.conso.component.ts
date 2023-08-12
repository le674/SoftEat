import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router, UrlTree } from '@angular/router';
import { CalculConsoServiceTsService } from '../../../../app/services/menus/menu.calcul/menu.calcul.consommable/calcul.conso.service.ts.service';
import { AddConsoComponent } from './app.conso.modals/add-ing/add.ing/add.conso.component';
import { CommonService } from '../../../../app/services/common/common.service';
import { Cconsommable } from 'src/app/interfaces/consommable';
import { RowConsommable } from 'src/app/interfaces/inventaire';
import { Unsubscribe } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { InteractionBddFirestore } from 'src/app/interfaces/interaction_bdd';

@Component({
  selector: 'app-conso',
  templateUrl: './app.conso.component.html',
  styleUrls: ['./app.conso.component.css']
})
export class AppConsoComponent implements OnInit, OnDestroy {
  @Input() stock:string | null;
  public displayedColumns: string[] = ['nom', 'quantity', 'unity','cost', 'cost_ttc', 'date_reception', 'actions'];
  public dataSource: MatTableDataSource<RowConsommable>;
  public consommable_displayed: Array<RowConsommable>;
  public windows_screen_mobile:boolean;
  public size:string;
  // cette liste ne converne que les mobiles et est vaut false si l'accordéon n'est pas déroulé true sinon 
  public visibles: Array<boolean>;
  public write:boolean;
  private page_number: number;
  private router: Router;
  private consommable_table: Array<Cconsommable>;
  private url: UrlTree;
  private prop:string;
  private restaurant:string;
  private req_consommables!:Unsubscribe;
  private consommables_sub!:Subscription;
  private firestore_path:Array<string>;
  constructor(private calc_service:CalculConsoServiceTsService,router: Router, public dialog: MatDialog,
    private _snackBar: MatSnackBar, public mobile_service:CommonService,
    private firestore:FirebaseService) { 
    this.consommable_table = [];
    this.consommable_displayed = [];
    this.firestore_path = [];
    this.visibles = [];
    this.page_number = 1;
    this.prop = "";
    this.restaurant = "";
    this.router = router;
    this.windows_screen_mobile = false;
    this.size = "";
    this.dataSource = new MatTableDataSource(this.consommable_displayed);
    this.url = this.router.parseUrl(this.router.url);
    this.stock = null;
    this.write = false;

  }
  ngOnDestroy(): void {
    this.req_consommables();
    this.consommables_sub.unsubscribe();
  }
  ngOnInit(): void{
    if(this.stock !== null){
      if(this.stock.includes("w")) this.write = true;
      if(this.stock.includes("r")){
        let user_info = this.url.queryParams;
        this.prop = user_info["prop"];
        this.restaurant = user_info["restaurant"];
        this.firestore_path = Cconsommable.getPathsToFirestore(this.prop, this.restaurant);
        this.req_consommables = this.firestore.getFromFirestoreBDD(this.firestore_path, Cconsommable);
        this.consommables_sub = this.firestore.getFromFirestore().subscribe((consommables:Array<InteractionBddFirestore>) => {
          let _consommables = consommables as Array<Cconsommable>
          for (let consommable of _consommables) {
            if((consommable.date_reception === undefined) || (consommable.date_reception === null)){
              consommable.date_reception = new Date();
            }
            if((consommable.cost_ttc === undefined) || (consommable.cost_ttc === 0)){
              if(consommable.taux_tva !== undefined){
                consommable.cost_ttc = this.calc_service.getCostTtc(consommable.taux_tva, consommable.cost);
              }
            }
            let row_consommable = new RowConsommable(consommable.name,
               consommable.cost,
               consommable.cost_ttc,
               consommable.quantity,
               consommable.unity,
               consommable.date_reception.toLocaleString(),
               consommable.marge,
               consommable.id);
            this.consommable_displayed.push(row_consommable);
            this.visibles.push(false);
          }
          this.consommable_table = _consommables;
          this.dataSource.data = this.consommable_displayed;
        })
          const first_event = new PageEvent();
          first_event.length = this.consommable_displayed.length
          first_event.pageSize = 6
          first_event.pageIndex = 0
          this.pageChanged(first_event);
          this.windows_screen_mobile = this.mobile_service.getMobileBreakpoint("conso");
      }

    }
  }
  OpenAddConsoForm(){
    const dialogRef = this.dialog.open(AddConsoComponent, {
      height: `${window.innerHeight - window.innerHeight/3}px`,
      width:`${window.innerWidth - window.innerWidth/15}px`,
      data: {
        restaurant: this.restaurant,
        prop: this.prop,
        is_modif: false,
        consommable: {
          categorie_restaurant:null,
          quantity: 0,
          id:null,
          nom: "",
          cost: 0,
          cost_ttc: 0,
          taux_tva: 0,
          total_quantity: 0,
          unity: "",
          date_reception: new Date(),
        }
      }
    });
  }
  modifConso(ele:RowConsommable){
    const date_reception = this.calc_service.stringToDate(ele.date_reception);
    ele.name = ele.name;
    // afin de récupérer le taux de tva comme celui-ci ne passe pas par le tableau affiché on eut le récupérer directment depuis la bdd 
    const conso = this.consommable_table.find((conso) => conso.id === ele.id);
    if(conso !== undefined){
      const dialogRef = this.dialog.open(AddConsoComponent, {
        height: `${window.innerHeight - window.innerHeight/3}px`,
        width:`${window.innerWidth - window.innerWidth/15}px`,
        data: {
          restaurant: this.restaurant,
          prop: this.prop,
          is_modif: true,
          consommable: {
            quantity: ele.quantity,
            name: ele.name,
            cost: ele.cost,
            unity: ele.unity,
            cost_ttc: ele.cost_ttc,
            date_reception: ele.date_reception,
            marge: ele.marge,
            id:ele.id,
            total_quantity: conso.total_quantity,
            taux_tva: conso.taux_tva,
            categorie_restaurant: conso.categorie_restaurant,
          }
        }
      });
    }
    else{
      throw `No consommable founded for array element of id ${ele.id} and name ${ele.name}`;
    }
  }
  suppConso(ele:RowConsommable){
    let is_prep = false
    this.firestore.removeFirestoreBDD(ele.id, this.firestore_path).then(() => {
      this._snackBar.open("l'ingrédient vient d'être supprimé de la base de donnée du restaurant", "fermer")
    }).catch(() => {
      this._snackBar.open("l'ingrédient n'a pas pu être supprimé de la base de donnée du restaurant", "fermer")
    });
    //on regénère la datasource
    const is_same =  this.consommable_displayed.map((consommable) => consommable.name !== ele.name.split('<br>').join('_')); 
    this.consommable_displayed = this.consommable_displayed.filter((consommable) => consommable.name !== ele.name.split('<br>').join('_')); 
    this.visibles = this.visibles.filter((is_visible,index_vis) => is_same[index_vis]);
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
   // Gestion de l'accordéon
   getVisible(i: number):boolean{
    return this.visibles[i];
  }
  changeArrow(arrow_index: number) {
    this.visibles[arrow_index] = !this.visibles[arrow_index];
  }
}