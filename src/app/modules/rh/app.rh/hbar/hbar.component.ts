import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppRhComponent } from '../app.rh.component';
import { getDatabase, ref, push, get, onValue } from 'firebase/database';
import { FirebaseApp } from '@angular/fire/app';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-hbar',
  templateUrl: './hbar.component.html',
  styleUrls: ['./hbar.component.css'],
})
export class HbarComponent implements OnInit {
  @ViewChild('form') form!: NgForm;
  @ViewChild('motif') motif!: ElementRef;
  @ViewChild('autofillConge') autofillConge!: ElementRef;
  @ViewChild('autofillRTT') autofillRTT!: ElementRef;
  @ViewChild('autofillMate') autofillMate!: ElementRef;
  @ViewChild('autofillPate') autofillPate!: ElementRef;
  @ViewChild('dateDebut') dateDebutInput!: ElementRef<HTMLInputElement>;
  @ViewChild('dateFin') dateFinInput!: ElementRef<HTMLInputElement>;
  dateWidth = '150px'; // Default width
  // Pour l'affichage de la page
  conges!: number;
  selectedShortenedFileName!: string;
  selectedFileName!: string;
  // Pour la demande de congés envoyée, informations sur l'utilisateur courrant
  @Input() convActive = 'conversations/deliss_pizz/employes/...'; // Propriété d'entrée pour la conversation RH
  firebaseApp: FirebaseApp | undefined;
  date!: number;
  email!: string;
  conv!: string;
  name!: string;
  surname!: string;
  role!: string;

  constructor(
    private cdr: ChangeDetectorRef,
    private app: AppRhComponent,
    firebaseApp: FirebaseApp,
    private firebaseService: FirebaseService,
    private snackbar : MatSnackBar
  ) {
    this.firebaseApp = firebaseApp;
  }

  /* Les 2 méthodes suivantes permettent de rendre l'espace occupé par la date adapté*/
  ngAfterViewInit(): void {
    this.calculateInputWidth();
    this.cdr.detectChanges();
  }

  calculateInputWidth(): void {
    const inputElement = this.dateDebutInput.nativeElement;
    const contentWidth = inputElement.scrollWidth + 'px';
    this.dateWidth = contentWidth;
  }

  async ngOnInit(): Promise<void> {
    this.conges = parseInt(await this.app.getUserConges(), 10); // Traduit le string en int
    this.email = this.firebaseService.getEmailLocalStorage();
    await this.getConv();
    this.convActive = `conversations/deliss_pizz/employes/${this.conv}`;
  }

  // Permet de modifier la couleur des congés restants (rouge plus beaucoup de congés, vert beaucoup de congés, de 1 à 30)
  getCongesColorStyle(conges: number) {
    const minConges = 0;
    const maxConges = 30;
    const normalizedValue = (conges - minConges) / (maxConges - minConges);
    const red = Math.round((1 - normalizedValue) * 255);
    const green = Math.round(normalizedValue * 255);
    return { color: `rgb(${red}, ${green}, 0)` };
  }

  autofillInput(value: string): void {
    if (value == 'Exceptionnels') {
      this.form.value.motif = '';
    } else {
      this.form.value.motif = value;
    }
  }

  displayFileName(event: any) {
    const fileInput = event.target;
    if (fileInput.files.length > 0) {
      const fileName = fileInput.files[0].name;
      this.selectedFileName = fileName;
      this.selectedShortenedFileName = this.getShortenedFileName(fileName);
    } else {
      this.selectedFileName = '';
      this.selectedShortenedFileName = '';
    }
  }

  getShortenedFileName(fileName: string): string {
    if (fileName.length <= 20) {
      return fileName;
    } else {
      return fileName.substr(0, 17) + '...';
    }
  }

  unchooseFile() {
    this.selectedFileName = '';
    // Remise à zéro du champ si il y en a besoin
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.value = '';
  }

  onSubmit() {
    if (this.form.valid) {
      // Check if the form is valid
      const { motif, dateDebut, dateFin } = this.form.value;
      // Formattage des dates pour l'affichage
      const formattedDateDebut = new Date(dateDebut).toLocaleDateString(
        'fr-FR',
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }
      );
      const formattedDateFin = new Date(dateFin).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      let message = `Nouvelle demande de congés de ${this.name} ${this.surname} (${this.role}) pour : ${motif}. Les congés seraient effectifs du ${formattedDateDebut} au ${formattedDateFin}.`;
      // Si fichier joint, le transmettre. Sous quel format ? Comment le stocker ?
      if (this.selectedFileName) {
        message += `\n Fichier joint: ${this.selectedFileName}`;
      }
      this.sendMessage(message);
      this.snackbar.open("Demande envoyée", "Fermer")
      this.clearForm();
    }
  }

  clearForm() {
    this.form.reset(); // Reset the form
    this.selectedFileName = ''; // Clear the selected file name
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.value = ''; // Reset the file input value
  }

  // Obtenir la conversation rh (privée), le nom et prénom du LocalStorage
  async getConv(): Promise<void> {
    const db = getDatabase(this.firebaseApp);
    const usersRef = ref(db, 'users/foodandboost_prop');
    const usersSnapShot = await get(usersRef);

    if (usersSnapShot.exists()) {
      usersSnapShot.forEach((userSnapShot) => {
        const user = userSnapShot.val();
        if (user.email == this.email) {
          this.conv = user.convPrivee;
          this.name = user.prenom;
          this.surname = user.nom;
          this.role = user.role;
        }
      });
    }
  }

  //recuperation heure du serveur
  fetchTimeServer(): number {
    const db = getDatabase(this.firebaseApp);
    onValue(ref(db, '.info/serverTimeOffset'), (snapshot) => {
      const offset: number = snapshot.val() || 0;
      this.date = Date.now() + offset;
    });
    return this.date;
  }

  async sendMessage(message: string): Promise<void> {
    const db = getDatabase(this.firebaseApp);
    //Création du nouveau message par un bot
    const newMessage = {
      auteur: 'softeat@gmail.com',
      contenu: message,
      horodatage: this.fetchTimeServer(),
      nom: 'SoftEat',
    };
    //Ecriture du message dans la BDD
    const nodeRef = ref(db, this.convActive);
    push(nodeRef, newMessage);
  }
}
