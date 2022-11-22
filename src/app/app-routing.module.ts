import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectionComponent } from './modules/acceuil/app.component.acceuil/connection/connection.component';
import { AppAuthoComponent } from './modules/autho/app.autho/app.autho.component';
import { AuthGuard } from './services/auth.guard';
const routes: Routes = [
  {
    path:'',
    redirectTo:'accueil',
    pathMatch:'full'
   },
   { path: 'sign-in', component: ConnectionComponent},
   { path: 'autho', component: AppAuthoComponent, canActivate: [AuthGuard]}
   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 

