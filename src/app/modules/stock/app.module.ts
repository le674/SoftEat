import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStockComponent } from './app.stock/app.stock.component';

@NgModule({
  declarations: [
    AppStockComponent
  ],
  imports: [ CommonModule ],
  exports: [
    AppStockComponent
  ],
  providers: [],
})
export class AppStockModule {}
