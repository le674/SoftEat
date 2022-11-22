import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RhRoutingModule } from './rh-routing.module';
import { AppRhComponent } from './app.rh/app.rh/app.rh.component';


@NgModule({
  declarations: [
    AppRhComponent
  ],
  imports: [
    CommonModule,
    RhRoutingModule
  ],
  exports: [
    AppRhComponent
  ]
})
export class RhModule { }
