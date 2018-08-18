import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnLendObjectComponent } from './return-lend-object.component';

describe('ReturnLendObjectComponent', () => {
  let component: ReturnLendObjectComponent;
  let fixture: ComponentFixture<ReturnLendObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnLendObjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnLendObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
