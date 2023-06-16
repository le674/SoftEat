import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FirebaseApp } from "@angular/fire/app";
import { getDatabase, ref, onValue, get} from 'firebase/database';
import { Statut } from '../../../interfaces/statut';
import { MessageModel } from '../messages_models/model';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'message-template',
  templateUrl: './app.message.template.component.html',
  styleUrls: ['./app.message.template.component.css']
})

export class AppMessageTemplateComponent implements OnInit {

  @Input() listeMessages!: MessageModel;


  message!: string;
  email!: any;
  firebaseApp: FirebaseApp | undefined;


  constructor() {}

  ngOnInit(): void {
    this.message = "received";
  }


}


