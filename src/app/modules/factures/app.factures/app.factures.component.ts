import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router, UrlTree } from '@angular/router';
import { CIngredient } from 'src/app/interfaces/ingredient';
import { FacturePdfService } from 'src/app/services/factures/facture_pdf/facture-pdf.service';
import { IngredientsInteractionService } from 'src/app/services/menus/ingredients-interaction.service';
import { CalculService } from 'src/app/services/menus/menu.calcul/menu.calcul.ingredients/calcul.service';
import { FactureImgService } from 'src/app/services/factures/facture_img/facture-img.service';
import { FactureLoadComponent } from './app.factures.load/facture-load/facture-load.component';
import { AddIngComponent } from '../../stock/app.stock/app.stock.modals/add-ing/add.ing/add.ing.component';
import { ModifIngComponent } from './app.factures.modif/modif.ing/modif.ing.component';
import { FactureSharedService } from 'src/app/services/factures/facture_shared/facture-shared.service';
import { MatRadioChange } from '@angular/material/radio';

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
  private ingredient:boolean;

  private ingredients_br: Array<CIngredient>;
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

  public ingredients_displayed_br_tmp: Array<{
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
    public dialog: MatDialog, private calc_service: CalculService, private _snackBar:MatSnackBar,
    private service_facture_pdf:FacturePdfService, private service_facture_img:FactureImgService,
    private service_factue_shared:FactureSharedService) { 
    this.page_number = 0; 
    this.router = router;  
    this.ingredients_displayed_br = [];
    this.ingredients_displayed_br_tmp = [];
    this.prop = "";
    this.restaurant = "";
    this.dataSource = new MatTableDataSource(this.ingredients_displayed_br);
    this.url = this.router.parseUrl(this.router.url);
    this.ingredients_br = [];
    this.ingredient = true;
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
        this.service_facture_pdf.parseFacture(url_pdf).then((parsed_pdf) => {
          let p_ingredients = this.service_factue_shared.convertParsedLstToIngs(parsed_pdf, this.prop, this.restaurant)
          p_ingredients.then((ingredients) => {
            this.ingredients_br = ingredients;
            for (let ingredient of ingredients) {
              const add_to_tab = {
                nom: ingredient.nom.split('_').join(" "),
                categorie_tva: ingredient.categorie_tva,
                cost: ingredient.cost,
                cost_ttc: ingredient.cost_ttc, // si le cout a changé dans la nouvelle facture ont calcule un cout moyen 
                quantity: ingredient.quantity,
                quantity_unity: ingredient.quantity_unity,
                unity: ingredient.unity_unitary,
                date_reception: ingredient.date_reception.toLocaleString(),
                dlc: ingredient.dlc.toLocaleString()
              }
              this.ingredients_displayed_br.push(add_to_tab);
            }
            this.ingredients_displayed_br_tmp = this.ingredients_displayed_br;
            this.dataSource.data = this.ingredients_displayed_br;
          })
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
        const dialog_ref = this.dialog.open(FactureLoadComponent,{
          height: "400px",
          width: "400px",
          data: {
            url: url_img,
            type: "image"
          }
        })
      }
    }
  }

  revertModif(event:MouseEvent) {
   this.ingredients_displayed_br = this.ingredients_displayed_br_tmp;
   this.dataSource.data =  this.ingredients_displayed_br_tmp;
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
    let dlc = null;
    let res_dlc = 0;
    let var_base_ing: Array<{ name: string; quantity_unity: number; quantity: number; unity: string; cost: number }> = [];
    if((ele.dlc !== undefined) && (ele.dlc !== "")){
     dlc = this.calc_service.stringToDate(ele.dlc);
    }

    if ((ele.date_reception !== undefined) && (ele.date_reception !== "")) {
      const date_reception = this.calc_service.stringToDate(ele.date_reception);
      if(dlc !== null){
        res_dlc = (dlc.getTime() - date_reception.getTime()) / (1000 * 60 * 60 * 24)
      }
    }

    if(ele.nom !== undefined){
      ele.nom = ele.nom;
    }
    else{
      ele.nom = "";
    }
    if(ele.categorie_tva !== undefined){
      ele.categorie_tva = ele.categorie_tva;
    }
    else{
      ele.categorie_tva = "";
    }
    if(ele.quantity === undefined){
      ele.quantity = 0;
    }
    if(ele.quantity_unity === undefined){
      ele.quantity_unity = 0;
    }
    if(ele.cost === undefined){
      ele.cost = 0;
    }
    if(ele.date_reception === undefined){
      ele.date_reception = ""
    }
    if(ele.marge === undefined){
      ele.marge = 0;
    }
    if(ele.vrac === undefined){
      ele.vrac = "non";
    }
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
          nom: ele.nom,
          categorie: ele.categorie_tva,
          quantity: ele.quantity,
          quantity_unity: ele.quantity_unity,
          unity: ele.unity,
          unitary_cost: ele.cost_ttc,
          dlc: res_dlc,
          date_reception: ele.date_reception,
          base_ing: var_base_ing,
          marge: ele.marge,
          vrac: ele.vrac
        }
      }
    });
    dialogRef.componentInstance.myEvent.subscribe((ingredient:CIngredient) => {
       this.ingredients_br = this.ingredients_br.filter((_ingredient) => _ingredient.nom !== ingredient.nom);
       let _ingredients = this.ingredients_displayed_br.filter((_ingredient) => ingredient.nom.split("_").join(" ") !== _ingredient.nom);
       this.ingredients_br.push(ingredient);
       _ingredients.push({
        nom: ingredient.nom.split("_").join(" "),
        categorie_tva: ingredient.categorie_tva,
        cost: ingredient.cost,
        cost_ttc: ingredient.cost_ttc,
        quantity: ingredient.quantity,
        quantity_unity: ingredient.quantity_unity,
        unity: ingredient.unity,
        date_reception: ingredient.date_reception.toLocaleString(),
        dlc: ingredient.dlc.toLocaleString()
       });
       this.ingredients_displayed_br = _ingredients;
       this.dataSource.data =  this.ingredients_displayed_br;
    })
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
    //on regénère la datasource 
    if(ele.nom === undefined){
      this.ingredients_displayed_br = this.ingredients_displayed_br.filter((ingredient) => ingredient.nom !== undefined);
      this.ingredients_br = this.ingredients_br.filter((ingredient) => ingredient.nom !== undefined);
    }
    else{
      const name = ele.nom;
      this.ingredients_displayed_br = this.ingredients_displayed_br.filter((ingredient) => ingredient.nom !== name);
      this.ingredients_br = this.ingredients_br.filter((ingredient) => ingredient.nom !== name.split(" ").join("_"));
    }
    const supp_event = new PageEvent();
    supp_event.length = this.ingredients_displayed_br.length;
    supp_event.pageSize = 6
    this.pageChangedFirst(supp_event);
  }

  addIngredients($event: MouseEvent) {
   if(this.ingredient){
    let is_added = true;
    for(let ingredient of this.ingredients_br){
      this.service.setIngInBdd(ingredient,this.prop, this.restaurant).catch((e) => {
        is_added = false;
        console.log(e);
      }).then(() => {
        this.ingredients_br = [];
        this.ingredients_displayed_br = [];
        this.dataSource.data = this.ingredients_displayed_br;
      });
     }
     if(!is_added){
      this._snackBar.open("les ingrédients n'ont pas pu être ajouté à la base de donnée veuilliez contacter SoftEat", "fermer");
     }
     else{
      this._snackBar.open("les ingrédients viennent d'être ajoutés à la base de donnée", "fermer");
     }
   }
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
  radioChange(event:MatRadioChange){
    if(event.value === "ing"){
      this.ingredient = true;
    }
    else{
      this.ingredient = false;
    }
  }
}
