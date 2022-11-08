import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppModulesFacturesFeuilleUploadComponent } from './app.modules.factures.feuille.upload.component';

describe('AppModulesFacturesFeuilleUploadComponent', () => {
  let component: AppModulesFacturesFeuilleUploadComponent;
  let fixture: ComponentFixture<AppModulesFacturesFeuilleUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppModulesFacturesFeuilleUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppModulesFacturesFeuilleUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
