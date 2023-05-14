import { TestBed } from '@angular/core/testing';

import { ClientCalculService } from './client-calcul.service';

describe('ClientCalculService', () => {
  let service: ClientCalculService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientCalculService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
