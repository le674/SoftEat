import { TestBed } from '@angular/core/testing';

import { ConversationCalculService } from './conversation-calcul.service';

describe('ConversationCalculService', () => {
  let service: ConversationCalculService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConversationCalculService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
