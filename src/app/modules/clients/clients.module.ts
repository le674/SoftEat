import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsComponent } from './app.clients/clients/clients.component';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { ModalModifComponent } from './app.clients/clients/app.clients.modals/app.client.modal.modif/modal.modif/modal.modif.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ModalGaspComponent } from './app.clients/clients/app.clients.modals/app.client.modal.gasp/modal.gasp/modal.gasp.component';
import { ModalMsgComponent } from './app.clients/clients/app.clients.modals/app.client.modal.msg/modal.msg/modal.msg.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import {MatDividerModule} from '@angular/material/divider'; 
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    ClientsComponent,
    ModalModifComponent,
    ModalGaspComponent,
    ModalMsgComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ClientsRoutingModule,
    MatTooltipModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatDividerModule,
    MatOptionModule,
    MatSelectModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatRadioModule,
    MatListModule
  ],
  exports: [
    ClientsComponent
  ]
})
export class ClientsModule { }
