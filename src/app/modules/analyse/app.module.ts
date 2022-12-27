import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppAnalyseStockComponent } from './app.analyse-stock/app.analyse-stock.component';
import { AppAnalyseFreqComponent } from './app.analyse-freq/app.analyse-freq.component';
import { AppAnalyseTablesComponent } from './app.analyse-tables/app.analyse-tables.component';
import { AppAnalyseConsoComponent } from './app.analyse-conso/app.analyse-conso.component';
import { AppAnalyseCaComponent } from './app.analyse-ca/app.analyse-ca.component';
import { AppAnalyseMenuComponent } from './app.analyse-menu/app.analyse-menu.component';

@NgModule({
  declarations: [
    AppAnalyseStockComponent,
    AppAnalyseFreqComponent,
    AppAnalyseTablesComponent,
    AppAnalyseConsoComponent,
    AppAnalyseCaComponent,
    AppAnalyseMenuComponent
  ],
  imports: [ CommonModule ],
  exports: [
    AppAnalyseStockComponent,
    AppAnalyseFreqComponent,
    AppAnalyseTablesComponent,
    AppAnalyseConsoComponent,
    AppAnalyseCaComponent,
    AppAnalyseMenuComponent
  ],
  providers: [],
})
export class AppAnalyseModule {}
