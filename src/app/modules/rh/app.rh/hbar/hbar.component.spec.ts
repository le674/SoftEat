import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HbarComponent } from './hbar.component';

describe('HbarComponent', () => {
  let component: HbarComponent;
  let fixture: ComponentFixture<HbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
