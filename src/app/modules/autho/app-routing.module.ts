import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/services/auth.guard';
import { AppAuthoComponent } from './app.autho/app.autho.component';
import { AppConfigueComponent } from './app.configue/app.configue.component';

const routes: Routes = [
  {
    path:'autho',
    component: AppAuthoComponent, canActivate: [AuthGuard]
  },
  {
    path:'autho/configuration',
    component: AppConfigueComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
