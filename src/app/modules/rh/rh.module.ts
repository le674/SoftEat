import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulerDataService } from './app.rh/calendar/scheduler-data.service';
import { CalendarDataService } from './calendar-view/calendar-data.service';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CalendarComponent } from './app.rh/calendar/calendar.component';
import { DayPilotModule } from 'daypilot-pro-angular';
import { HttpClientModule } from '@angular/common/http';
import { RhRoutingModule } from './rh-routing.module';
import { AppRhComponent } from './app.rh/app.rh.component';
import { HbarComponent } from './app.rh/hbar/hbar.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';

@NgModule({
  declarations: [
    AppRhComponent,
    CalendarComponent,
    HbarComponent,
    CalendarViewComponent
  ],
  imports: [
    CommonModule,
    RhRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    DayPilotModule
  ],
  exports: [
    AppRhComponent,
    CalendarComponent,
    CalendarViewComponent
  ],
  providers: [
    SchedulerDataService,
    CalendarDataService
  ]
})
export class RhModule { }
