import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef, AfterViewInit} from '@angular/core';

// Pour bouton "ajouter évènement" et faire apparaître le form en pop-up
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog for opening a dialog
import { EventFormComponent } from '../event-form/event-form.component'; // Import the EventFormComponent


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {
  


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

  ngAfterViewInit(): void {
  }

}
