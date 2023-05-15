import { Component, NgModule, OnInit } from '@angular/core';

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

  date: Date = new Date();

  analyse = true;
  budget = true;
  facture = true;
  planning = true;
  stock = true;

}

