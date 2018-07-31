import { TestBed, inject } from '@angular/core/testing';

import { LoggedInUserService } from './logged-in-user.service';

describe('LoggedInUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggedInUserService]
    });
  });

  it('should be created', inject([LoggedInUserService], (service: LoggedInUserService) => {
    expect(service).toBeTruthy();
  }));
});
