import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStockComponent } from './app.stock/app.stock.component';
import { AppConsoComponent } from './app.conso/app.conso.component';

@NgModule({
  declarations: [
    AppStockComponent,
    AppConsoComponent
  ],
  imports: [ CommonModule ],
  exports: [
    AppStockComponent,
    AppConsoComponent
  ],
  providers: [],
})
export class AppStockModule {}
