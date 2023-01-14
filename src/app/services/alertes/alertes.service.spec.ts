import { TestBed } from '@angular/core/testing';

import { AlertesService } from './alertes.service';

describe('AlertesStockService', () => {
  let service: AlertesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
