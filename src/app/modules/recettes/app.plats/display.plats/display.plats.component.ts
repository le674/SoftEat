import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Cconsommable, Consommable, TIngredientBase } from 'src/app/interfaces/ingredient';
import { Cplat } from 'src/app/interfaces/plat';
import { Cpreparation } from 'src/app/interfaces/preparation';
import { CalculService } from 'src/app/services/menus/menu.calcul/menu.calcul.ingredients/calcul.service';
import { MenuCalculPlatsServiceService } from 'src/app/services/menus/menu.calcul/menu.calcul.plats/menu.calcul.plats.service.service';
import { CalculPrepaService } from 'src/app/services/menus/menu.calcul/menu.calcul.preparation/calcul.prepa.service';
import { RecetteHelpPlatsComponent } from './display.plats.modals/recette.help.plats/recette.help.plats.component';

@Component({
  selector: 'app-display.plats',
  templateUrl: './display.plats.component.html',
  styleUrls: ['./display.plats.component.css']
})
export class DisplayPlatsComponent implements OnInit {

  public plat:Cplat;
  public tmps_prepa_theo:string;
  public prime_cost:number;
  public prix_ttc:number;
  public portion_cost:number;
  public material_ratio:number;
  public recommendation_price:number;
  public displayedColumnsIng: string[] = ['nom', 'quantity', 'unity', 'cost', 'cost_matiere'];
  public displayedColumnsConso: string[] = ['nom', 'quantity', 'unity', 'cost'];
  public displayedColumnsEtape: string[] = ['nom', 'temps', 'commentaire'];
  public displayedColumnsPrepa: string[] = ['nom', 'val_bouch', 'cost'];

  public dataSource_prepa: MatTableDataSource<{
    name: string;
    val_bouch:number;
    cost:number
  }>

  public dataSource_ing: MatTableDataSource<{
    name: string;
    quantity: number;
    unity: string,
    cost: number;
    cost_matiere: number;
  }>;

  public dataSource_conso: MatTableDataSource<{
    name: string;
    cost: number;
    quantity: number;
    unity: string;
  }>;

  public dataSource_etape: MatTableDataSource<{
    nom: string;
    temps: number;
    commentaire: string | null;
  }>;


  public displayed_prepa: Array<{
    name:string;
    val_bouch:number;
    cost:number;
  }>

  public displayed_ing: Array<{
    name: string;
    quantity: number;
    unity: string,
    cost: number;
    cost_matiere: number;
  }>;

  public displayed_conso: Array<{
    name: string;
    cost: number;
    quantity: number;
    unity: string;
  }>;

  public displayed_etape: Array<{
    nom: string;
    temps: number;
    commentaire: string | null;
  }>;
  @ViewChild('paginatoring') paginatoring!: MatPaginator;
  @ViewChild('paginatorconso') paginatorconso!: MatPaginator;
  @ViewChild('paginatoretape') paginatoretape!: MatPaginator;
  page_number_etapes: number;
  page_number_conso: number;
  page_number_ings: number;
  page_number_prepa:number;
  private preparations:Array<Cpreparation>;
  private ingredients:Array<TIngredientBase>;
  private consommables:Array<Cconsommable>;
  constructor(public dialogRef: MatDialogRef<DisplayPlatsComponent>, @Inject(MAT_DIALOG_DATA) public data:{
    prop:string,
    restaurant:string,
    ingredients: Array<TIngredientBase>,
    consommables: Array<Consommable>,
    preparations: Array<Cpreparation>,
    plat: Cplat
    }, private prepa_service:CalculPrepaService, private plat_service:MenuCalculPlatsServiceService, private _snackBar: MatSnackBar,
     private calcul_service:CalculService,  public dialog: MatDialog) {
      this.preparations = [];
      this.ingredients = [];
      this.consommables = [];
      this.tmps_prepa_theo = '';
      this.prime_cost = 0;
      this.prix_ttc = 0;
      this.portion_cost = 0;
      this.material_ratio = 0;
      this.plat = this.data.plat;
      this.page_number_conso = 0;
      this.page_number_etapes = 0;
      this.page_number_ings = 0;
      this.page_number_prepa = 0;
      this.recommendation_price = 0;
      this.displayed_ing = [];
      this.displayed_conso = [];
      this.displayed_etape = [];
      this.displayed_prepa = [];
      this.dataSource_ing = new MatTableDataSource(this.displayed_ing);
      this.dataSource_conso = new MatTableDataSource(this.displayed_conso);
      this.dataSource_etape = new MatTableDataSource(this.displayed_etape);
      this.dataSource_prepa = new MatTableDataSource(this.displayed_prepa);
    }

