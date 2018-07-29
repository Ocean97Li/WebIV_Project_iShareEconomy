import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoLendObjectComponent } from './info-lend-object.component';

describe('InfoLendObjectComponent', () => {
  let component: InfoLendObjectComponent;
  let fixture: ComponentFixture<InfoLendObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoLendObjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoLendObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
