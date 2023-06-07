import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {DayPilot, DayPilotSchedulerComponent} from 'daypilot-pro-angular';
import {SchedulerDataService} from './scheduler-data.service';


// Pour bouton "ajouter évènement" et faire apparaître le form en pop-up
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog for opening a dialog
import { EventFormComponent } from '../event-form/event-form.component'; // Import the EventFormComponent


@Component({
  selector: 'app-calendar',
  template: `<daypilot-scheduler [config]="config" [events]="events" #scheduler></daypilot-scheduler>`,
  styles: [``]
})
export class CalendarComponent implements AfterViewInit {

  @ViewChild('scheduler')
  scheduler!: DayPilotSchedulerComponent;

  events: DayPilot.EventData[] = [];

  config: DayPilot.SchedulerConfig = {
    timeHeaders: [
      {groupBy: "Week"},
      {groupBy: "Day", format: "ddd d MMMM"}
    ],
    scale: "Day",
    days: 7,
    cellWidth:120,
    startDate: "2023-10-01",
    rowHeaderColumns: [
      {text: "Name", display: "name", sort: "name"},
      {text: "Capacity", display: "capacity", sort: "capacity"}
    ],
    timeRangeSelectedHandling: "Enabled",
    onTimeRangeSelected: async (args) => {
      const dp = args.control;
      const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
      dp.clearSelection();
      if (modal.canceled) { return; }
      dp.events.add({
        start: args.start,
        end: args.end,
        id: DayPilot.guid(),
        resource: args.resource,
        text: modal.result
      });
    },
    contextMenu: new DayPilot.Menu({
      items: [
        { text: "Edit...",
          onClick: async args => {
            const e = args.source;
            this.editEvent(e);
          }
        },
        { text: "Delete",
          onClick: args => {
            const e = args.source;
            this.scheduler.control.events.remove(e);
          }
        }
      ]
    }),
    onBeforeEventRender: args => {
      args.data.areas = [
        {
          right: 5,
          top: 10,
          width: 16,
          height: 16,
          symbol: "assets/daypilot.svg#minichevron-down-2",
          fontColor: "#aaa",
          backColor: "#fff",
          action: "ContextMenu",
          style: "border: 1px solid #aaa",
          visibility: "Hover"
        }
      ];
    },
    bubble: new DayPilot.Bubble({
      onLoad: args => {
        args.html = DayPilot.Util.escapeHtml(args.source.data.description || "");
      }
    }),
    onEventClick: args => {
      this.editEvent(args.e);
    },
    eventMoveHandling: "Update",
    onEventMoved: (args) => {
      args.control.message("Event moved: " + args.e.text());
    },
    eventResizeHandling: "Update",
    onEventResized: (args) => {
      args.control.message("Event resized: " + args.e.text());
    },
    treeEnabled: true,
  };

  constructor(private ds: SchedulerDataService) {
  }

  async editEvent(e: DayPilot.Event): Promise<void> {
    const form = [
      { name: "Name", id: "text", type: "text"},
      { name: "Description", id: "description", type: "textarea"}
    ];
    const modal = await DayPilot.Modal.form(form, e.data);
    if (modal.canceled) {
      return;
    }
    const updated = modal.result;
    this.scheduler.control.events.update(updated);
  }

  ngAfterViewInit(): void {
    this.ds.getResources().subscribe(result => this.config.resources = result);

    const from = this.scheduler.control.visibleStart();
    const to = this.scheduler.control.visibleEnd();
    this.ds.getEvents(from, to).subscribe(result => {
      this.events = result;
    });
  }
  constructor (private dialog: MatDialog){
    
  }

  ngOnInit(): void {
    console.log("ngOnInit")
    
  }

  openEventForm(): void {
    const dialogRef = this.dialog.open(EventFormComponent, {
      width: '85vw', height: '85vh', // Set the width of the dialog as per your requirements
      // You can also configure other properties of the dialog, such as height, position, etc.
    });
}