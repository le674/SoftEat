import { TestBed } from '@angular/core/testing';

import { FactureImgService } from './facture-img.service';

describe('FactureImgService', () => {
  let service: FactureImgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactureImgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
