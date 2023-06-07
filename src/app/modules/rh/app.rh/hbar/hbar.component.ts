import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

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
  dateWidth = '150px'; // Default width
  constructor() { }

  /* Les 2 méthodes suivantes permettent de rendre l'espace occupé par la date responsive*/ 
  ngAfterViewInit(): void {
    this.calculateInputWidth();
  }

  calculateInputWidth(): void {
    const inputElement = this.dateDebutInput.nativeElement;
    const contentWidth = inputElement.scrollWidth + 'px';
    this.dateWidth = contentWidth;
  }

  ngOnInit(): void {
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
      this.selectedFileName = fileInput.files[0].name;
    } else {
      this.selectedFileName = '';
    }
  }
  unchooseFile() {
    this.selectedFileName = '';
    // Reset the file input value if needed
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.value = '';
  }
}
