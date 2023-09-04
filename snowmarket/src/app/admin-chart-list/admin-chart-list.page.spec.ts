import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminChartListPage } from './admin-chart-list.page';

describe('AdminChartListPage', () => {
  let component: AdminChartListPage;
  let fixture: ComponentFixture<AdminChartListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminChartListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
