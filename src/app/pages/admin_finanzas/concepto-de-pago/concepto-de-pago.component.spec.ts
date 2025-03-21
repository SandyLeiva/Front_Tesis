import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptoDePagoComponent } from './concepto-de-pago.component';

describe('ConceptoDePagoComponent', () => {
  let component: ConceptoDePagoComponent;
  let fixture: ComponentFixture<ConceptoDePagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConceptoDePagoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConceptoDePagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
