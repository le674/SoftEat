import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import {AppRhComponent} from '../app.rh.component'
import { getDatabase, ref, push, update, get, onChildAdded, onValue, DatabaseReference} from 'firebase/database';

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
  date!: number;

  constructor(private cdr: ChangeDetectorRef, private app: AppRhComponent) { }

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
  }

  getCongesColorStyle(conges: number) {
    const minConges = 0;
    const maxConges = 30;
    const normalizedValue = (conges - minConges) / (maxConges - minConges);
    const red = Math.round((1 - normalizedValue) * 255);
    const green = Math.round(normalizedValue * 255);
    return { color: `rgb(${red}, ${green}, 0)` };
  }
  
  /*autofillInput(value: string): void {
    if (value =="Exceptionnels"){
      this.motif.nativeElement.value = '';
    }else
      this.motif.nativeElement.value = value;
  }*/
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
      this.date = this.fetchTimeServer();
      message += `\nHeure du mess: ${this.date}`;
  
      alert(message);
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

  /*async sendMessage(): Promise<void> {
    if(this.inputText != '') {
      const db = getDatabase(this.firebaseApp);

      //Création du nouveau message
      const newMessage = {
        auteur: localStorage.getItem("user_email"),
        contenu: this.inputText,
        horodatage: this.fetchTimeServer(),
        nom : this.name,
        prenom : this.surname
      }
      //Ecriture du message dans la BDD
      const nodeRef = ref(db, this.convActive);
      push(nodeRef, newMessage).then(() => {
        //Envoie de la notification à tous les Users
        this.updateUnreadMessages(this.canalActiveId, this.convListUsers[this.canalActiveId]);
        this.markCanalAsRead(this.canalActiveId, this.email);
      })
      .catch((error) => {
        console.error("Error creating new message:", error);
      });
      
      
    }
    this.inputText = "";
  }*/
}
