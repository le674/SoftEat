import { TestBed } from '@angular/core/testing';

import { MenuCalculMenuService } from './menu.calcul.menu.service';

describe('MenuCalculMenuService', () => {
  let service: MenuCalculMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuCalculMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
