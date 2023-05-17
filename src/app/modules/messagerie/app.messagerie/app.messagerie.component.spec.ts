import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMessagerieComponent } from './app.messagerie.component';

describe('AppMessagerieComponent', () => {
  let component: AppMessagerieComponent;
  let fixture: ComponentFixture<AppMessagerieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppMessagerieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppMessagerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
