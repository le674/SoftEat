import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { FirebaseApp, initializeApp } from '@angular/fire/app';
import { getDatabase, ref, onValue, get } from 'firebase/database';
import { DayPilot } from "daypilot-pro-angular";
import { CalendarService } from "../calendar-view/calendar-data.service";
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css'],
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

  Categories!: String[];
  Serveurs!: { nom: String, email: String }[];
  Gerants!: { nom: String, email: String }[];
  Rh!: { nom: String, email: String }[];
  Autres!: { nom: String, email: String }[];
  firebaseApp: FirebaseApp | undefined;
  newEvent?: DayPilot.EventData; 
  constructor(private calendar: CalendarService, public dialogRef: MatDialogRef<EventFormComponent>, firebaseApp: FirebaseApp) {
    this.dialogRef = dialogRef;
  }


  /* Les deux premières méthodes ajoutent automatiquement des majuscules sur 
  le premier caractère du champ Evenement uniformiser */
  ngOnInit(): void {

    this.Categories = ['Serveurs', 'Rh', 'Gérants', 'Autres'];

    this.Serveurs = [];
    this.Gerants = [];
    this.Rh = [];
    this.Autres = [];

    this.fetchUser();
    const inputFields: HTMLInputElement[] = [
      this.addPersonnelInput.nativeElement,
      this.addEventInput.nativeElement,
      this.addLieuInput.nativeElement,
    ];

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

  addRow(
    personnel: string,
    motif: string,
    event: string,
    lieu: string,
    prisePoste: string,
    finPoste: string,
    repeter: string
  ): void {
    const newRow: Row = {
      personnel,
      motif,
      event,
      lieu,
      prisePoste,
      finPoste,
      repeter,
    };
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

  isFieldFilled(
    inputRef: ElementRef<HTMLInputElement | HTMLSelectElement>
  ): boolean {

    const value = inputRef.nativeElement.value;
    if (inputRef.nativeElement.tagName.toLowerCase() === 'select') {
      return value !== '';
    }
    return value.trim() !== '';
  }

  onClickAdd(
    personnel: string,
    motif: string,
    event: string,
    lieu: string,
    prisePoste: string,
    finPoste: string,
    repeter: string
  ): void {
    if (
      !this.isFieldFilled(this.addPersonnelInput) ||
      !this.isFieldFilled(this.addMotifInput) ||
      !this.isFieldFilled(this.addLieuInput) ||
      !this.isFieldFilled(this.addPrisePosteInput) ||
      !this.isFieldFilled(this.addFinPosteInput) ||
      !this.isFieldFilled(this.addRepeterSelect)
    ) {
      // Show the popup or perform any required validation logic
      alert('Renseignez les champs obligatoires marqués par un astérisque (*)');
      return;
    }
    this.addRow(personnel, motif, event, lieu, prisePoste, finPoste, repeter);
    this.resetFormFields();
  }

  async saveRows(): Promise<void> {
    for (const row of this.rows) {
      this.newEvent = {
        start: row.prisePoste + ":00",
        end: row.finPoste + ":00",
        text: row.event,
        id: 'newEventId',
        tags: this.getMotifLabel(row.motif),
        resource: row.lieu
      };
      const repetitionOption = row.repeter;
      const startDate = new Date(row.prisePoste);
      const endDate = new Date(row.finPoste);
      switch (repetitionOption) {
        case 'repeter-option2': // Répeter cette semaine
          // Check if the start and end dates are the same day
          if (this.isSameDay(startDate, endDate)) {
            const weekStart = new Date(startDate);
            const weekEnd = new Date(startDate);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Set to Monday
            weekEnd.setDate(weekStart.getDate() + 5); // Set to Saturday

            const currentDate = new Date(weekStart);
            while (currentDate <= weekEnd) {
              this.newEvent.start = this.formatDate(currentDate) + 'T' + row.prisePoste.split('T')[1] + ':00';
              this.newEvent.end = this.formatDate(currentDate) + 'T' + row.finPoste.split('T')[1] + ':00';

              const userPath: string | null = await this.calendar.getPath(row.personnel);
              if (userPath) {
                await this.addEvent(userPath, this.newEvent);
              }

              currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
            }
          } else {
            // Handle the case where the start and end dates are not the same day
            console.log('Event spans multiple days. Skipping repetition.');
          }
          break;
        case 'repeter-option3': // Répeter chaque semaine
          // Check if the start and end dates are the same day
          if (this.isSameDay(startDate, endDate)) {
            const currentMonth = startDate.getMonth();
            const firstDayOfMonth = new Date(startDate.getFullYear(), currentMonth, 1);
            const lastDayOfMonth = new Date(startDate.getFullYear(), currentMonth + 1, 0);

            const currentDate = new Date(firstDayOfMonth);
            while (currentDate <= lastDayOfMonth) {
              if (currentDate.getDay() === startDate.getDay()) {
                this.newEvent.start = this.formatDate(currentDate) + 'T' + row.prisePoste.split('T')[1] + ':00';
                this.newEvent.end = this.formatDate(currentDate) + 'T' + row.finPoste.split('T')[1] + ':00';

                const userPath: string | null = await this.calendar.getPath(row.personnel);
                if (userPath) {
                  await this.addEvent(userPath, this.newEvent);
                }
              }
              currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
            }
          } else {
            // Handle the case where the start and end dates are not the same day
            console.log('Event spans multiple days. Skipping repetition.');
          }
          break;
        case 'repeter-option4': // Répéter chaque jour
          // Check if the start and end dates are the same day
          if (this.isSameDay(startDate, endDate)) {
            const currentMonth = startDate.getMonth();
            const firstDayOfMonth = new Date(startDate.getFullYear(), currentMonth, 1);
            const lastDayOfMonth = new Date(startDate.getFullYear(), currentMonth + 1, 0);

            const currentDate = new Date(firstDayOfMonth);
            while (currentDate <= lastDayOfMonth) {
              // Check if the current date is a weekday or Saturday (Monday to Saturday)
              if (currentDate.getDay() >= 1 && currentDate.getDay() <= 6) {
                this.newEvent.start = this.formatDate(currentDate) + 'T' + row.prisePoste.split('T')[1] + ':00';
                this.newEvent.end = this.formatDate(currentDate) + 'T' + row.finPoste.split('T')[1] + ':00';

                const userPath: string | null = await this.calendar.getPath(row.personnel);
                if (userPath) {
                  await this.addEvent(userPath, this.newEvent);
                }
              }

              // Move to the next day
              currentDate.setDate(currentDate.getDate() + 1);

              // Check if the next day is Sunday
              if (currentDate.getDay() === 0) {
                // Skip Sunday and move to the next day (Monday)
                currentDate.setDate(currentDate.getDate() + 1);
              }
            }
          } else {
            // Handle the case where the start and end dates are not the same day
            console.log('Event spans multiple days. Skipping repetition.');
          }
          break;
        default: // Ne pas répéter
          const userPath: string | null = await this.calendar.getPath(row.personnel);
          if (userPath) {
            await this.addEvent(userPath, this.newEvent);
          }
          break;
      }
    }
    this.closeDialog();
  }

  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const daysOffset = firstDayOfYear.getDay() - 1;
    const firstMondayOfYear = new Date(date.getFullYear(), 0, 1 + (daysOffset <= 0 ? 7 : daysOffset));
    const daysSinceFirstMonday = Math.floor((date.getTime() - firstMondayOfYear.getTime()) / 86400000);
    return Math.ceil((daysSinceFirstMonday + firstMondayOfYear.getDay() + 1) / 7);
  }

  private getDateFromWeekNumber(weekNumber: number, dayOfWeek: number): Date {
    const year = new Date().getFullYear();
    const januaryFirst = new Date(year, 0, 1);
    const daysOffset = januaryFirst.getDay() - 1;
    const firstMondayOfYear = new Date(year, 0, 1 + (daysOffset <= 0 ? 7 : daysOffset));
    const firstDayOfDesiredWeek = new Date(year, 0, (weekNumber - 1) * 7 + firstMondayOfYear.getDate());
    const desiredDay = new Date(firstDayOfDesiredWeek.setDate(firstDayOfDesiredWeek.getDate() + dayOfWeek - 1));
    return desiredDay;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
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

  async fetchUser() {
    const db = getDatabase(this.firebaseApp);

    const userPath = '/users/foodandboost_prop/';
    const usersRef = ref(db, userPath);

    try {
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const userIDs = Object.keys(usersData);

        for (const userID of userIDs) {
          const userPrenomRef = ref(db, `${userPath}/${userID}/prenom`);
          const userNomRef = ref(db, `${userPath}/${userID}/nom`);
          const userRoleRef = ref(db, `${userPath}/${userID}/role`);
          const userMailRef = ref(db, `${userPath}/${userID}/email`);

          const prenomSnapshot = await get(userPrenomRef);
          const nomSnapshot = await get(userNomRef);
          const nomComplet = prenomSnapshot.val() + " " + nomSnapshot.val();

          const roleSnapshot = await get(userRoleRef);
          const role = roleSnapshot.val();
          const mail = (await get(userMailRef)).val();

          if (nomComplet) {
            if (role == 'gerant') {
              this.Gerants.push({ nom: nomComplet, email: mail });
            } else if (role == 'rh') {
              this.Rh.push({ nom: nomComplet, email: mail });
            } else if (role == 'serveur') {
              this.Serveurs.push({ nom: nomComplet, email: mail });
            } else {
              this.Autres.push({ nom: nomComplet, email: mail });
            }
          }
        }
      } else {
        console.log('No user data found.');
      }
    } catch (error) {
      console.error('An error occurred while retrieving user data:', error);
    }
  }

  getCategoryUsers(category: String): { nom: String, email: String; }[] {
    switch (category) {
      case 'Serveurs':
        return this.Serveurs;
      case 'Gérants':
        return this.Gerants;
      case 'Rh':
        return this.Rh;
      case 'Autres':
        return this.Autres;
      default:
        return [];
    }
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
