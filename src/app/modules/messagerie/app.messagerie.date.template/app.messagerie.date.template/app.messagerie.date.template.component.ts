import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'message-date-template',
  templateUrl: './app.messagerie.date.template.component.html',
  styleUrls: ['./app.messagerie.date.template.component.css'],
})
export class AppMessagerieDateTemplateComponent implements OnInit {
  @Input() date!: number;

  constructor() {}

  ngOnInit(): void {}
}
