import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppAlertesModule } from '../alertes/app.module';
import { AppBudgetModule } from '../budget/app.module';
import { AppAuthenModule } from '../authen/app.module';
import { AppStockModule } from '../stock/app.module';
import { AppFacturesModule } from '../factures/app.module';
import { RhModule } from '../rh/rh.module';
import { AppRoutingModule } from './app-routing.module';
import { AppDashboardComponent } from './app.dashboard/app.dashboard.component';
import { AppMainDashboardComponent } from './app.dashboard/app.main-dashboard/app.main-dashboard.component';
import { ProfilModule } from '../profil/profil.module';
import {MatMenuModule} from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge';
import { RecettesModule } from '../recettes/recettes.module';
import { AppAnalyseModule } from '../analyse/app.module';
import { AlertesService } from '../../../app/services/alertes/alertes.service';
import { ClientsModule } from '../clients/clients.module';
import { AppMessagerieModule } from '../messagerie/app.module';



@NgModule({
  declarations: [
    AppDashboardComponent,
    AppMainDashboardComponent,

  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    ClientsModule,
    AppAnalyseModule,
    AppAlertesModule,
    AppBudgetModule,
    AppStockModule,
    AppFacturesModule,
    RhModule,
    AppAuthenModule,
    ProfilModule,
    RecettesModule,
    MatMenuModule,
    MatBadgeModule,
    AppMessagerieModule
  ],
  exports: [
    AppDashboardComponent
  ],
  providers: [
    AlertesService
  ]
})
export class AppDashboardModule {}
