import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppAuthoComponent } from './app.autho/app.autho.component';
import { AppRoutingModule } from './app-routing.module';
import { InteractionRestaurantService } from './app.autho/interaction-restaurant.service';
import { AppConfigueComponent } from './app.configue/app.configue.component';
import { AppModalModule } from './app.modals/app.modal.module'
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select'; 
import {MatTableModule} from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import {MatSnackBarModule} from '@angular/material/snack-bar'; 
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { AddConfigueSalaryComponent } from './app.configue/add.configue.salary/add.configue.salary.component';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    AppAuthoComponent,
    AppConfigueComponent,
    AddConfigueSalaryComponent
  ],
  imports: [ 
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    AppModalModule
   ],
  exports: [
    AppAuthoComponent
  ],
  providers: [
    InteractionRestaurantService
  ]
})
export class AppAuthoModule {}
