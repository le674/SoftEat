import { Component, Input, OnInit } from '@angular/core';
import { Statut } from '../../../interfaces/statut';
import { MessageModel } from '../messages_models/model';
import { CommonService } from 'src/app/services/common/common.service';
@Component({
  selector: 'message-template',
  templateUrl: './app.message.template.component.html',
  styleUrls: ['./app.message.template.component.css'],
})
export class AppMessageTemplateComponent implements OnInit {
  @Input() listeMessages!: MessageModel;
  @Input() author_is_me!: boolean;
  @Input() isBot!: boolean;

  statut!: Statut;

  constructor(private service:CommonService) {}

  ngOnInit(): void {
    this.statut = new Statut(this.service);
  }
}
