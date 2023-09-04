import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDiscountListPage } from './admin-discount-list.page';

describe('AdminDiscountListPage', () => {
  let component: AdminDiscountListPage;
  let fixture: ComponentFixture<AdminDiscountListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminDiscountListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
