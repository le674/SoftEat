import { TestBed } from '@angular/core/testing';

import { AppModulesFacturesParsePDFService } from './app.modules.factures.parse-pdf.service';

describe('AppModulesFacturesParsePDFService', () => {
  let service: AppModulesFacturesParsePDFService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppModulesFacturesParsePDFService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
