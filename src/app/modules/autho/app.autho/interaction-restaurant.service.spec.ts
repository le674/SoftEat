import { TestBed } from '@angular/core/testing';

import { InteractionRestaurantService } from './interaction-restaurant.service';

describe('InteractionRestaurantService', () => {
  let service: InteractionRestaurantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InteractionRestaurantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
