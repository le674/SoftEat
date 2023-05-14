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


@NgModule({
  declarations: [
    ClientsComponent,
    ModalModifComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ClientsRoutingModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
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
