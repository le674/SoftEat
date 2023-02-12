import { TestBed } from '@angular/core/testing';

import { MenuCalculPlatsServiceService } from './menu.calcul.plats.service.service';

describe('MenuCalculPlatsServiceService', () => {
  let service: MenuCalculPlatsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuCalculPlatsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
