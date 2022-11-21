import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 import { ConnectionComponent } from './modules/acceuil/app.component.acceuil/connection/connection.component';
const routes: Routes = [
  {
    path:'',
    redirectTo:'accueil',
    pathMatch:'full'
   },
   { path: 'sign-in', component: ConnectionComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 

