import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppModulesFacturesFeuilleUploadComponent} from './app.modules.factures.feuille/app.modules.factures.feuille.upload/app.modules.factures.feuille.upload.component';
import { AppModulesFacturesFeuilleListComponent } from './app.modules.factures.feuille/app.modules.factures.feuille.list/app.modules.factures.feuille.list.component';

//permet de rediriger les personne aux urls ci-dessous vers les components correspondants
const routes: Routes = [
  {
    path: 'factures/upload',
    component: AppModulesFacturesFeuilleUploadComponent
  },
  {
    path: 'factures/list',
    component: AppModulesFacturesFeuilleListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppModulesFacturesAppRoutingModuleRoutingModule { }
