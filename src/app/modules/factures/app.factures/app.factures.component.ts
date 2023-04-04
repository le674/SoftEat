import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router, UrlTree } from '@angular/router';
import { CIngredient } from 'src/app/interfaces/ingredient';
import { FacturesService } from 'src/app/services/factures/factures.service';
import { IngredientsInteractionService } from 'src/app/services/menus/ingredients-interaction.service';
import { CalculService } from 'src/app/services/menus/menu.calcul/menu.calcul.ingredients/calcul.service';
import { ModifIngComponent } from './app.factures.modif/modif.ing/modif.ing.component';

@Component({
  selector: 'app-factures',
  templateUrl: './app.factures.component.html',
  styleUrls: ['./app.factures.component.css']
})
export class AppFacturesComponent implements OnInit {

  private prop: string;
  private restaurant: string;
  private router:Router;
  private url: UrlTree;
  private page_number: number;

  public ingredients_displayed_br: Array<{
    nom: string;
    categorie_tva: string;
    cost: number;
    cost_ttc: number;
    quantity: number;
    quantity_unity: number;
    unity: string;
    date_reception: string;
    dlc: string;
  }>;

  public dataSource: MatTableDataSource<{
    nom: string;
    categorie_tva: string;
    cost: number;
    cost_ttc: number;
    quantity: number;
    quantity_unity: number;
    unity: string,
    date_reception: string;
    dlc: string;
  }>;
  
  displayedColumns: string[] = ['nom', 'categorie_tva', 'quantity', 'quantity_unity',
  'unity', 'cost', 'cost_ttc', 'date_reception', 'dlc', 'actions'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: IngredientsInteractionService, router: Router, 
    public dialog: MatDialog, private calc_service: CalculService, private _snackBar:MatSnackBar,private service_facture:FacturesService) { 
    this.page_number = 0; 
    this.router = router;  
    this.ingredients_displayed_br = [];
    this.prop = "";
    this.restaurant = "";
    this.dataSource = new MatTableDataSource(this.ingredients_displayed_br);
    this.url = this.router.parseUrl(this.router.url);
  }

  ngOnInit(): void {
    let user_info = this.url.queryParams;
    this.prop = user_info["prop"];
    this.restaurant = user_info["restaurant"];
  }

  getPdf(file_blob: any) {
    if(file_blob.target !== undefined){
      if((file_blob.target.files[0] !== null) && (file_blob.target.files[0] !== undefined)){
        const pdf_file:File = file_blob.target.files[0];
        const url_pdf = URL.createObjectURL(pdf_file);
        this.service_facture.parseFacture(url_pdf).then((parsed_pdf) => {
          for (let ingredient of parsed_pdf) {
            const add_to_tab = {
              nom: ingredient.name,
              categorie_tva: "",
              cost: 0,
              cost_ttc: ingredient.price,
              quantity: ingredient.quantity,
              quantity_unity: 0,
              unity: "",
              date_reception: "",
              dlc: ""
            }
            this.ingredients_displayed_br.push(add_to_tab);
          }
          this.dataSource.data = this.ingredients_displayed_br;
          console.log(parsed_pdf);
        });
      }
     // const url = URL.createObjectURL();
    }
  }
  getImg(file_blob: any) {
    if(file_blob.target !== undefined){
      if((file_blob.target.files[0] !== null) && (file_blob.target.files[0] !== undefined)){
        const image_file:File = file_blob.target.files[0];
        const url_img = URL.createObjectURL(image_file);
        console.log(url_img);
      }
     // const url = URL.createObjectURL();
    }
  }

  modifIng(ele: {
    nom: string;
    categorie_tva: string;
    cost: number;
    cost_ttc: number;
    quantity: number;
    quantity_unity: number;
    unity: string;
    dlc: string;
    marge: number;
    vrac: string;
    date_reception: string;
  }) {
    let res_dlc = 0;
    let var_base_ing: Array<{ name: string; quantity_unity: number; quantity: number; unity: string; cost: number }> = [];
    const dlc = this.calc_service.stringToDate(ele.dlc);
    if (ele.date_reception !== undefined) {
      const date_reception = this.calc_service.stringToDate(ele.date_reception);
      res_dlc = (dlc.getTime() - date_reception.getTime()) / (1000 * 60 * 60 * 24)
    }


    ele.nom = ele.nom.split('<br>').join('_')
    ele.categorie_tva = ele.categorie_tva.split('<br>').join(' ')
    let ingredient = new CIngredient(this.calc_service, this.service)

    ingredient.nom = ele.nom;
    ingredient.categorie_tva = ele.categorie_tva;
    ingredient.cost = ele.cost;
    ingredient.quantity = ele.quantity;
    ingredient.quantity_unity = ele.quantity_unity;

    const dialogRef = this.dialog.open(ModifIngComponent, {
      height: `${window.innerHeight}px`,
      width: `${window.innerWidth - window.innerWidth / 15}px`,
      data: {
        restaurant: this.restaurant,
        prop: this.prop,
        is_modif: true,
        ingredient: {
          /* cuisinee: ele.cuisinee, */
          nom: ele.nom,
          categorie: ele.categorie_tva,
          quantity: ele.quantity,
          quantity_unity: ele.quantity_unity,
          unity: ele.unity,
          unitary_cost: ele.cost,
          dlc: res_dlc,
          date_reception: ele.date_reception,
          base_ing: var_base_ing,
         /*  quantity_after_prep: ele.after_prep, */
          marge: ele.marge,
          vrac: ele.vrac
        }
      }
    });

  }

  suppIng(ele: {
    nom: string;
    categorie_tva: string;
    cost: number;
    cost_ttc: number;
    val_bouch: number;
    bef_prep: number;
    after_prep: number;
    quantity: number;
    quantity_unity: number;
    unity: string;
    cuisinee: string;
    date_reception: string;
    dlc: string;
  }) {
    let is_prep = false
    if (ele.cuisinee === 'oui') {
      is_prep = true
    }

    console.log(ele.nom);
    this.service.removeIngInBdd(ele.nom.split('<br>').join('_'), this.prop, this.restaurant, is_prep).then(() => {
      this._snackBar.open("l'ingrédient vient d'être supprimé de la base de donnée du restaurant", "fermer")
    }).catch(() => {
      this._snackBar.open("l'ingrédient n'a pas pu être supprimé de la base de donnée du restaurant", "fermer")
    });

    //on regénère la datasource 
    this.ingredients_displayed_br = this.ingredients_displayed_br.filter((ingredient) => ingredient.nom !== ele.nom.split('<br>').join('_'));

    const supp_event = new PageEvent();
    supp_event.length = this.ingredients_displayed_br.length;
    supp_event.pageSize = 6
    this.pageChangedFirst(supp_event);
  }

  pageChanged(event: PageEvent) {
    let datasource = [... this.ingredients_displayed_br];
    this.page_number = event.pageIndex;
    this.dataSource.data = datasource.splice(event.pageIndex * event.pageSize, event.pageSize);
  }

  pageChangedFirst(event: PageEvent) {
    let datasource = [... this.ingredients_displayed_br];
    this.page_number = 0;
    this.dataSource.data = datasource.splice(0, event.pageSize);
    this.paginator.firstPage();
  }
}
