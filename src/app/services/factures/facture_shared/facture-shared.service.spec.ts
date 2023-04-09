import { TestBed } from '@angular/core/testing';

import { FactureSharedService } from './facture-shared.service';

describe('FactureSharedService', () => {
  let service: FactureSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactureSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
