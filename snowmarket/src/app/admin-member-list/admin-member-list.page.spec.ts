import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminMemberListPage } from './admin-member-list.page';

describe('AdminMemberListPage', () => {
  let component: AdminMemberListPage;
  let fixture: ComponentFixture<AdminMemberListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminMemberListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
