import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalleComponent } from './salle/salle.component';
import {MatInputModule} from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { TableComponent } from './table/table.component';
import { FecComponent } from './fec/fec.component';
import { FecTableComponent } from './fec/fec.table/fec.table.component';

@NgModule({
  declarations: [
    SalleComponent,
    TableComponent,
    FecComponent,
    FecTableComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    MatExpansionModule
  ],
  exports: [
    SalleComponent,
    FecComponent
  ],
})
export class CaisseModule { }
