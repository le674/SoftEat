import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'message-template',
  templateUrl: './app.message.template.component.html',
  styleUrls: ['./app.message.template.component.css']
})
export class AppMessageTemplateComponent implements OnInit {
  date = new Date();
  text!: string;
  message!: string;
  separationDate!: string[];
  separationDateB!: boolean;


  constructor() { }

  ngOnInit(): void {
    this.message = "received";
    this.text = "Bonjour la messagerie !";
    this.separationDate = [this.date.toLocaleDateString(), this.date.toLocaleTimeString()];
    this.separationDateB = true;
  }

  updateSeparationDate(){
    this.separationDateB = !this.separationDateB;
  }
}
