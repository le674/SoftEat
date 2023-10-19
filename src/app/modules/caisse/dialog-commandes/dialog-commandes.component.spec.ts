import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCommandesComponent } from './dialog-commandes.component';

describe('DialogCommandesComponent', () => {
  let component: DialogCommandesComponent;
  let fixture: ComponentFixture<DialogCommandesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogCommandesComponent]
    });
    fixture = TestBed.createComponent(DialogCommandesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
