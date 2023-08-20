import { TestBed } from '@angular/core/testing';

import { ConversationInteractionService } from './conversation-interaction.service';

describe('ConversationInteractionService', () => {
  let service: ConversationInteractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConversationInteractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
