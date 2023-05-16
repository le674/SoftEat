import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppMessagerieModule } from './app.module';

const routes: Routes = [
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
