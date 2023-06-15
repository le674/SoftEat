import { NgModule } from '@angular/core';
import { AppMessagerieComponent  } from './app.messagerie/app.messagerie.component';
import { AppRoutingModule } from './app-routing.module';
import { AppMessageTemplateComponent } from './app.message.template/app.message.template.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppMessagerieDateTemplateComponent } from './app.messagerie.date.template/app.messagerie.date.template/app.messagerie.date.template.component';

@NgModule({
  declarations: [
    AppMessagerieComponent,
    AppMessageTemplateComponent,
    AppMessagerieDateTemplateComponent
  ],
  imports:[ 
    AppRoutingModule,
    CommonModule,
    FormsModule
  ],
  exports: [
    AppMessagerieComponent,
    AppMessageTemplateComponent
  ],
  providers: [],
})
export class AppMessagerieModule {}
