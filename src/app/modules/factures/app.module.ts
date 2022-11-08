import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppModulesFacturesFeuilleComponent } from './app.modules.factures.feuille/app.modules.factures.feuille.component';
import { AppModulesFacturesFeuilleUploadComponent } from './app.modules.factures.feuille/app.modules.factures.feuille.upload/app.modules.factures.feuille.upload.component';
import { AppModulesFacturesFeuilleListComponent } from './app.modules.factures.feuille/app.modules.factures.feuille.list/app.modules.factures.feuille.list.component';
import { AppModulesFacturesAppRoutingModuleRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppModulesFacturesFeuilleComponent,
    AppModulesFacturesFeuilleUploadComponent,
    AppModulesFacturesFeuilleListComponent
  ],
  imports: [ CommonModule,
             AppModulesFacturesAppRoutingModuleRoutingModule],
  exports: [AppModulesFacturesFeuilleUploadComponent],
  providers: [],
})
export class AppFacturesModule {}
