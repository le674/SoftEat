import { TestBed } from '@angular/core/testing';

import { AlertesStockService } from './alertes.stock.service';

describe('AlertesStockService', () => {
  let service: AlertesStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertesStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
