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
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { getAuth } from 'firebase/auth';
import { AuthentificationService } from './services/authentification.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    //import des différent module propre à chacune des pages de l'application
    AppAlertesModule,
    AppAnalyseModule,
    AppAuthenModule,
    AppAuthoModule,
    AppBudgetModule,
    AppFacturesModule,
    AppStockModule,
    AngularFireAuthModule,
    AppAcceuilModule,
    // permet d'initialiser les services firebase à utiliser une fois dans
    //le app.module les objet de classe FirebaseApp contiendrons alors la configuration pour l'api firebase présent dans l'environnement
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    AppRoutingModule,
    
  ],
  providers: [AuthentificationService],
  bootstrap: [AppComponent]
})

export class AppModule {
  
  
}
