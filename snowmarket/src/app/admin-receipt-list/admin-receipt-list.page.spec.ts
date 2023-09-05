import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminReceiptListPage } from './admin-receipt-list.page';

describe('AdminReceiptListPage', () => {
  let component: AdminReceiptListPage;
  let fixture: ComponentFixture<AdminReceiptListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminReceiptListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
