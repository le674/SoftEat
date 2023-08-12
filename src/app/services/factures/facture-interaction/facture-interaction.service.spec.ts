import { TestBed } from '@angular/core/testing';

import { FactureInteractionService } from './facture-interaction.service';

describe('FactureInteractionService', () => {
  let service: FactureInteractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactureInteractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
