import { Component, NgModule, OnInit } from '@angular/core';

@Component({
  selector: 'app-messagerie',
  templateUrl: './app.messagerie.component.html',
  styleUrls: ['./app.messagerie.component.css']
})


export class AppMessagerieComponent implements OnInit {
  text!: string;
  notification!: boolean;

  constructor() { }

  ngOnInit(): void {
    this.text = "it works !";
    this.notification = true;
  }

  date: Date = new Date();

  analyse = true;
  budget = true;
  facture = true;
  planning = true;
  stock = true;

}

