import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppAuthoComponent } from './app.autho/app.autho.component';
import { AppRoutingModule } from './app-routing.module';
import { InteractionRestaurantService } from './app.autho/interaction-restaurant.service';

@NgModule({
  declarations: [
    AppAuthoComponent

  ],
  imports: [ 
    CommonModule,
    AppRoutingModule
   ],
  exports: [AppAuthoComponent],
  providers: [
    InteractionRestaurantService
  ],
})
export class AppAuthoModule {}
