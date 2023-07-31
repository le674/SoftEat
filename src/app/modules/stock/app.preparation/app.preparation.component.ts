import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router, UrlTree } from '@angular/router';
import { Unsubscribe } from 'firebase/auth';
import { Subscription } from 'rxjs';
import { CIngredient, TIngredientBase } from '../../../../app/interfaces/ingredient';
import { Cpreparation } from '../../../../app/interfaces/preparation';
import { IngredientsInteractionService } from '../../../../app/services/menus/ingredients-interaction.service';
import { CalculService } from '../../../../app/services/menus/menu.calcul/menu.calcul.ingredients/calcul.service';
import { AppAddPreparationComponent } from './app.preparation.modals/app.add.preparation/app.add.preparation.component';
import { AppHelpPreparationComponent } from './app.preparation.modals/app.help.preparation/app.help.preparation/app.help.preparation.component';
import { CommonService } from '../../../../app/services/common/common.service';
import { RowPreparation } from 'src/app/interfaces/inventaire';
import { PreparationInteractionService } from 'src/app/services/menus/preparation-interaction.service';

@Component({
  selector: 'app-prepa',
  templateUrl: './app.preparation.component.html',
  styleUrls: ['./app.preparation.component.css']
})
export class AppPreparationComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() stock:string | null;
  public windows_screen_mobile: boolean;
  public write:boolean;
  public visibles: Array<boolean>;
  public displayedColumns: string[] = ['nom', 'quantity', 'quantity_unity',
    'unity', 'cost', 'date_reception', 'dlc', 'actions'];
  public dataSource: MatTableDataSource<RowPreparation>;

  public displayed_prep: Array<RowPreparation>;
  private page_number: number;
  private router: Router;
  private ingredients_table: Array<CIngredient>;
  private preparation_table: Array<Cpreparation>;
  private url: UrlTree;
  private prop: string;
  private restaurant: string;
  private req_ingredients_prep!: Unsubscribe;
  private req_merge_obs!: Subscription
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private service: IngredientsInteractionService, private prepa_service:PreparationInteractionService,
    private calc_service: CalculService, router: Router, public dialog: MatDialog, private _snackBar: MatSnackBar, public mobile_service:CommonService) {
    this.page_number = 1;
    this.prop = "";
    this.restaurant = "";
    this.router = router;
    this.preparation_table = [];
    this.ingredients_table = [];
    this.displayed_prep = [];
    this.dataSource = new MatTableDataSource(this.displayed_prep);
    this.url = this.router.parseUrl(this.router.url);
    this.windows_screen_mobile = false;
    this.visibles = [];
    this.write = false;
    this.stock = null;
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.req_ingredients_prep();
    this.req_merge_obs.unsubscribe();
  }

  ngOnInit(): void {
    if(this.stock !== null){
      if(this.stock.includes("w")) this.write = true;
      if(this.stock.includes("r")){
        let user_info = this.url.queryParams;
        this.prop = user_info["prop"];
        this.restaurant = user_info["restaurant"];
        this.req_ingredients_prep = this.service.getPreparationsFromRestaurantsBDD(this.prop, this.restaurant);
    
        this.req_merge_obs = this.service.getPrepraparationsFromRestaurants().subscribe((preparations) => {
          this.preparation_table = preparations;
          this.displayed_prep = [];
          this.dataSource = new MatTableDataSource(this.displayed_prep);
          for(let preparation of preparations){
            let ingredients = preparation.ingredients
            const name = preparation.name;
            const cost = preparation.cost;
            const unity = preparation.unity;
            const quantity = preparation.quantity;
            const quantity_unity = preparation.quantity_unity;
            const id = preparation.id;
            let row_preparation = new RowPreparation(name, cost, quantity, quantity_unity, unity, id);
            
            row_preparation.setRowPreparation(preparation);
            this.displayed_prep.push(row_preparation);
          }
          const first_event = new PageEvent();
              first_event.length = preparations.length;
              first_event.pageSize = 6
              this.pageChangedFirst(first_event);
        })
        this.windows_screen_mobile = this.mobile_service.getMobileBreakpoint("prepa");
      }
    }
  }

  OpenHelp() {
    const dialogRef = this.dialog.open(AppHelpPreparationComponent, {
      height: `500px`,
      width: `400px`,
    });
  }

  modifPrepa(ele:RowPreparation) {
    let dlc = null;
    let res_dlc = 0;
    let var_base_ing: Array<TIngredientBase> = [];
    if(ele.dlc){
      dlc = this.calc_service.stringToDate(ele.dlc);
    }
    if ((ele.date_reception !== undefined) && ele.date_reception  && dlc){
      const date_reception = this.calc_service.stringToDate(ele.date_reception);
      if(date_reception !== null){
        res_dlc = (dlc.getTime() - date_reception.getTime()) / (1000 * 60 * 60 * 24)
      }
    }
    ele.name = ele.name.split('<br>').join('_');
    const preparations = this.preparation_table.filter((preparation) => preparation.name === ele.name)
    // TO DO remplacer les window.alert
    // On récupère les ingrédients de bases que l'on envoie 
    if (preparations.length > 1) window.alert('attention plusieurs ingrésient en base de donnée pour l ingrédient modifié (on prend le premier), contctez SoftEat');
    if (preparations.length === 1) {
      if(preparations[0].ingredients !== null){
        var_base_ing = preparations[0].ingredients;
      }
    }
    let preparation = this.preparation_table.find((preparation) => preparation.id === ele.id);

    const dialogRef = this.dialog.open(AppAddPreparationComponent, {
      height: `700px`,
      width: `900px`,
      data: {
        restaurant: this.restaurant,
        prop: this.prop,
        is_modif: true,
        preparation: preparation
      }
    });
  }
   suppPrepa(preparation:RowPreparation) {
    this.prepa_service.removePrepaInBdd(preparation, this.prop, this.restaurant).then(() => {
      this._snackBar.open("l'ingrédient vient d'être supprimé de la base de donnée du restaurant", "fermer")
    }).catch(() => {
      this._snackBar.open("l'ingrédient n'a pas pu être supprimé de la base de donnée du restaurant", "fermer")
    });
  }
  pageChanged(event: PageEvent) {
    let datasource = [... this.displayed_prep];
    this.page_number = event.pageIndex;
    this.dataSource.data = datasource.splice(event.pageIndex * event.pageSize, event.pageSize);
  }
  pageChangedFirst(event: PageEvent) {
    let datasource = [... this.displayed_prep];
    this.page_number = 0;
    this.dataSource.data = datasource.splice(0, event.pageSize);
    if(this.paginator !== undefined){
      this.paginator.firstPage();
    }
  }
  // Gestion de l'accordéon
  getVisible(i: number):boolean{
    return this.visibles[i];
  }
  changeArrow(arrow_index: number) {
    this.visibles[arrow_index] = !this.visibles[arrow_index];
  }
}