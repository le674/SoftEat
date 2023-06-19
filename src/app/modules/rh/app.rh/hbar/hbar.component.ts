import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import {AppRhComponent} from '../app.rh.component'

@Component({
  selector: 'app-hbar',
  templateUrl: './hbar.component.html',
  styleUrls: ['./hbar.component.css']
})
export class HbarComponent implements OnInit {
  selectedFileName!: string;
  @ViewChild('motif') motif!: ElementRef;
  @ViewChild('autofillConge') autofillConge!: ElementRef;
  @ViewChild('autofillRTT') autofillRTT!: ElementRef;
  @ViewChild('autofillMate') autofillMate!: ElementRef;
  @ViewChild('autofillPate') autofillPate!: ElementRef;
  @ViewChild('dateDebut') dateDebutInput!: ElementRef<HTMLInputElement>;
  @ViewChild('dateFin') dateFinInput!: ElementRef<HTMLInputElement>;
  dateWidth = '150px'; // Default width
  conges!: number;
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
  
  autofillInput(value: string): void {
    if (value =="Exceptionnels"){
      this.motif.nativeElement.value = '';
    }else
      this.motif.nativeElement.value = value;
  }

  displayFileName(event: any) {
    const fileInput = event.target;
    if (fileInput.files.length > 0) {
      const fileName = fileInput.files[0].name;
      this.selectedFileName = this.getShortenedFileName(fileName);
    } else {
      this.selectedFileName = '';
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

  onSubmit(form: NgForm) {
    if (form.valid) { // Check if the form is valid
      const { motif, dateDebut, dateFin } = form.value;
      let message = `Motif: ${motif}\nDate début: ${dateDebut}\nDate fin: ${dateFin}`;
  
      if (this.selectedFileName) {
        message += `\nFichier joint: ${this.selectedFileName}`;
      }
  
      alert(message);
    }
  }
  
}
