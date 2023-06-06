import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})

export class EventFormComponent implements OnInit {
  @ViewChild('addPersonnel') addPersonnelInput!: ElementRef<HTMLInputElement>;
  @ViewChild('addEvent') addEventInput!: ElementRef<HTMLInputElement>;
  @ViewChild('addLieu') addLieuInput!: ElementRef<HTMLInputElement>;
  @ViewChild('addPrisePoste') addPrisePosteInput!: ElementRef<HTMLInputElement>;
  @ViewChild('addFinPoste') addFinPosteInput!: ElementRef<HTMLInputElement>;
  @ViewChild('addRepeter') addRepeterSelect!: ElementRef<HTMLSelectElement>;
  constructor() { }

  ngOnInit(): void {
  }
  


  rows: Row[] = [];

  addRow(personnel: string, event: string, lieu: string,
        prisePoste: string, finPoste: string, repeter: string): void {
    const newRow: Row = { personnel, event, lieu, prisePoste, finPoste, repeter };
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

  onClickAdd(personnel: string, event: string, lieu: string,
    prisePoste: string, finPoste: string, repeter: string): void {
    if (!this.isFieldFilled(this.addPersonnelInput) ||
        !this.isFieldFilled(this.addLieuInput) ||
        !this.isFieldFilled(this.addPrisePosteInput) ||
        !this.isFieldFilled(this.addFinPosteInput) ||
        !this.isFieldFilled(this.addRepeterSelect)) {
        // Show the popup or perform any required validation logic
        alert("Renseignez les champs obligatoires : Personnel, Lieu, Prise et Fin de Poste, Répéter l'évènement.");
        return;
    }
    this.addRow(personnel, event, lieu, prisePoste, finPoste, repeter);
    this.resetFormFields();
  }

  resetFormFields(): void {
    this.addPersonnelInput.nativeElement.value = '';
    this.addEventInput.nativeElement.value = '';
    this.addLieuInput.nativeElement.value = '';
    this.addPrisePosteInput.nativeElement.value = '';
    this.addFinPosteInput.nativeElement.value = '';
    this.addRepeterSelect.nativeElement.value = '';
  }
}

export interface Row {
  personnel: string;
  event?: string;
  lieu: string;
  prisePoste: string;
  finPoste: string;
  repeter: string;
}
