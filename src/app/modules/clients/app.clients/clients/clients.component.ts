import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../../app/services/common/common.service';
import { MatTableDataSource } from '@angular/material/table';
import { Client, DisplayedClient } from '../../../../../app/interfaces/client';
import { Router, UrlTree } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ModalModifComponent } from './app.clients.modals/app.client.modal.modif/modal.modif/modal.modif.component';
import { ClientCalculService } from 'src/app/services/clients/client-calcul.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  public windows_screen_mobile: boolean;
  public displayedColumns: string[] = ['name', 'surname', 'email', 'number',
  'adress','waste_alert', "promotions",'order_number', 'actions'];
  public size:string;
  public clients: Array<Client>;
  public displayed_client: Array<DisplayedClient>;
  public dataSource:  MatTableDataSource<DisplayedClient>;
  private page_number: number;
  private url: UrlTree;
  private router: Router;
  private prop: string;
  private restaurant: string;
  public visibles: Array<boolean>;
  constructor(public mobile_service:CommonService, router: Router,
    private client_service:ClientsService, private client_calcul_service:ClientCalculService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) {
    this.page_number = 1;
    this.router = router;
    this.prop = "";
    this.restaurant = "";
    this.windows_screen_mobile = this.mobile_service.getMobileBreakpoint("user");
    this.visibles = [];
    this.size = "";
    this.clients = [];
    this.displayed_client = [];
    this.dataSource = new MatTableDataSource(this.displayed_client);
    this.prop = "";
    this.restaurant = "";
    this.url = this.router.parseUrl(this.router.url);
   }
  ngOnInit(): void{
    this.displayed_client = [];
    let user_info = this.url.queryParams;
    this.prop = user_info["prop"];
    this.restaurant = user_info["restaurant"];
    this.client_service.getClients(this.prop, this.restaurant).then((clients) => {
      this.clients = clients;
      this.displayed_client = this.client_calcul_service.clientToDisClient(clients);
      const first_event = new PageEvent();
      first_event.length = this.clients.length;
      first_event.pageSize = 6
      this.pageChanged(first_event);
    })
  }
  pageChanged(event: PageEvent) {
    let datasource = [... this.displayed_client];
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
  modifUser(client:DisplayedClient){
    const dialogRef = this.dialog.open(ModalModifComponent, {
      height: `850px`,
      width: `500px`,
      data: {
        restaurant: this.restaurant,
        prop: this.prop,
        client: client,
        clients: this.clients
      }
    })
  }
  suppUser(dis_client:DisplayedClient){
    const client = this.clients.find((client) => client.number === dis_client.number);
    if(client !== undefined){
      this.client_service.suppClient(this.prop, this.restaurant, client).then(() => {
        this._snackBar.open("le client vient d'être supprimé", "fermer");
      }).catch(() => {
        this._snackBar.open("nous n'avons pas réussit à supprimer le client", "fermer");
      });
    }
  }
}
