import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminTrashListPage } from './admin-trash-list.page';

describe('AdminTrashListPage', () => {
  let component: AdminTrashListPage;
  let fixture: ComponentFixture<AdminTrashListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminTrashListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
