import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmrrUserEditorComponent } from './amrr-user-editor.component';

describe('AmrrUserEditorComponent', () => {
  let component: AmrrUserEditorComponent;
  let fixture: ComponentFixture<AmrrUserEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmrrUserEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmrrUserEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
