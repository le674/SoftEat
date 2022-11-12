import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentAcceuil } from './app.component.acceuil/app.component.acceuil';
import { AppModuleRoutingModule } from './app.module-routing';

@NgModule({
  declarations: [
  ],
  imports: [NgModule, CommonModule, ComponentAcceuil, AppModuleRoutingModule],
  exports: [],
  providers: [],
})
export class AppAlertesModule {}
