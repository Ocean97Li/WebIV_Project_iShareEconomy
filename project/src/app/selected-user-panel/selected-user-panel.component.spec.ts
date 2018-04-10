import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedUserPanelComponent } from './selected-user-panel.component';

describe('SelectedUserPanelComponent', () => {
  let component: SelectedUserPanelComponent;
  let fixture: ComponentFixture<SelectedUserPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedUserPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedUserPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
