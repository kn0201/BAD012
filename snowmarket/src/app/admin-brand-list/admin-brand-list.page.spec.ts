import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminBrandListPage } from './admin-brand-list.page';

describe('AdminBrandListPage', () => {
  let component: AdminBrandListPage;
  let fixture: ComponentFixture<AdminBrandListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminBrandListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
