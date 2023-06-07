import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
  constructor() { }

  /* Les deux premières méthodes ajoutent automatiquement des majuscules sur 
  le premier caractère des champs Personnel, Evenement et Lieu pour uniformiser */
  ngOnInit(): void {
    const inputFields: HTMLInputElement[] = [
      this.addPersonnelInput.nativeElement,
      this.addEventInput.nativeElement,
      this.addLieuInput.nativeElement,
    ];
  
    inputFields.forEach((input) => {
      input.addEventListener('input', () => {
        this.truncateInputValue(input);
      });
    });
  }

  truncateInputValue(input: HTMLInputElement): void {
    input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1);
  }

  /* Les 2 méthodes suivantes permettent de rendre l'espace occupé par la date responsive*/ 
  ngAfterViewInit(): void {
    this.calculateInputWidth();
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

  deleteRow(index: number): void {
    this.rows.splice(index, 1);
  }

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

  resetFormFields(): void {
    this.addPersonnelInput.nativeElement.value = '';
    this.addMotifInput.nativeElement.value = '';
    this.addEventInput.nativeElement.value = '';
    this.addLieuInput.nativeElement.value = '';
    this.addPrisePosteInput.nativeElement.value = '';
    this.addFinPosteInput.nativeElement.value = '';
    this.addRepeterSelect.nativeElement.value = '';
  }
}

export interface Row {
  personnel: string;
  motif: string;
  event?: string;
  lieu: string;
  prisePoste: string;
  finPoste: string;
  repeter: string;
}
