import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DayPilot } from "daypilot-pro-angular";
import { CalendarService } from "../calendar-view/calendar-data.service";
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})

export class EventFormComponent implements OnInit, AfterViewInit {
  @ViewChild('addPersonnel') addPersonnelInput!: ElementRef<HTMLInputElement>;
  @ViewChild('addMotif') addMotifInput!: ElementRef<HTMLInputElement>;
  @ViewChild('addEvent') addEventInput!: ElementRef<HTMLInputElement>;
  @ViewChild('addLieu') addLieuInput!: ElementRef<HTMLInputElement>;
  @ViewChild('addPrisePoste') addPrisePosteInput!: ElementRef<HTMLInputElement>;
  @ViewChild('addFinPoste') addFinPosteInput!: ElementRef<HTMLInputElement>;
  @ViewChild('addRepeter') addRepeterSelect!: ElementRef<HTMLSelectElement>;
  dateWidth = '150px'; // Default width
  newEvent?: DayPilot.EventData;

  constructor(private calendar: CalendarService, public dialogRef: MatDialogRef<EventFormComponent>) {
    this.dialogRef = dialogRef;
  }

  /* Les deux premières méthodes ajoutent automatiquement des majuscules sur 
  le premier caractère du champ Evenement uniformiser */
  ngOnInit(): void {
    setTimeout(() => {
      const inputFields: HTMLInputElement[] = [
        this.addEventInput.nativeElement
      ];

      inputFields.forEach((input) => {
        input.addEventListener('input', () => {
          this.truncateInputValue(input);
        });
      });
    });
  }

  truncateInputValue(input: HTMLInputElement): void {
    input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1);
  }

  /* Les 2 méthodes suivantes permettent de rendre l'espace occupé par la date responsive*/
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.calculateInputWidth();
    });
  }

  calculateInputWidth(): void {
    const inputElement = this.addFinPosteInput.nativeElement;
    const contentWidth = inputElement.scrollWidth + 'px';
    this.dateWidth = contentWidth;
  }

  rows: Row[] = [];

  addRow(personnel: string, motif: string, event: string, lieu: string,
    prisePoste: string, finPoste: string, repeter: string): void {
    const newRow: Row = { personnel, motif, event, lieu, prisePoste, finPoste, repeter };
    this.rows.push(newRow);
  }
  resetFormFields(): void {
    this.addPersonnelInput.nativeElement.value = '';
    this.addMotifInput.nativeElement.value = '';
    this.addEventInput.nativeElement.value = '';
    this.addLieuInput.nativeElement.value = '';
    this.addPrisePosteInput.nativeElement.value = '';
    this.addFinPosteInput.nativeElement.value = '';
    this.addRepeterSelect.nativeElement.value = '';
  }
  deleteRow(index: number): void {
    this.rows.splice(index, 1);
  }

  //Permet de définir les champs obligatoires
  isFieldFilled(inputRef: ElementRef<HTMLInputElement | HTMLSelectElement>): boolean {
    const value = inputRef.nativeElement.value;
    if (inputRef.nativeElement.tagName.toLowerCase() === 'select') {
      return value !== '';
    }
    return value.trim() !== '';
  }

  onClickAdd(personnel: string, motif: string, event: string, lieu: string,
    prisePoste: string, finPoste: string, repeter: string): void {
    if (!this.isFieldFilled(this.addPersonnelInput) ||
      !this.isFieldFilled(this.addMotifInput) ||
      !this.isFieldFilled(this.addLieuInput) ||
      !this.isFieldFilled(this.addPrisePosteInput) ||
      !this.isFieldFilled(this.addFinPosteInput) ||
      !this.isFieldFilled(this.addRepeterSelect)) {
      // Show the popup or perform any required validation logic
      alert("Renseignez les champs obligatoires marqués par un astérisque (*)");
      return;
    }
    this.addRow(personnel, motif, event, lieu, prisePoste, finPoste, repeter);
    this.resetFormFields();
  }


  async saveRows(): Promise<void> {
  // Retrieve the information of the rows
  for (const row of this.rows) {
    this.newEvent = {
      start: row.prisePoste + ":00",
      end: row.finPoste + ":00",
      text: row.event,
      id: 'newEventId',
      tags: this.getMotifLabel(row.motif),
      resource: row.lieu
    };
    console.log('Personnel:', row.personnel);
    const userPath: string | null = await this.calendar.getPath(row.personnel);
    console.log("Path : ", userPath);
    if (userPath) {
      await this.addEvent(userPath, this.newEvent); // Wait for the event to be added
    }
  }
  this.closeDialog();
}

  
  
  getMotifLabel(value: string): string {
    switch (value) {
      case 'motif-option1':
        return 'Travail';
      case 'motif-option2':
        return 'Congés';
      case 'motif-option3':
        return 'Entretien';
      case 'motif-option4':
        return 'Maladie';
      default:
        return '';
    }
  }

  getRepeterLabel(value: string): string {
    switch (value) {
      case 'repeter-option1':
        return 'Non';
      case 'repeter-option2':
        return 'Cette semaine';
      case 'repeter-option3':
        return 'Ce mois';
      case 'repeter-option4':
        return '?';
      default:
        return '';
    }
  }

  addEvent(userId: string, newEvent: DayPilot.EventData): void {
    const prop = 'foodandboost_prop'; // Assuming the property name is fixed
    this.calendar.add_event(prop, userId, newEvent);
  }
  
  closeDialog(): void {
    this.dialogRef.close(); // Close the dialog
  }
}

export interface Row {
  personnel: string;
  motif: string;
  event: string;
  lieu: string;
  prisePoste: string;
  finPoste: string;
  repeter: string;
}
