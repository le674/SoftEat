import { NgModule } from '@angular/core';
import { AppMessagerieComponent  } from './app.messagerie/app.messagerie.component';
import { AppRoutingModule } from './app-routing.module';
import { AppMessageTemplateComponent } from './app.message.template/app.message.template.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppMessagerieComponent,
    AppMessageTemplateComponent
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
