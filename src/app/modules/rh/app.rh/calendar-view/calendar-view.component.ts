import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  DayPilot,
  DayPilotCalendarComponent,
  DayPilotMonthComponent,
  DayPilotNavigatorComponent
} from "daypilot-pro-angular";
import { CalendarService } from "./calendar-data.service";
import { from } from 'rxjs'

import { MatDialog } from '@angular/material/dialog'; // Import MatDialog for opening a dialog
import { EventFormComponent } from '../event-form/event-form.component'; // Import the EventFormComponent


@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent implements AfterViewInit {
  @ViewChild("day") day!: DayPilotCalendarComponent;
  @ViewChild("week") week!: DayPilotCalendarComponent;
  @ViewChild("month") month!: DayPilotMonthComponent;
  @ViewChild("navigator") nav!: DayPilotNavigatorComponent;

  events: DayPilot.EventData[] = [];

  date = DayPilot.Date.today();

  configNavigator: DayPilot.NavigatorConfig = {
    showMonths: 1,
    cellWidth: 25,
    cellHeight: 25,
    onVisibleRangeChanged: args => {
      this.loadEvents();
    }
  };

  selectTomorrow() {
    this.date = DayPilot.Date.today().addDays(1);
  }

  changeDate(date: DayPilot.Date): void {
    this.configDay.startDate = date;
    this.configWeek.startDate = date;
    this.configMonth.startDate = date;
  }

  configDay: DayPilot.CalendarConfig = {
    onBeforeEventRender: args => {
      if (args.data.tags === "important") {
        args.data.barColor = "#ff0000"; // red color for important events
        args.data.html = "<span class='important-event'>" + args.data.text + "</span>";
        args.data.toolTip = "This is an important event.";
      } else {
        args.data.html = args.data.text;
        args.data.toolTip = "This is a regular event.";
      }
    }
  };

  configWeek: DayPilot.CalendarConfig = {
    viewType: "Week",
    onTimeRangeSelected: async (args) => {
      const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
      const dp = args.control;
      dp.clearSelection();
      if (!modal.result) { return; }
      dp.events.add(new DayPilot.Event({
        start: args.start,
        end: args.end,
        id: DayPilot.guid(),
        text: modal.result//modifier ?
      }));
    },
    onBeforeEventRender: args => {
      if (args.data.tags === "Maladie") {
        args.data.barColor = "#ff0000"; // duration bar
        args.data.barBackColor = "rgba(255, 0, 0, 0.5)"; // duration bar background
        //args.data.backColor = "rgba(255, 0, 0, 0.2)"; // background 
        //args.data.toolTip = "This is an important event.";
      } else if (args.data.tags === "Congés") {
        args.data.barColor = "#ffa500";
        args.data.barBackColor = "rgba(255, 165, 0, 0.5)"; // duration bar background
        //args.data.toolTip = "This is a regular event.";
      } else if (args.data.tags === "Entretien") {
        args.data.barColor = "#7db52e";
        args.data.barBackColor = "rgba(121, 181, 46, 0.5)"; // duration bar background
        //args.data.toolTip = "This is a regular event.";
      } else {
        //args.data.toolTip = "This is a regular event.";
      }
      let resourceHtml = args.data.resource ? "<div style='font-style: italic;'>" + args.data.resource + "</div>" : "";
      args.data.html = "<span class='event'><strong>" + args.data.tags + "</strong><br>" +
        resourceHtml + "<br>" +
        args.data.text + "</span>";
    }
  };

  configMonth: DayPilot.MonthConfig = {
    onBeforeEventRender: args => {
      if (args.data.tags === "important") {
        args.data.barColor = "#ff0000"; // red color for important events
        args.data.html = "<span class='important-event'>" + args.data.text + "</span>";
        args.data.toolTip = "This is an important event.";
      } else {
        args.data.html = args.data.text;
        args.data.toolTip = "This is a regular event.";
      }
    }

  };

  constructor(private ds: CalendarService, private dialog: MatDialog) {
    this.viewWeek();
  }

  ngAfterViewInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    const froom = this.nav.control.visibleStart();
    const to = this.nav.control.visibleEnd();
    from(this.ds.getEvents(froom, to, "foodandboost_prop", "0uNzmnBI0jYYspF4wNXdRd2xw9Q2")).subscribe(result => {
      this.events = result;
    });
  }

  viewDay(): void {
    this.configNavigator.selectMode = "Day";
    this.configDay.visible = true;
    this.configWeek.visible = false;
    this.configMonth.visible = false;
  }

  viewWeek(): void {
    this.configNavigator.selectMode = "Week";
    this.configDay.visible = false;
    this.configWeek.visible = true;
    this.configMonth.visible = false;
  }

  viewMonth(): void {
    this.configNavigator.selectMode = "Month";
    this.configDay.visible = false;
    this.configWeek.visible = false;
    this.configMonth.visible = true;
  }
  addEvent(): void {
    this.ds.add_event('foodandboost_prop', '0uNzmnBI0jYYspF4wNXdRd2xw9Q2', {
      start: DayPilot.Date.today(),
      end: DayPilot.Date.today().addDays(1),
      text: 'New Event',
      id: 'newEventId',
      tags: 'conge',
    });
    this.loadEvents();
  }


  openEventForm(): void {
    const dialogRef = this.dialog.open(EventFormComponent, {
      width: '85vw',
      height: '85vh',
      // Set the width and height of the dialog as per your requirements
      // You can also configure other properties of the dialog, such as position, etc.
    });

    dialogRef.afterClosed().subscribe(result => {
      // This code block will be executed when the dialog is closed
      // You can perform any desired actions here
      console.log('Dialog closed with result:', result);
      // Call your method here that you want to be executed when the dialog is closed
      this.onDialogClosed();
    });
  }

  onDialogClosed(): void {
    // This method will be called when the dialog is closed
    // You can perform any desired actions here
    this.loadEvents();
    // Add your code here
  }

}


