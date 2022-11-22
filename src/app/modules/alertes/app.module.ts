import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppAlertesComponent } from './app.alertes/app.alertes.component';

@NgModule({
  declarations: [
    AppAlertesComponent
  ],
  imports: [ CommonModule ],
  exports: [
    AppAlertesComponent
  ],
  providers: [],
})
export class AppAlertesModule {}
