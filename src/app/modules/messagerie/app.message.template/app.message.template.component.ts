import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'message-template',
  templateUrl: './app.message.template.component.html',
  styleUrls: ['./app.message.template.component.css']
})
export class AppMessageTemplateComponent implements OnInit {
  date = new Date();
  text!: string;

  constructor() { }

  ngOnInit(): void {
    this.text = "Message content that is super very long, like reaaaally long.";
  }

  
}
