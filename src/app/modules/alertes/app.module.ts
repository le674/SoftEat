import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppAlertesComponent } from './app.alertes/app.alertes.component';
import {MatTabsModule} from '@angular/material/tabs'; 

@NgModule({
  declarations: [
    AppAlertesComponent
  ],
  imports:[ 
    CommonModule,
    MatTabsModule 
  ],
  exports: [
    AppAlertesComponent
  ],
  providers: [],
})
export class AppAlertesModule {}
