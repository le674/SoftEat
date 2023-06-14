import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
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
export class CalendarViewComponent implements AfterViewInit, OnInit {
  @ViewChild("day") day!: DayPilotCalendarComponent;
  @ViewChild("week") week!: DayPilotCalendarComponent;
  @ViewChild("month") month!: DayPilotMonthComponent;
  @ViewChild("navigator") nav!: DayPilotNavigatorComponent;
  users !: string;
  @Input() userRole!:string;

  constructor(private ds: CalendarService, private dialog: MatDialog) {
    this.viewWeek();
  }

  ngOnInit(): void {
    this.ds.currentData.subscribe(data => {
      console.log(data)
      this.users = data;
      this.loadEvents(this.users);
    });
  }


  moisEnTouteLettre = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet",
    "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  events: DayPilot.EventData[] = [];

  date = DayPilot.Date.today();

  bubble = new DayPilot.Bubble({
    zIndex: 500,
    onLoad: function (args) {
      const start = new Date(args.source.data.start);
      const end = new Date(args.source.data.end);

      const startTime =
        start.getHours().toString().padStart(2, '0') +
        ':' +
        start.getMinutes().toString().padStart(2, '0');
      const endTime =
        end.getHours().toString().padStart(2, '0') +
        ':' +
        end.getMinutes().toString().padStart(2, '0');

      let bubbleContent =

        '<div>' +
        '<strong>' +
        args.source.data.tags +
        '</strong><br>';

      if (args.source.data.resource) {
        bubbleContent += '<div>Lieu : ' + args.source.data.resource + '</div>';
      }

      bubbleContent +=
        '<div>Description : ' +
        args.source.data.text +
        '</div>' +
        '<div>' +
        startTime +
        ' - ' +
        endTime +
        '</div>';

      const duration = Math.floor(
        (end.getTime() - start.getTime()) / (1000 * 60)
      ); // Difference in minutes
      const durationHours = Math.floor(duration / 60);
      const durationMinutes = duration % 60;

      if (durationHours > 0 || durationMinutes > 0) {
        let durationText = '';

        if (durationHours > 0) {
          durationText += durationHours + ' heure';
          if (durationHours > 1) {
            durationText += 's';
          }
        }

        if (durationMinutes > 0) {
          if (durationText !== '') {
            durationText += ' ';
          }
          durationText += durationMinutes + ' minute';
          if (durationMinutes > 1) {
            durationText += 's';
          }
        }

        bubbleContent += '<div>Durée : ' + durationText + '</div>';
      }

      bubbleContent += '</div>';

      args.html = bubbleContent;
    },
  });

  configNavigator: DayPilot.NavigatorConfig = {
    showMonths: 1,
    cellWidth: 25,
    cellHeight: 25,
    onVisibleRangeChanged: args => {
      this.loadEvents(this.users);
    }
  };

  selectTomorrow() {
    this.date = DayPilot.Date.today().addDays(1);
  }

  previous(){
    if (this.configNavigator.selectMode == "Day"){
      this.date = this.date.addDays(-1);
      this.changeDate(this.date);
    }
    if (this.configNavigator.selectMode == "Week"){
      this.date = this.date.addDays(-7);
      this.changeDate(this.date);
    }
    if (this.configNavigator.selectMode == "Month"){
      this.date = this.date.addMonths(-1)
      this.changeDate(this.date);
    }
  }

  next(){
    if (this.configNavigator.selectMode == "Day"){
      this.date = this.date.addDays(1);
      this.changeDate(this.date);
    }
    if (this.configNavigator.selectMode == "Week"){
      this.date = this.date.addDays(7);
      this.changeDate(this.date);
    }
    if (this.configNavigator.selectMode == "Month"){
      this.date = this.date.addMonths(1)
      this.changeDate(this.date);
    }
  }
  changeDate(date: DayPilot.Date): void {
    this.configDay.startDate = date;
    this.configWeek.startDate = date;
    this.configMonth.startDate = date;
  }

