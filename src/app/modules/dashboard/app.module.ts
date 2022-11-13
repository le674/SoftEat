import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDashboardComponent } from './app.dashboard/app.dashboard.component';
import { AppAnalyseModule } from '../analyse/app.module';
import { AppAlertesModule } from '../alertes/app.module';
import { AppBudgetModule } from '../budget/app.module';
import { AppStockModule } from '../stock/app.module';
import { AppFacturesModule } from '../factures/app.module';
import { RhModule } from '../rh/rh.module';
import { AppRoutingModule } from './app-routing.module';



@NgModule({
  declarations: [
    AppDashboardComponent
  ],
  imports: [ 
    AppRoutingModule,
    CommonModule,
    AppAnalyseModule,
    AppAlertesModule,
    AppBudgetModule,
    AppStockModule,
    AppFacturesModule,
    RhModule 
  ],
  exports: [
    AppDashboardComponent
  ],
  providers: []
})
export class AppDashboardModule {}
