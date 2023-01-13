import { TestBed } from '@angular/core/testing';

import { IngredientsInteractionService } from './ingredients-interaction.service';

describe('IngredientsInteractionService', () => {
  let service: IngredientsInteractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientsInteractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
