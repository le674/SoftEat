import { TestBed } from '@angular/core/testing';

import { UserInteractionService } from './user-interaction.service';

describe('UserInteractionService', () => {
  let service: UserInteractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserInteractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

/*   it('should return something', () => {
    service.getProprietaireFromUsers("SXZ2Eq24CbS4JlAsge2UAgldG803").then((value) => {
      expect(value).toBe('promise value')
    })
  }) */
});
