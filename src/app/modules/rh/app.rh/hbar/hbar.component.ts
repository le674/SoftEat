import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, Input, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppRhComponent } from '../app.rh.component'
import { getDatabase, ref, push, update, get, onChildAdded, onValue, DatabaseReference } from 'firebase/database';
import { FirebaseApp } from '@angular/fire/app';
import { FirebaseService } from 'src/app/services/firebase.service';
@Component({
  selector: 'app-hbar',
  templateUrl: './hbar.component.html',
  styleUrls: ['./hbar.component.css']
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
  // Pour la demande de congés envoyée
  @Input() convActive: string = 'conversations/deliss_pizz/employes/...'; // Propriété d'entrée pour convActive
  firebaseApp: FirebaseApp | undefined;
  date!: number;
  email!: string;
  conv!: string;

  constructor(private cdr: ChangeDetectorRef, private app: AppRhComponent,
     firebaseApp: FirebaseApp, private firebaseService: FirebaseService
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
    this.conges = parseInt(await this.app.getUserConges(), 10); // Parse the string as an integer
    this.email = this.firebaseService.getEmailLocalStorage();
    const [emailPrefix] = this.email.split('@');
    await this.getConv();
    this.convActive = `conversations/deliss_pizz/employes/${this.conv}`;
  }

  getCongesColorStyle(conges: number) {
    const minConges = 0;
    const maxConges = 30;
    const normalizedValue = (conges - minConges) / (maxConges - minConges);
    const red = Math.round((1 - normalizedValue) * 255);
    const green = Math.round(normalizedValue * 255);
    return { color: `rgb(${red}, ${green}, 0)` };
  }

  autofillInput(value: string): void {
    if (value == "Exceptionnels") {
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
    // Reset the file input value if needed
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.value = '';
  }

  onSubmit() {
    if (this.form.valid) { // Check if the form is valid
      const { motif, dateDebut, dateFin } = this.form.value;
      let message = `Motif: ${motif}\nDate début: ${dateDebut}\nDate fin: ${dateFin}`;

      if (this.selectedFileName) {
        message += `\nFichier joint: ${this.selectedFileName}`;
      }
      message += `\nHeure du mess: ${this.date}`;
      this.sendMessage(message);
    }
  }

  // Obtenir le nom et prénom du LocalStorage
  async getConv(): Promise<void> {
    const db = getDatabase(this.firebaseApp);
    const usersRef = ref(db, 'users/foodandboost_prop');
    const usersSnapShot = await get(usersRef);

    if (usersSnapShot.exists()) {
      usersSnapShot.forEach((userSnapShot) => {
        const user = userSnapShot.val();
        if (user.email == this.email) {
          this.conv = user.convPrivee;
        } 
      });
    }
  }

  //recuperation heure du serveur
  fetchTimeServer(): number {
    const db = getDatabase();
    onValue(ref(db, '.info/serverTimeOffset'), (snapshot) => {
      const offset: number = snapshot.val() || 0;
      this.date = Date.now() + offset;
    })
    return this.date;
  }

  async sendMessage(message: string): Promise<void> {
    const db = getDatabase(this.firebaseApp);
    //Création du nouveau message
    const newMessage = {
      auteur: localStorage.getItem("user_email"),
      contenu: message,
      horodatage: this.fetchTimeServer(),
    }
    //Ecriture du message dans la BDD
    const nodeRef = ref(db, this.convActive);
    push(nodeRef, newMessage);
  }
}
