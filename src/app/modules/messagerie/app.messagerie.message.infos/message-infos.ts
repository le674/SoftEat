import { MessageModel } from '../messages_models/model';

export class MessageInfos {
  message!: MessageModel;
  authorIsMe!: boolean;
  isBot!: boolean;

  constructor() {
    this.message = new MessageModel();
  }
}
