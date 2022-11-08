import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppModulesFacturesFeuilleComponent } from './modules/factures/app.modules.factures.feuille/app.modules.factures.feuille.component';

const routes: Routes = [
  {
    path: 'factures',
    component: AppModulesFacturesFeuilleComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
