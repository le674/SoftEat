import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStockComponent } from './app.stock/app.stock.component';
import { AppConsoComponent } from './app.conso/app.conso.component';
import {MatTableModule} from '@angular/material/table'; 
import { CIngredient } from 'src/app/interfaces/ingredient';

@NgModule({
  declarations: [
    AppStockComponent,
    AppConsoComponent
  ],
  imports: [ 
    CommonModule,
    MatTableModule
   ],
  exports: [
    AppStockComponent,
    AppConsoComponent
  ],
  providers: [
    CIngredient
  ],
})
export class AppStockModule {}
