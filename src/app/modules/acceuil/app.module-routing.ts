import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentAcceuil } from './app.component.acceuil/app.component.acceuil';

const routes: Routes = [
  {
    path: 'accueil',
    component: ComponentAcceuil
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppModuleRoutingModule { }
