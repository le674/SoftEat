import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { FirebaseApp, initializeApp } from '@angular/fire/app';
import { getDatabase, ref, onValue, get } from 'firebase/database';

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
  Serveurs!: { nom: String }[];
  Gerants!: { nom: String }[];
  Rh!: { nom: String }[];
  Autres!: { nom: String }[];
  firebaseApp: FirebaseApp | undefined;
  constructor(firebaseApp: FirebaseApp) {}

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

          const prenomSnapshot = await get(userPrenomRef);
          const nomSnapshot = await get(userNomRef);
          const nomComplet = prenomSnapshot.val() + " " + nomSnapshot.val();

          const roleSnapshot = await get(userRoleRef);
          const role = roleSnapshot.val();

          if (nomComplet) {
            if (role == 'gerant') {
              this.Gerants.push({ nom: nomComplet });
            } else if (role == 'rh') {
              this.Rh.push({ nom: nomComplet });
            } else if (role == 'serveur') {
              this.Serveurs.push({ nom: nomComplet });
            } else {
              this.Autres.push({ nom: nomComplet });
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

  getCategoryUsers(category: String): { nom: String; }[] {
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
