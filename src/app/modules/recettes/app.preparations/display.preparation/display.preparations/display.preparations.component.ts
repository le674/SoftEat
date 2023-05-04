import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Cetape } from '../../../../../../app/interfaces/etape';
import { Consommable, TIngredientBase } from '../../../../../../app/interfaces/ingredient';
import { CalculPrepaService } from '../../../../../../app/services/menus/menu.calcul/menu.calcul.preparation/calcul.prepa.service';
import { RecetteHelpPreparationsComponent } from './display.preparations.modals/recette.help.preparations/recette.help.preparations.component';
import { CommonService } from '../../../../../../app/services/common/common.service';

@Component({
  selector: 'app-display.preparations',
  templateUrl: './display.preparations.component.html',
  styleUrls: ['./display.preparations.component.css']
})
export class DisplayPreparationsComponent implements OnInit {
  public name_prepa: string;
  public tmps_prepa: string;
  public prime_cost: number;
  public val_bouch:number; 
  public displayedColumnsIng: string[] = ['nom', 'quantity', 'unity', 'cost', 'cost_matiere'];
  public displayedColumnsConso: string[] = ['nom', 'quantity', 'unity', 'cost'];
  public displayedColumnsEtape: string[] = ['nom', 'temps', 'commentaire'];
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
    unity: string,
  }>;
  public dataSource_etape: MatTableDataSource<{
    nom: string;
    temps: number;
    commentaire: string | null;
  }>;
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
  public visibles:{
    index_1:Array<boolean>,
    index_2: Array<boolean>,
    index_3: Array<boolean>
  };
  public windows_screen_mobile:boolean;
  @ViewChild('paginatoring') paginatoring!: MatPaginator;
  @ViewChild('paginatorconso') paginatorconso!: MatPaginator;
  @ViewChild('paginatoretape') paginatoretape!: MatPaginator;
  page_number_etapes: number;
  page_number_conso: number;
  page_number_ings: number;
  constructor(public dialogRef: MatDialogRef<DisplayPreparationsComponent>, @Inject(MAT_DIALOG_DATA) public data: {
    prop: string,
    restaurant: string,
    name: string,
    ingredients: Array<TIngredientBase>,
    consommables: Array<Consommable>,
    etapes: Array<Cetape>,
    unity:string,
    quantity_after_prep: number,
    val_bouch:number,
    temps:number,
    prime_cost:number
  }, private prepa_service:CalculPrepaService,
   public dialog: MatDialog, public mobile_service:CommonService) { 
    this.page_number_conso = 0;
    this.page_number_etapes = 0;
    this.page_number_ings = 0;
    this.tmps_prepa = "";
    this.val_bouch = 0;
    this.prime_cost = 0;
    this.name_prepa = "";
    this.displayed_ing = [];
    this.displayed_conso = [];
    this.displayed_etape = [];
    this.dataSource_ing = new MatTableDataSource(this.displayed_ing);
    this.dataSource_conso = new MatTableDataSource(this.displayed_conso);
    this.dataSource_etape = new MatTableDataSource(this.displayed_etape);
    this.windows_screen_mobile = this.mobile_service.getMobileBreakpoint("ing");
    this.visibles = {
      index_1: [],
      index_2: [],
      index_3: []
    }
  }
  ngOnInit(): void {
    this.name_prepa = this.data.name;
    this.tmps_prepa = this.prepa_service.SecToString(this.data.temps);
    this.prime_cost = this.data.prime_cost;
    this.val_bouch = this.data.val_bouch;
    if(this.data.ingredients !== null){
      if(this.data.ingredients.length > 0){

        this.displayed_ing = this.data.ingredients.map((ing) => {
          return {name: ing.name, quantity: ing.quantity, unity: ing.unity, cost:ing.cost, cost_matiere: ing.material_cost}
        })
        this.dataSource_ing.data = this.displayed_ing;
        this.visibles.index_1 = new Array(this.displayed_ing.length).fill(false);
      }
    }
    if(this.data.consommables !== null){
      if(this.data.consommables.length > 0){
        this.displayed_conso = this.data.consommables;
        this.dataSource_conso.data = this.displayed_conso;
        this.visibles.index_2 = new Array(this.displayed_conso.length).fill(false); 
      }
    }
    if(this.data.etapes !== null){
      this.displayed_etape = this.data.etapes.map((etape) => {return {nom: etape.nom, temps: etape.temps, commentaire: etape.commentaire}})
      this.visibles.index_3 = new Array(this.displayed_etape.length).fill(false); 
      this.dataSource_etape.data = this.displayed_etape;
    }
    
    // ont initialise la pagination pour le tableau, ingrédient, consommables, étapes
    const ing_data = new PageEvent();
    ing_data.length = this.displayed_ing.length
    ing_data.pageSize = 1
    ing_data.pageIndex = this.page_number_ings
    this.pageChangedInv(ing_data);

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
  pageChangedInv(event:PageEvent){
    event.length;
    let datasource = [... this.displayed_ing];
    this.page_number_ings = event.pageIndex;    
    this.dataSource_ing.data = datasource.splice(event.pageIndex * event.pageSize, event.pageSize);
    
  }
  OpenHelp() {
    const dialogRef = this.dialog.open(RecetteHelpPreparationsComponent, {
      height: `630px`,
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