  configDay: DayPilot.CalendarConfig = {
    locale : "fr-fr",
    eventMoveHandling : "Disabled",
    eventResizeHandling : "Disabled",
    eventArrangement : "SideBySide",
    bubble:this.bubble,
    contextMenu : new DayPilot.Menu({
      items: [
        {
          text:"Supprimer",
          image : "../../../../assets/images/trash.png",
          onClick: async (args) => { 
            var e = args.source;
            await this.ds.remove_event('foodandboost_prop', e.resource() , e.id()); 
            this.loadEvents(this.users);
          }
        }
      ]
    }),
    dayBeginsHour : 8,
    dayEndsHour : 24,
    onBeforeEventRender: args => {
      switch (args.data.tags) {
        case "Maladie":
          args.data.barColor = "#ff0000"; // duration bar color
          args.data.barBackColor = "rgba(255, 0, 0, 0.5)"; // duration bar background color
          //args.data.backColor = "rgba(255, 0, 0, 0.2)";
          break;
        case "Congés":
          args.data.barColor = "#ffa500";
          args.data.barBackColor = "rgba(255, 165, 0, 0.5)";
          break;
        case "Entretien":
          args.data.barColor = "#7db52e";
          args.data.barBackColor = "rgba(121, 181, 46, 0.5)";
          break;
        default: // Travail
          //args.data.toolTip = "This is a regular event.";
          break;
      }
      let resourceHtml = args.data.resource ? "<div style='font-style: italic;'>" + args.data.resource + "</div>" : "";
      args.data.html = "<span class='event'><strong>" + args.data.tags + "</strong><br>" +
        resourceHtml + "<br>" +
        args.data.text + "</span>";
    }
  };

  configWeek: DayPilot.CalendarConfig = {
    locale : "fr-fr",
    width : "110%",
    heightSpec : "Fixed",
    height:600,
    eventMoveHandling : "Disabled",
    eventResizeHandling : "Disabled",
    eventArrangement : "SideBySide",
    bubble:this.bubble,
    contextMenu : new DayPilot.Menu({
      items: [
        {
          text:"Supprimer", 
          image : "../../../../assets/images/trash.png",
          onClick: async (args) => { 
            var e = args.source;
            //console.log('e.resource() :', e.resource());
            await this.ds.remove_event('foodandboost_prop', e.resource() , e.id()); 
            this.loadEvents(this.users);
          }
        }
      ]
    }),    
    dayBeginsHour : 8,
    dayEndsHour : 24,
    viewType: "Week",
    onBeforeEventRender: args => {
      switch (args.data.tags) {
        case "Maladie":
          args.data.barColor = "#ff0000"; // duration bar color
          args.data.barBackColor = "rgba(255, 0, 0, 0.5)"; // duration bar background color
          //args.data.backColor = "rgba(255, 0, 0, 0.2)";
          break;
        case "Congés":
          args.data.barColor = "#ffa500";
          args.data.barBackColor = "rgba(255, 165, 0, 0.5)";
          break;
        case "Entretien":
          args.data.barColor = "#7db52e";
          args.data.barBackColor = "rgba(121, 181, 46, 0.5)";
          break;
        default: // Travail
          //args.data.toolTip = "This is a regular event.";
          break;
      }
      let resourceHtml = args.data.resource ? "<div style='font-style: italic;'>" + args.data.resource + "</div>" : "";
      args.data.html = "<span class='event'><strong>" + args.data.tags + "</strong><br>" +
        resourceHtml + "<br>" +
        args.data.text + "</span>";
    }
  };

  configMonth: DayPilot.MonthConfig = {
    locale : "fr-fr",
    eventMoveHandling : "Disabled",
    eventResizeHandling : "Disabled",
    bubble:this.bubble,
    contextMenu : new DayPilot.Menu({
      items: [
        {
          text:"Supprimer",
          image : "../../../../assets/images/trash.png", 
          onClick: async (args) => { 
            var e = args.source;
            await this.ds.remove_event('foodandboost_prop', e.resource() , e.id()); 
            this.loadEvents(this.users);
          }
        }
      ]
    }),    
    onBeforeEventRender: args => {
      switch (args.data.tags) {
        case "Maladie":
          args.data.barColor = "#ff0000"; // duration bar color
          args.data.barBackColor = "rgba(255, 0, 0, 0.5)"; // duration bar background color
          //args.data.backColor = "rgba(255, 0, 0, 0.2)";
          break;
        case "Congés":
          args.data.barColor = "#ffa500";
          args.data.barBackColor = "rgba(255, 165, 0, 0.5)";
          break;
        case "Entretien":
          args.data.barColor = "#7db52e";
          args.data.barBackColor = "rgba(121, 181, 46, 0.5)";
          break;
        default: // Travail
          //args.data.toolTip = "This is a regular event.";
          break;
      }
    }
  };

  

  ngAfterViewInit(): void {
    this.loadEvents("");
  }

  loadEvents(users : string): void {
    //const froom = this.nav.control.visibleStart();
    //const to = this.nav.control.visibleEnd();
    from(this.ds.getEventsFromAllUsers("foodandboost_prop", users)).subscribe(result => {
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
 
  //ouvre le form "ajouter un évènement"
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
  //recharge les évènements pour actualiser le calendrier à la fermeture du form
  onDialogClosed(): void {
    // This method will be called when the dialog is closed
    // You can perform any desired actions here
    this.loadEvents(this.users);
    // Add your code here
  }

}
