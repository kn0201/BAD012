import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminCategoriesListPage } from './admin-categories-list.page';

describe('AdminCategoriesListPage', () => {
  let component: AdminCategoriesListPage;
  let fixture: ComponentFixture<AdminCategoriesListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminCategoriesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
