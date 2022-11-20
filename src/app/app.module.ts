import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppAlertesModule } from './modules/alertes/app.module';
import { AppAnalyseModule } from './modules/analyse/app.module';
import { AppAuthenModule } from './modules/authen/app.module';
import { AppAuthoModule } from './modules/autho/app.module';
import { AppBudgetModule } from './modules/budget/app.module';
import { AppFacturesModule } from './modules/factures/app.module';
import { AppStockModule } from './modules/stock/app.module';
import { AppAcceuilModule } from './modules/acceuil/app.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { AppDashboardModule } from './modules/dashboard/app.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    //import des différent module propre à chacune des pages de l'application
    AppDashboardModule,
    AppAcceuilModule,
    AppAuthoModule,
    // permet d'initialiser les services firebase à utiliser une fois dans
    //le app.module les objet de classe FirebaseApp contiendrons alors la configuration pour l'api firebase présent dans l'environnement
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
