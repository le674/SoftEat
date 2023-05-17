import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMessageTemplateComponent } from './app.message.template.component';

describe('AppMessageTemplateComponent', () => {
  let component: AppMessageTemplateComponent;
  let fixture: ComponentFixture<AppMessageTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppMessageTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppMessageTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
