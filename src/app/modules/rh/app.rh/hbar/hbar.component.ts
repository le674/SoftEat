import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-hbar',
  templateUrl: './hbar.component.html',
  styleUrls: ['./hbar.component.css']
})
export class HbarComponent implements OnInit {
  @ViewChild('motif') motif!: ElementRef;
  @ViewChild('autofillConge') autofillConge!: ElementRef;
  @ViewChild('autofillRTT') autofillRTT!: ElementRef;
  @ViewChild('autofillMate') autofillMate!: ElementRef;
  @ViewChild('autofillPate') autofillPate!: ElementRef;
  constructor() { }

  ngOnInit(): void {
    /*this.motif = "";*/
  }

  autofillInput(value: string): void {
    this.motif.nativeElement.value = value;
  }

}
