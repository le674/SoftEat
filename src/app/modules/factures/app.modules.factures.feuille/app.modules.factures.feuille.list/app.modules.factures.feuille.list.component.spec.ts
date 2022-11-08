import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppModulesFacturesFeuilleListComponent } from './app.modules.factures.feuille.list.component';

describe('AppModulesFacturesFeuilleListComponent', () => {
  let component: AppModulesFacturesFeuilleListComponent;
  let fixture: ComponentFixture<AppModulesFacturesFeuilleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppModulesFacturesFeuilleListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppModulesFacturesFeuilleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
