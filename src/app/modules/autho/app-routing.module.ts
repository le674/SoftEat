import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppAuthoComponent } from './app.autho/app.autho.component';

const routes: Routes = [
  {
    path:'autho',
    component: AppAuthoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
