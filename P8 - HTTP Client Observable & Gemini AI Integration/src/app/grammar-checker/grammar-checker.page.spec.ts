import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrammarCheckerPage } from './grammar-checker.page';

describe('GrammarCheckerPage', () => {
  let component: GrammarCheckerPage;
  let fixture: ComponentFixture<GrammarCheckerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GrammarCheckerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
