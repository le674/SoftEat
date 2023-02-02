import { TestBed } from '@angular/core/testing';

import { CalculPrepaService } from './calcul.prepa.service';

describe('CalculPrepaService', () => {
  let service: CalculPrepaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculPrepaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
