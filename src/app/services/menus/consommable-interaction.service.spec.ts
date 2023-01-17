import { TestBed } from '@angular/core/testing';

import { ConsommableInteractionService } from './consommable-interaction.service';

describe('ConsommableInteractionService', () => {
  let service: ConsommableInteractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsommableInteractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
