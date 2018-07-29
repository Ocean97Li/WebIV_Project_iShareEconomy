import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteLendObjectComponent } from './delete-lend-object.component';

describe('DeleteLendObjectComponent', () => {
  let component: DeleteLendObjectComponent;
  let fixture: ComponentFixture<DeleteLendObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteLendObjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteLendObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
