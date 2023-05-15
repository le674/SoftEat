import { NgModule } from '@angular/core';
import { AppMessagerieComponent  } from './app.messagerie/app.messagerie.component';
import { AppRoutingModule } from './app-routing.module';
import { AppMessageTemplateComponent } from './app.message.template/app.message.template.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppMessagerieComponent,
    AppMessageTemplateComponent
  ],
  imports:[ 
    AppRoutingModule,
    CommonModule
  ],
  exports: [
    AppMessagerieComponent,
    AppMessageTemplateComponent
  ],
  providers: [],
})
export class AppMessagerieModule {}
