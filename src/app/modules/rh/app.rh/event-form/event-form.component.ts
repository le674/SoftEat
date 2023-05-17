import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void {
  }
  

  rows: Row[] = [];

  addRow(main: string, preferred: string, common: string): void {
    const newRow: Row = { main, preferred, common };
    this.rows.push(newRow);
  }

  deleteRow(index: number): void {
    this.rows.splice(index, 1);
  }

  onClickAdd(main: string, preferred: string, common: string): void {
    this.addRow(main, preferred, common);
  }
}

  export interface Row {
    main: string;
    preferred: string;
    common: string;
  }
