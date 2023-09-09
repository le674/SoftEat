import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalleComponent } from './salle/salle.component';
import {MatInputModule} from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from './table/table.component';
import { FecComponent } from './fec/fec.component';
import { FecTableComponent } from './fec/fec.table/fec.table.component';
import { FecMobileComponent } from './fec/fec.mobile/fec.mobile.component';
import { MatListModule } from '@angular/material/list';
import { FecModifRecordComponent } from './fec/fec.modif-record/fec.modif-record.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { FecModifLettrageComponent } from './fec/fec.modif.lettrage/fec.modif.lettrage.component';

@NgModule({
  declarations: [
    SalleComponent,
    TableComponent,
    FecComponent,
    FecTableComponent,
    FecMobileComponent,
    FecModifRecordComponent,
    FecModifLettrageComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule,
    MatListModule,
    MatDialogModule,
    MatTooltipModule,
    MatButtonModule,
    MatExpansionModule
  ],
  exports: [
    SalleComponent,
    FecComponent
  ],
})
export class CaisseModule { }
