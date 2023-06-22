import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppAuthoComponent } from './app.autho/app.autho.component';
import { AppRoutingModule } from './app-routing.module';
/* import { AppConfigueComponent } from './app.configue/app.configue.component'; */
import { AppModalModule } from './app.modals/app.modal.module'
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select'; 
import {MatTableModule} from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import {MatSnackBarModule} from '@angular/material/snack-bar'; 
import { MatButtonModule } from '@angular/material/button';
import { AddConfigueSalaryComponent } from './app.configue/add.configue.salary/add.configue.salary.component';
import { MatInputModule } from '@angular/material/input';
import { AddConfigueEmployeeComponent } from './app.configue/add.configue.employee/add.configue.employee/add.configue.employee.component';
import { MatListModule } from '@angular/material/list';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
//import { MobileUserDataComponent } from './app.configue/mobile.user.data/mobile.user.data/mobile.user.data.component';
@NgModule({
  declarations: [
    AppAuthoComponent,
   /*  AppConfigueComponent, */
    AddConfigueSalaryComponent,
    AddConfigueEmployeeComponent,
    //MobileUserDataComponent
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
    MatListModule,
    MatBottomSheetModule,
    AppModalModule
   ],
  exports: [
    AppAuthoComponent
  ],
  providers: [
  ]
})
export class AppAuthoModule {}
