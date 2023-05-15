import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messagerie',
  templateUrl: './app.messagerie.component.html',
  styleUrls: ['./app.messagerie.component.css']
})

export class AppMessagerieComponent implements OnInit {
  text!: string;

  constructor() { }

  ngOnInit(): void {
    this.text = "it works !";
  }

  showLocation = true;
  

}
