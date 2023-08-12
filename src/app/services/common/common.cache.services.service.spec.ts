import { TestBed } from '@angular/core/testing';

import { CommonCacheServicesService } from './common.cache.services.service';

describe('CommonCacheServicesService', () => {
  let service: CommonCacheServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonCacheServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
