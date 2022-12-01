import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppAuthoComponent } from './app.autho/app.autho.component';
import { AppRoutingModule } from './app-routing.module';
import { InteractionRestaurantService } from './app.autho/interaction-restaurant.service';
import { AppConfigueComponent } from './app.configue/app.configue.component';
import { AppModalModule } from './app.configue/app.modal/app.modal.module'
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppAuthoComponent,
    AppConfigueComponent
  ],
  imports: [ 
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    AppModalModule
   ],
  exports: [
    AppAuthoComponent
  ],
  providers: [
    InteractionRestaurantService,
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ]
})
export class AppAuthoModule {}