  ngOnInit(): void {
    //ont récupère les préprations uniquement qui sont 

    this.tmps_prepa_theo = this.plat_service.getFullTheoTimeFromSec(this.data.plat);
  

    if(this.data.plat.portion_cost !== undefined){
      this.portion_cost = this.data.plat.portion_cost;
      this.recommendation_price = this.plat_service.platsRecommendationStep1(this.portion_cost);
      this.recommendation_price = this.calcul_service.getCostTtcFromTaux(this.data.plat.taux_tva, this.recommendation_price)
    }
    else{
      this.portion_cost = 0;
    }
    if(this.data.plat.material_ratio !== undefined){
      this.material_ratio = this.data.plat.material_ratio
    }
    else{
      this.material_ratio = 0;
    }
    if(this.data.plat.prime_cost !== undefined){
      this.prime_cost = this.data.plat.prime_cost;
    }
    else{
      this.prime_cost = 0;
    }
    this.prix_ttc = this.calcul_service.getCostTtcFromTaux(this.data.plat.taux_tva, this.data.plat.prix);

    if(this.data.plat.preparations !== null){
      if(this.data.plat.preparations.length > 0){
          const res = this.data.plat.preparations.filter((prepa) => prepa.nom !== null)
          this.displayed_prepa = res.map((preparation) => {
            return {name: preparation.nom as string,
                    val_bouch: this.prepa_service.getValBouchFromBasIng(preparation.base_ing as TIngredientBase[], 1, "p"),
                    cost: this.prepa_service.getTotCost(preparation.base_ing as TIngredientBase[])
            }
        })
        this.dataSource_prepa.data = this.displayed_prepa;
      }
    }

    if(this.data.ingredients !== null){
      if(this.data.plat.ingredients.length > 0){
        const material_cost = this.prepa_service.getCostMaterial(this.data.plat.ingredients);
        this.displayed_ing = material_cost.map((ing) => {

          return {name: ing.nom, quantity: ing.quantity, unity: ing.unity, cost:ing.cost, cost_matiere: ing.cost_matiere}
        })
        this.dataSource_ing.data = this.displayed_ing;
      }
    }
    if(this.data.plat.consommables !== null){
      if(this.data.plat.consommables.length > 0){
        this.displayed_conso = this.data.plat.consommables.map((consommable) => {
          return {name: consommable.name, cost: consommable.cost, quantity:consommable.quantity, unity:consommable.unity};
        });
        this.dataSource_conso.data = this.displayed_conso; 
      }
    }
    if(this.data.plat.etapes !== null){
      this.displayed_etape = this.data.plat.etapes.map((etape) => {return {nom: etape.nom, temps: etape.temps, commentaire: etape.commentaire}})
      this.dataSource_etape.data = this.displayed_etape;
    }

     // ont initialise la pagination pour le tableau, ingrédient, consommables, étapes
     const ing_data = new PageEvent();
     ing_data.length = this.displayed_ing.length
     ing_data.pageSize = 1
     ing_data.pageIndex = this.page_number_ings
     this.pageChangedIng(ing_data);
   
     const conso_data = new PageEvent();
     conso_data.length = this.displayed_conso.length
     conso_data.pageSize = 1
     conso_data.pageIndex = this.page_number_conso
     this.pageChangedConso(conso_data);
   
   
     const etapes_data = new PageEvent();
     etapes_data.length = this.displayed_etape.length
     etapes_data.pageSize = 1
     etapes_data.pageIndex = this.page_number_etapes
     this.pageChangedEtape(etapes_data);

     const prepa_data = new PageEvent();
     prepa_data.length = this.displayed_prepa.length
     prepa_data.pageSize = 1
     prepa_data.pageIndex = this.page_number_prepa
     this.pageChangedPrepa(prepa_data);
  }

  pageChangedPrepa(event:PageEvent){
    event.length;
    let datasource = [... this.displayed_prepa];
    this.page_number_prepa = event.pageIndex;    
    this.dataSource_prepa.data = datasource.splice(event.pageIndex * event.pageSize, event.pageSize);
    
  }

  pageChangedEtape(event:PageEvent){
    event.length;
    let datasource = [... this.displayed_etape];
    this.page_number_etapes = event.pageIndex;    
    this.dataSource_etape.data = datasource.splice(event.pageIndex * event.pageSize, event.pageSize);
    
  }

  pageChangedConso(event:PageEvent){
    event.length;
    let datasource = [... this.displayed_conso];
    this.page_number_conso = event.pageIndex;    
    this.dataSource_conso.data = datasource.splice(event.pageIndex * event.pageSize, event.pageSize);
    
  }

  pageChangedIng(event:PageEvent){
    event.length;
    let datasource = [... this.displayed_ing];
    this.page_number_ings = event.pageIndex;    
    this.dataSource_ing.data = datasource.splice(event.pageIndex * event.pageSize, event.pageSize);
    
  }

  OpenHelp() {
    const dialogRef = this.dialog.open(RecetteHelpPlatsComponent, {
      height: `900px`,
      width: `400px`,
  });
  }
  closePopup(click:MouseEvent){
    this.dialogRef.close();
  }
}
