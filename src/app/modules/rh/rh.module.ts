import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RhRoutingModule } from './rh-routing.module';
import { AppRhComponent } from './app.rh/app.rh.component';
import { CalendarComponent } from './app.rh/calendar/calendar.component';
import { HbarComponent } from './app.rh/hbar/hbar.component';
import { EventFormComponent } from './app.rh/event-form/event-form.component';


@NgModule({
  declarations: [
    AppRhComponent,
    CalendarComponent,
    HbarComponent,
    EventFormComponent
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
