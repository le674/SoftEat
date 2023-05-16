import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hbar',
  templateUrl: './hbar.component.html',
  styleUrls: ['./hbar.component.css']
})
export class HbarComponent implements OnInit {
  /*motif! : String*/
  constructor() { }

  ngOnInit(): void {
    /*this.motif = "";*/
  }

  autofillInput(value: string): void {
    /*this.motif = value;*/
  }

}
