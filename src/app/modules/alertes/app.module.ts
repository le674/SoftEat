import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppAlertesComponent } from './app.alertes/app.alertes.component';
import {MatTabsModule} from '@angular/material/tabs'; 
import {  MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppAlertesComponent
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
