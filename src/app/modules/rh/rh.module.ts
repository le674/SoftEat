import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog'; 
import { SchedulerDataService } from './app.rh/calendar/scheduler-data.service';
import { CalendarService } from './calendar-view/calendar-data.service';
import { BrowserModule } from '@angular/platform-browser';
import { CalendarComponent } from './app.rh/calendar/calendar.component';
import { DayPilotModule } from 'daypilot-pro-angular';
import { HttpClientModule } from '@angular/common/http';
import { RhRoutingModule } from './rh-routing.module';
import { AppRhComponent } from './app.rh/app.rh.component';
import { HbarComponent } from './app.rh/hbar/hbar.component';
import { NavbarComponent } from './app.rh/navbar/navbar.component';
import { EventFormComponent } from './app.rh/event-form/event-form.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';

@NgModule({
  declarations: [
    AppRhComponent, 
    CalendarComponent,
    HbarComponent,
    NavbarComponent,
    EventFormComponent,
    CalendarViewComponent
  ],
  imports: [
    CommonModule,
    RhRoutingModule,
    FormsModule,
    MatDialogModule,
    BrowserModule,
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
    CalendarService
  ]
})
export class RhModule { }
