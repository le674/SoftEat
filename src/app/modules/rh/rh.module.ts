import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RhRoutingModule } from './rh-routing.module';
import { AppRhComponent } from './app.rh/app.rh.component';
import { CalendarComponent } from './app.rh/calendar/calendar.component';
import { HbarComponent } from './app.rh/hbar/hbar.component';
import { NavbarComponent } from './app.rh/navbar/navbar.component';


@NgModule({
  declarations: [
  
  
    AppRhComponent,
            CalendarComponent,
            HbarComponent,
            NavbarComponent
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
