import { TestBed } from '@angular/core/testing';
import { AppDashboardGrantAccessService } from './app.dashboard.grant-access.service';


describe('AppDashboardGrantAccessService', () => {
  let service: AppDashboardGrantAccessService;

  // on lance la boucle avant tout les testes qui sont décrits dans les it, before est pour un test en particulié
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppDashboardGrantAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should granted', () => {

  })
});
