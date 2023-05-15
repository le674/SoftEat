import { NgModule } from '@angular/core';
import { AppMessagerieComponent  } from './app.messagerie/app.messagerie.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppMessagerieComponent
  ],
  imports:[ 
    AppRoutingModule,
  ],
  exports: [
    AppMessagerieComponent
  ],
  providers: [],
})
export class AppMessagerieModule {}
