import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatriculasDeleteComponent } from './matriculas-delete.component';

describe('MatriculasDeleteComponent', () => {
  let component: MatriculasDeleteComponent;
  let fixture: ComponentFixture<MatriculasDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatriculasDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatriculasDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
