import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
/* import { DayPilot } from 'daypilot-pro-angular'; */
import { CalendarService } from '../calendar-view/calendar-data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  Categories!: string[];
  Serveurs!: { nom: string; selectionne: boolean; mail: string }[];
  Gerants!: { nom: string; selectionne: boolean; mail: string }[];
  Rh!: { nom: string; selectionne: boolean; mail: string }[];
  Autres!: { nom: string; selectionne: boolean; mail: string }[];
  firebaseApp: FirebaseApp | undefined;
/*   newEvent?: DayPilot.EventData; */
  constructor(
    private calendar: CalendarService,
    public dialogRef: MatDialogRef<EventFormComponent>,
    private snackBar: MatSnackBar
  ) {
    this.dialogRef = dialogRef;
  }

  /* Les deux premières méthodes ajoutent automatiquement des majuscules sur 
  le premier caractère du champ Evenement uniformiser */
  ngOnInit(): void {
    // Initialisation des catégories
    this.Categories = ['Serveurs', 'Rh', 'Gérants', 'Autres'];

    // Récupération des Serveurs depuis le stockage local
    const ServeursString = localStorage.getItem('Serveurs');
    if (ServeursString) {
      this.Serveurs = JSON.parse(ServeursString);
    }
    /// Récupération des Gérants depuis le stockage local
    const GerantString = localStorage.getItem('Gérants');
    if (GerantString) {
      this.Gerants = JSON.parse(GerantString);
    }
    // Récupération des Rh depuis le stockage local
    const RhString = localStorage.getItem('Rh');
    if (RhString) {
      this.Rh = JSON.parse(RhString);
    }
    // Récupération des Autres depuis le stockage local
    const AutresString = localStorage.getItem('Autres');
    if (AutresString) {
      this.Autres = JSON.parse(AutresString);
    }


    setTimeout(() => {
      // Ajouter un délai avant de configurer les écouteurs d'événements pour les champs de texte
      const inputFields: HTMLInputElement[] = [
        this.addEventInput.nativeElement,
      ];

      inputFields.forEach((input) => {
        input.addEventListener('input', () => {
          this.truncateInputValue(input);
        });
      });
    });
  }

  truncateInputValue(input: HTMLInputElement): void {
    // Mettre le premier caractère en majuscule
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
    // Ajouter tous les éléments mis dans le form
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
    // Remise à zéro des champs du form
    this.addPersonnelInput.nativeElement.value = '';
    this.addMotifInput.nativeElement.value = '';
    this.addEventInput.nativeElement.value = '';
    this.addLieuInput.nativeElement.value = '';
    this.addPrisePosteInput.nativeElement.value = '';
    this.addFinPosteInput.nativeElement.value = '';
    this.addRepeterSelect.nativeElement.value = '';
  }

  deleteRow(index: number): void {
    // Supprimer un évènement enregistré dans le form
    this.rows.splice(index, 1);
  }

  isFieldFilled(
    // Vérifier si l'élément est rempli
    inputRef: ElementRef<HTMLInputElement | HTMLSelectElement>
  ): boolean {
    const value = inputRef.nativeElement.value;
    if (inputRef.nativeElement.tagName.toLowerCase() === 'select') {
      return value !== '';
    }
    return value.trim() !== '';
  }

  onClickAdd(
    // Lorsqu'on clique sur le + pour ajouter l'évènement
    personnel: string,
    motif: string,
    event: string,
    lieu: string,
    prisePoste: string,
    finPoste: string,
    repeter: string
  ): void {
    if (
      // Vérifier si tous les champs obligatoires sont remplis
      !this.isFieldFilled(this.addPersonnelInput) ||
      !this.isFieldFilled(this.addMotifInput) ||
      !this.isFieldFilled(this.addLieuInput) ||
      !this.isFieldFilled(this.addPrisePosteInput) ||
      !this.isFieldFilled(this.addFinPosteInput) ||
      !this.isFieldFilled(this.addRepeterSelect)
    ) {
      // Show the popup or perform any required validation logic
      this.snackBar.open('Renseignez les champs obligatoires marqués par un astérisque (*)', 'Fermer');
      return;
    } else if (new Date(finPoste) < new Date(prisePoste)) {
      // Vérifier si la date de prise de poste est antérieure à la date de fin de poste
      this.snackBar.open('La date de fin de poste est antérieure à la date de prise de poste', 'Fermer');
      return;
    }
    this.addRow(personnel, motif, event, lieu, prisePoste, finPoste, repeter);
    this.resetFormFields();
  }

  async saveRows(): Promise<void> {
    // Sauvegarde de l'évènement
    /* for (const row of this.rows) {
      this.newEvent = {
        start: row.prisePoste + ':00',
        end: row.finPoste + ':00',
        text: row.lieu + ', ' + row.event, // la ', ' permet le parsing du text pour l'affichage lieu/description
        id: 'newEventId',
        tags: this.getMotifLabel(row.motif),
        resource: row.personnel,
      };
      const repetitionOption = row.repeter;
      const startDate = new Date(row.prisePoste);
      const endDate = new Date(row.finPoste);
      switch (repetitionOption) {
        case 'repeter-option2': // Répeter cette semaine
          // Check si l'évènement a lieu sur un seul jour (début et fin le même jour)
          if (this.isSameDay(startDate, endDate)) {
            const weekStart = new Date(startDate);
            const weekEnd = new Date(startDate);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Début de la semaine = lundi
            weekEnd.setDate(weekStart.getDate() + 6); // Fin de la semaine = samedi
            const currentDate = new Date(weekStart);
            while (currentDate < weekEnd) {
              const newEvent = { ...this.newEvent }; // Crée une nouvelle instance de newEvent (évite la duplication)
              newEvent.start =
                this.formatDate(currentDate) +
                'T' +
                row.prisePoste.split('T')[1] +
                ':00';
              newEvent.end =
                this.formatDate(currentDate) +
                'T' +
                row.finPoste.split('T')[1] +
                ':00';
              const userPath: string | null = await this.calendar.getPath(row.personnel);
              if (userPath) {
                this.addEvent(userPath, newEvent);
              }
              currentDate.setDate(currentDate.getDate() + 1); // Se déplace au jour suivant
            }
          } else {
            // Si le début et la fin d'évènement ont pas lieu le même jour 
            console.log('Event spans multiple days. Skipping repetition.');
          }
          break;
        case 'repeter-option3': // Répeter chaque semaine (du mois courrant de la date)
          // Check si l'évènement a lieu sur un seul jour (début et fin le même jour)
          if (this.isSameDay(startDate, endDate)) {
            const currentMonth = startDate.getMonth();
            const firstDayOfMonth = new Date(
              startDate.getFullYear(),
              currentMonth,
              1
            );
            const lastDayOfMonth = new Date(
              startDate.getFullYear(),
              currentMonth + 1,
              0
            );
            const currentDate = new Date(firstDayOfMonth);
            while (currentDate <= lastDayOfMonth) {
              if (currentDate.getDay() === startDate.getDay()) {
                const newEvent = { ...this.newEvent }; // Crée une nouvelle instance de newEvent (évite la duplication)
                newEvent.start =
                  this.formatDate(currentDate) +
                  'T' +
                  row.prisePoste.split('T')[1] +
                  ':00';
                newEvent.end =
                  this.formatDate(currentDate) +
                  'T' +
                  row.finPoste.split('T')[1] +
                  ':00';

                const userPath: string | null = await this.calendar.getPath(
                  row.personnel
                );
                if (userPath) {
                  await this.addEvent(userPath, newEvent);
                }
              }
              currentDate.setDate(currentDate.getDate() + 1); // Se déplace au jour suivant
            }
          } else {
            // Si le début et la fin d'évènement ont pas lieu le même jour 
            console.log('Event spans multiple days. Skipping repetition.');
          }
          break;
        case 'repeter-option4': // Répéter chaque jour (de travail du mois de la date d'évènement)
          // Check si l'évènement a lieu sur un seul jour (début et fin le même jour)
          if (this.isSameDay(startDate, endDate)) {
            const currentMonth = startDate.getMonth();
            const firstDayOfMonth = new Date(
              startDate.getFullYear(),
              currentMonth,
              1
            );
            const lastDayOfMonth = new Date(
              startDate.getFullYear(),
              currentMonth + 1,
              0
            );
            const currentDate = new Date(firstDayOfMonth);
            while (currentDate <= lastDayOfMonth) {
              // Check si l'évènement a lieu sur un jour de travail (lundi à samedi)
              if (currentDate.getDay() >= 1 && currentDate.getDay() <= 6) {
                const newEvent = { ...this.newEvent }; // Crée une nouvelle instance de newEvent (évite la duplication)
                newEvent.start =
                  this.formatDate(currentDate) +
                  'T' +
                  row.prisePoste.split('T')[1] +
                  ':00';
                newEvent.end =
                  this.formatDate(currentDate) +
                  'T' +
                  row.finPoste.split('T')[1] +
                  ':00';

                const userPath: string | null = await this.calendar.getPath(
                  row.personnel
                );
                if (userPath) {
                  await this.addEvent(userPath, newEvent);
                }
              }
              currentDate.setDate(currentDate.getDate() + 1); // Se déplace au jour suivant
              // Vérifie si le prochain jour est Dimanche et le skip si c'est le cas
              if (currentDate.getDay() === 0) {
                currentDate.setDate(currentDate.getDate() + 1);
              }
            }
          } else {
            // Si le début et la fin d'évènement ont pas lieu le même jour 
            console.log('Event spans multiple days. Skipping repetition.');
          }
          break;
        default: // Ne pas répéter
          const userPath: string | null = await this.calendar.getPath(
            row.personnel
          );
          if (userPath) {
            await this.addEvent(userPath, this.newEvent);
          }
          break;
      }
    }
    this.closeDialog(); */
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    // Vérif si les deux dates sont les mêmes
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  private formatDate(date: Date): string {
    // Formater la date en string lisible
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  getMotifLabel(value: string): string {
    // Retourner le motif selon le choix de l'utilisateur
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
    // Retourner le champ répéter selon le choix de l'utilisateur
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

/*   addEvent(userId: string, newEvent: DayPilot.EventData): void {
    // Ajouter l'évènement au calendrier
    const prop = 'foodandboost_prop'; // table des utilisateurs
    this.calendar.add_event(prop, userId, newEvent);
  } */

  closeDialog(): void {
    this.dialogRef.close(); // Fermer le dialog
  }

  getCategoryUsers(
    // Récupérer la liste des utilisateurs dont on rentre le rôle
    category: String
  ): { nom: string; selectionne: boolean; mail: string }[] {
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
