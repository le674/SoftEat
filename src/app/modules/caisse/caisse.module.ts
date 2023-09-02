import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalleComponent } from './salle/salle.component';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { TableComponent } from './table/table.component';
import { FecComponent } from './fec/fec.component';
@NgModule({
  declarations: [
    SalleComponent,
    TableComponent,
    FecComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule
  ],
  exports: [
    SalleComponent,
    FecComponent
  ],
})
export class CaisseModule { }
