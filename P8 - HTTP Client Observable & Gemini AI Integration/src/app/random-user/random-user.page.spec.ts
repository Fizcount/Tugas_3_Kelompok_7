import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RandomUserPage } from './random-user.page';

describe('RandomUserPage', () => {
  let component: RandomUserPage;
  let fixture: ComponentFixture<RandomUserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
