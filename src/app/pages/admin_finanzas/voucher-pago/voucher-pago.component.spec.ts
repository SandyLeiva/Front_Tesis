import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherPagoComponent } from './voucher-pago.component';

describe('VoucherPagoComponent', () => {
  let component: VoucherPagoComponent;
  let fixture: ComponentFixture<VoucherPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoucherPagoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
