import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppAlertesModule } from './modules/alertes/app.module';
import { AppAuthenModule } from './modules/authen/app.module';
import { AppAuthoModule } from './modules/autho/app.module';
import { AppBudgetModule } from './modules/budget/app.module';
import { AppFacturesModule } from './modules/factures/app.module';
import { AppStockModule } from './modules/stock/app.module';
import { AppAcceuilModule } from './modules/acceuil/app.module';
import { AppDashboardModule } from './modules/dashboard/app.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { AuthentificationService } from './services/authentification.service';
import { HttpClientModule } from '@angular/common/http';
import { getAuth } from 'firebase/auth';
import { provideAuth } from '@angular/fire/auth';
import { RecettesModule } from './modules/recettes/recettes.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppDashboardModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    //import des différent module propre à chacune des pages de l'application
    AppAlertesModule,
    AppAuthenModule,
    AppAuthoModule,
    AppBudgetModule,
    AppFacturesModule,
    AppStockModule,
    AppAcceuilModule,
    AppAuthoModule,
    RecettesModule,
    // permet d'initialiser les services firebase à utiliser une fois dans
    //le app.module les objet de classe FirebaseApp contiendrons alors la configuration pour l'api firebase présent dans l'environnement
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    AppRoutingModule

  ],
  providers: [AuthentificationService],
  bootstrap: [AppComponent]
})

export class AppModule {


}
