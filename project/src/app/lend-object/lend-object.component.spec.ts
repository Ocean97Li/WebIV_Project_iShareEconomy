import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LendObjectComponent } from './lend-object.component';

describe('LendObjectComponent', () => {
  let component: LendObjectComponent;
  let fixture: ComponentFixture<LendObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LendObjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LendObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
