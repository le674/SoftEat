import { TestBed } from '@angular/core/testing';

import { CalculConsoServiceTsService } from './calcul.conso.service.ts.service';

describe('CalculConsoServiceTsService', () => {
  let service: CalculConsoServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculConsoServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
