import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '../../../../../app/services/common/common.service';
import { MatTableDataSource } from '@angular/material/table';
import { Client, DisplayedClient } from '../../../../../app/interfaces/client';
import { Router, UrlTree } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ModalModifComponent } from './app.clients.modals/app.client.modal.modif/modal.modif/modal.modif.component';
import { ClientCalculService } from 'src/app/services/clients/client-calcul.service';
import { ModalMsgComponent } from './app.clients.modals/app.client.modal.msg/modal.msg/modal.msg.component';
import { ModalGaspComponent } from './app.clients.modals/app.client.modal.gasp/modal.gasp/modal.gasp.component';
import { Unsubscribe } from 'firebase/firestore';
import { Subscription, throwError } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { InteractionBddFirestore } from 'src/app/interfaces/interaction_bdd';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit, OnDestroy {
  @Input() clients:string | null;
  public write:boolean;
  public windows_screen_mobile: boolean;
  public displayedColumns: string[] = ['name', 'surname', 'email', 'number',
    'adress', 'waste_alert', "promotions", 'order_number', 'actions'];
  public size: string;
  public _clients: Array<Client>;
  public displayed_client: Array<DisplayedClient>;
  public dataSource: MatTableDataSource<DisplayedClient>;
  private page_number: number;
  private url: UrlTree;
  private router: Router;
  private prop: string;
  private restaurant: string;
  private req_clients!:Unsubscribe;
  private clients_sub!:Subscription;
  private path_to_client: Array<string>;
  public visibles: Array<boolean>;

  constructor(public mobile_service: CommonService, router: Router,
    private client_calcul_service: ClientCalculService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar, private firestore:FirebaseService) {
    this.displayed_client = [];
    this._clients = [];
    this.path_to_client = [];
    this.visibles = [];
    this.page_number = 1;
    this.router = router;
    this.prop = "";
    this.restaurant = "";
    this.windows_screen_mobile = this.mobile_service.getMobileBreakpoint("user");
    this.size = "";
    this.dataSource = new MatTableDataSource(this.displayed_client);
    this.prop = "";
    this.restaurant = "";
    this.url = this.router.parseUrl(this.router.url);
    this.clients = null;
    this.write = false;
  }
  ngOnDestroy(): void {
    if(this.req_clients){
      this.req_clients();
    }
    if(this.clients_sub){
      this.clients_sub.unsubscribe();
    }
  }
  ngOnInit(): void {
    if(this.clients !== null){
      if(this.clients.includes("w")) this.write = true;
      if(this.clients.includes("r")){
        this.displayed_client = [];
        let user_info = this.url.queryParams;
        this.prop = user_info["prop"];
        this.restaurant = user_info["restaurant"];
        this.path_to_client = Client.getPathsToFirestore(this.prop, this.restaurant);
        this.req_clients = this.firestore.getFromFirestoreBDD(this.path_to_client, Restaurant, null);
         this.clients_sub = this.firestore.getFromFirestore().subscribe((clients:Array<InteractionBddFirestore>) => {
          this._clients = clients as Array<Client>;
          this.displayed_client = this.client_calcul_service.clientToDisClient(this._clients);
          const first_event = new PageEvent();
          first_event.length = this._clients.length;
          first_event.pageSize = 6;
          this.pageChanged(first_event);
        })
      }
    }
  }
  pageChanged(event: PageEvent) {
    let datasource = [... this.displayed_client];
    this.page_number = event.pageIndex;
    this.dataSource.data = datasource.splice(event.pageIndex * event.pageSize, event.pageSize);
  }
  // Gestion de l'accordéon
  getVisible(i: number): boolean {
    return this.visibles[i];
  }
  changeArrow(arrow_index: number) {
    this.visibles[arrow_index] = !this.visibles[arrow_index];
  }
  modifUser(client: DisplayedClient) {
    
    const dialogRef = this.dialog.open(ModalModifComponent, {
      height: `850px`,
      width: `900px`,
      data: {
        restaurant: this.restaurant,
        prop: this.prop,
        client: client,
        clients: this.clients
      }
    })
  }
  promMsg() {
    const dialogRef = this.dialog.open(ModalMsgComponent,{
      height: `800px`,
      width: `600px`,
    })
  }
  reducGaspMsg() {
    const dialogRef = this.dialog.open(ModalGaspComponent,{
      height: `800px`,
      width: `600px`,
      data: {
        restaurant: this.restaurant,
        prop: this.prop
      }
    })
  }
  suppUser(dis_client: DisplayedClient) {
    const client = this._clients.find((client) => client.number === dis_client.number);
    if (client !== undefined) {
      this.firestore.removeFirestoreBDD(client.id, this.path_to_client).then(() => {
        this._snackBar.open("le client vient d'être supprimé", "fermer");
      }).catch((e) => {
        this._snackBar.open("nous n'avons pas réussit à supprimer le client", "fermer");
        const err = new Error(e); 
        return throwError(() => err).subscribe((error) => {
          console.log(error);
        });
      });
    }
  }
}
