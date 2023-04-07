import { TestBed } from '@angular/core/testing';

import { FacturePdfService } from './facture-pdf.service';

describe('FacturePdfService', () => {
  let service: FacturePdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturePdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
