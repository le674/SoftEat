import { TestBed } from '@angular/core/testing';

import { PreparationInteractionService } from './preparation-interaction.service';

describe('PreparationInteractionService', () => {
  let service: PreparationInteractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreparationInteractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
