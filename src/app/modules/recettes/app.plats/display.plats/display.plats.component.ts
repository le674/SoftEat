import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import {CIngredient, TIngredientBase } from '../../../../../app/interfaces/ingredient';
import { Cplat } from '../../../../../app/interfaces/plat';
import { Cpreparation, CpreparationBase } from '../../../../../app/interfaces/preparation';
import { CalculService } from '../../../../../app/services/menus/menu.calcul/menu.calcul.ingredients/calcul.service';
import { MenuCalculPlatsServiceService } from '../../../../../app/services/menus/menu.calcul/menu.calcul.plats/menu.calcul.plats.service.service';
import { CalculPrepaService } from '../../../../../app/services/menus/menu.calcul/menu.calcul.preparation/calcul.prepa.service';
import { RecetteHelpPlatsComponent } from './display.plats.modals/recette.help.plats/recette.help.plats.component';
import { CommonService } from '../../../../../app/services/common/common.service';
import { Cconsommable, TConsoBase } from 'src/app/interfaces/consommable';
import { RowConsommableRecette, RowIngredientRecette, RowPreparationRecette } from 'src/app/interfaces/recette';

@Component({
  selector: 'app-display.plats',
  templateUrl: './display.plats.component.html',
  styleUrls: ['./display.plats.component.css']
})
export class DisplayPlatsComponent implements OnInit {

  public plat:Cplat;
  public tmps_prepa_theo:string;
  public prime_cost:number | null;
  public prix_ttc:number;
  public portion_cost:number | null;
  public material_ratio:number | null;
  public recommendation_price:number;
  public displayedColumnsIng: string[] = ['nom', 'quantity', 'unity', 'cost', 'cost_matiere'];
  public displayedColumnsConso: string[] = ['nom', 'quantity', 'unity', 'cost'];
  public displayedColumnsEtape: string[] = ['nom', 'temps', 'commentaire'];
  public displayedColumnsPrepa: string[] = ['nom', 'val_bouch', 'cost'];
  public windows_screen_mobile:boolean;
  public visibles:{
    index_1:Array<boolean>,
    index_2: Array<boolean>,
    index_3: Array<boolean>,
    index_4: Array<boolean>
  };
  public dataSource_prepa: MatTableDataSource<RowPreparationRecette>

  public dataSource_ing: MatTableDataSource<RowIngredientRecette>;

  public dataSource_conso: MatTableDataSource<RowConsommableRecette>;

  public dataSource_etape: MatTableDataSource<{
    nom: string;
    temps: number;
    commentaire: string | null;
  }>;


  public displayed_prepa: Array<RowPreparationRecette>

  public displayed_ing: Array<RowIngredientRecette>;

  public displayed_conso: Array<RowConsommableRecette>;

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
    ingredients: Array<CIngredient>,
    consommables: Array<Cconsommable>,
    preparations: Array<Cpreparation>,
    plat: Cplat
    }, private prepa_service:CalculPrepaService, private plat_service:MenuCalculPlatsServiceService, private _snackBar: MatSnackBar,
     private calcul_service:CalculService, public mobile_service:CommonService  ,public dialog: MatDialog) {
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
      this.windows_screen_mobile = this.mobile_service.getMobileBreakpoint("ing");
      this.visibles = {
        index_1: [],
        index_2: [],
        index_3: [],
        index_4: []
      }
    }
  ngOnInit(): void {
    //ont récupère les préprations uniquement qui sont 

    this.tmps_prepa_theo = this.plat_service.getFullTheoTimeFromSec(this.data.plat, this.data.preparations);
    let price_ttc = this.calcul_service.getCostTtcFromTaux(this.data.plat.taux_tva, this.data.plat.cost);
    if(this.data.plat.portion_cost !== undefined){
      let taux_tva = this.calcul_service.getCostTtcFromTaux(this.data.plat.taux_tva, this.recommendation_price);
      this.portion_cost = this.data.plat.portion_cost;
      this.recommendation_price = this.plat_service.platsRecommendationStep1(this.portion_cost);
      let recommandation_price = this.calcul_service.getCostTtcFromTaux(this.data.plat.taux_tva, this.recommendation_price);
      if(recommandation_price !== null){
        this.recommendation_price = recommandation_price;
      }
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
    if(price_ttc !== null){
      this.prix_ttc = price_ttc;
    }

    if(this.data.plat.preparations !== null){
      if(this.data.plat.preparations.length > 0){
          const res = this.data.plat.preparations.filter((prepa) => prepa.name !== null)
          this.displayed_prepa = res.map((_preparation) => {
           const preparation = this.data.preparations.find((preparation) => {
            if(_preparation.id !== null){
              _preparation.id.includes(preparation.id)
            }

           });
           let cost = 0;
           let val_bouch = 0; 
           if((preparation !== undefined) && (preparation.ingredients !== null) ){
              val_bouch = this.prepa_service.getValBouchFromBasIng(preparation.ingredients, this.data.ingredients,1, "p");
              cost = this.prepa_service.getTotCost(this.data.ingredients, preparation.ingredients);
            }
            return {name: _preparation.name as string,
              val_bouch: val_bouch,
              cost: cost
           }
          })
          this.dataSource_prepa.data = this.displayed_prepa;
          this.visibles.index_2 = new Array(this.displayed_prepa.length).fill(false);
      }
    }

    if(this.data.ingredients !== null){
      if(this.data.plat.ingredients.length > 0){
        const material_cost = this.prepa_service.getCostMaterial(this.data.ingredients, this.data.plat.ingredients);
        this.displayed_ing = material_cost.map((ing) => {
          let ingredient = new RowIngredientRecette(ing.name, ing.cost, ing.quantity, ing.unity);
          if(ing.material_cost !== null){
            ingredient.cost_material = ing.material_cost;
          }
          return ingredient;
        });
        this.visibles.index_1 = new Array(this.displayed_ing.length).fill(false);
        this.dataSource_ing.data = this.displayed_ing;
      }
    }
    if(this.data.plat.consommables !== null){
      if(this.data.plat.consommables.length > 0){
        this.displayed_conso = this.data.plat.consommables.map((consommable) => {
          let cost = 0;
          let quantity = 0; 
          let unity = "";
          let full_conso = this.data.consommables.find((_consommable) => {
            if(consommable.id !== null){
              consommable.id.push(_consommable.id);
            }
          });
          if(full_conso !== undefined){
            cost = full_conso.cost;
          }
          if(consommable.quantity !== null) quantity = consommable.quantity;
          if(consommable.unity !== null) unity = consommable.unity;
          return {name: consommable.name, cost: cost, quantity:quantity, unity:unity};
        });
        this.visibles.index_3 = new Array(this.displayed_conso.length).fill(false);
        this.dataSource_conso.data = this.displayed_conso; 
      }
    }
    if(this.data.plat.etapes !== null){
      this.displayed_etape = this.data.plat.etapes.map((etape) => {return {nom: etape.name, temps: etape.time, commentaire: etape.commentary}})
      this.visibles.index_4 = new Array(this.displayed_etape.length).fill(false);
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

  // Gestion de l'accordéon version mobile
  getVisible(i: number, categorie:number):boolean{
    return this.visibles["index_" + categorie.toString() as keyof typeof this.visibles][i];
  } 
  changeArrow(arrow_index: number, categorie:number) {
    this.visibles["index_" + categorie.toString() as keyof typeof this.visibles][arrow_index] = !this.visibles["index_" + categorie.toString() as keyof typeof this.visibles][arrow_index];
  }
}
