import { TestBed } from '@angular/core/testing';

import { CommonCacheServices } from './common.cache.services.service';

describe('CommonCacheServicesService', () => {
  let service: CommonCacheServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonCacheServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
