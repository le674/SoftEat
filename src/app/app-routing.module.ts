import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectionComponent } from './modules/acceuil/app.component.acceuil/connection/connection.component';
import { AppDashboardComponent } from './modules/dashboard/app.dashboard/app.dashboard.component';
import { AuthGuard } from './services/auth.guard';
const routes: Routes = [
  {
    path:'',
    redirectTo:'accueil',
    pathMatch:'full'
   },
   { path: 'sign-in', component: ConnectionComponent},
   { path: 'dashboard', component: AppDashboardComponent, canActivate: [AuthGuard]}
   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 

