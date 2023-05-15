import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppAlertesComponent } from './app.alertes/app.alertes.component';
import {MatTabsModule} from '@angular/material/tabs'; 
import {  MatButtonModule } from '@angular/material/button';
import { AppMessagerieComponent } from './app.messagerie/app.messagerie.component';

@NgModule({
  declarations: [
    AppAlertesComponent,
    AppMessagerieComponent
  ],
  imports:[ 
    CommonModule,
    MatButtonModule,
    MatTabsModule 
  ],
  exports: [
    AppAlertesComponent
  ],
  providers: [],
})
export class AppAlertesModule {}
