import { Conversation } from 'src/app/interfaces/conversation';
import { MessageModel } from '../messages_models/model';

export class MessageInfos {
  message!: Conversation;
  authorIsMe!: boolean;
  isBot!: boolean;

  constructor() {
    this.message = new Conversation();
  }
}
