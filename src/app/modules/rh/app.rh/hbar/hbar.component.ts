import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-hbar',
  templateUrl: './hbar.component.html',
  styleUrls: ['./hbar.component.css']
})
export class HbarComponent implements OnInit {
  @ViewChild('motif') motif!: ElementRef;
  constructor() { }

  ngOnInit(): void {
    /*this.motif = "";*/
  }

  autofillInput(): void {
    this.motif.nativeElement.value = 'Congés';
  }

}
