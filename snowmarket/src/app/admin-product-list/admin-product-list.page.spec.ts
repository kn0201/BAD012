import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminProductListPage } from './admin-product-list.page';

describe('AdminProductListPage', () => {
  let component: AdminProductListPage;
  let fixture: ComponentFixture<AdminProductListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminProductListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
