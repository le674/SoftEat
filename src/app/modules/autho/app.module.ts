import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppAuthoComponent } from './app.autho/app.autho.component';
import { AppRoutingModule } from './app-routing.module';
import { InteractionRestaurantService } from './app.autho/interaction-restaurant.service';
import { AppConfigueComponent } from './app.configue/app.configue.component';
import { AppModalModule } from './app.configue/app.modal/app.modal.module'

@NgModule({
  declarations: [
    AppAuthoComponent,
    AppConfigueComponent
  ],
  imports: [ 
    CommonModule,
    AppRoutingModule,
    AppModalModule
   ],
  exports: [AppAuthoComponent],
  providers: [
    InteractionRestaurantService
  ],
})
export class AppAuthoModule {}
