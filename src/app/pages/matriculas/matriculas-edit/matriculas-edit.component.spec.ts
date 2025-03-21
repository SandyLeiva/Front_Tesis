import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatriculasEditComponent } from './matriculas-edit.component';

describe('MatriculasEditComponent', () => {
  let component: MatriculasEditComponent;
  let fixture: ComponentFixture<MatriculasEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatriculasEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatriculasEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
