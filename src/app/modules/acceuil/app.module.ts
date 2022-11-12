import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponentAcceuilComponent } from './app.component.acceuil/app.component.acceuil.component';

@NgModule({
  declarations: [
  ],
  imports: [ CommonModule, AppComponentAcceuil, AppModuleRoutingModule],
  exports: [],
  providers: [],
})
export class AppAlertesModule {}
