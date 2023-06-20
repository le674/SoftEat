import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMessagerieDateTemplateComponent } from './app.messagerie.date.template.component';

describe('AppMessagerieDateTemplateComponent', () => {
  let component: AppMessagerieDateTemplateComponent;
  let fixture: ComponentFixture<AppMessagerieDateTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppMessagerieDateTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppMessagerieDateTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
