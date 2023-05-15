import { NgModule } from '@angular/core';
import { AppMessagerieComponent  } from './app.messagerie/app.messagerie.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppMessagerieComponent
  ],
  imports:[ 
    AppRoutingModule,
    CommonModule
  ],
  exports: [
    AppMessagerieComponent
  ],
  providers: [],
})
export class AppMessagerieModule {}
