import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLendObjectComponent } from './add-lend-object.component';

describe('AddLendObjectComponent', () => {
  let component: AddLendObjectComponent;
  let fixture: ComponentFixture<AddLendObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLendObjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLendObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
