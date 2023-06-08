import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog'; 
import { CalendarService } from './app.rh/calendar-view/calendar-data.service';
import { BrowserModule } from '@angular/platform-browser';
import { DayPilotModule } from 'daypilot-pro-angular';
import { HttpClientModule } from '@angular/common/http';
import { RhRoutingModule } from './rh-routing.module';
import { AppRhComponent } from './app.rh/app.rh.component';
import { HbarComponent } from './app.rh/hbar/hbar.component';
import { NavbarComponent } from './app.rh/navbar/navbar.component';
import { EventFormComponent } from './app.rh/event-form/event-form.component';
import { CalendarViewComponent } from './app.rh/calendar-view/calendar-view.component';

@NgModule({
  declarations: [
    AppRhComponent, 
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
    CalendarViewComponent
  ],
  providers: [
    CalendarService
  ]
})
export class RhModule { }
