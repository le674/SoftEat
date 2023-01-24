import { TestBed } from '@angular/core/testing';

import { MenuInteractionService } from './menu-interaction.service';

describe('MenuInteractionService', () => {
  let service: MenuInteractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuInteractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
