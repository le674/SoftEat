import { TestBed } from '@angular/core/testing';

import { PlatsInteractionService } from './plats-interaction.service';

describe('PlatsInteractionService', () => {
  let service: PlatsInteractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlatsInteractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
