import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FecTableComponent } from './fec.table.component';

describe('FecTableComponent', () => {
  let component: FecTableComponent;
  let fixture: ComponentFixture<FecTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FecTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FecTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
