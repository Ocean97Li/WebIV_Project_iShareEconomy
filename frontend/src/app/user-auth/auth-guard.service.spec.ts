import { HttpModule } from '@angular/http';
import { TestBed, inject } from '@angular/core/testing';
import { AuthGuardService } from './auth-guard.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from './authentication.service';

describe('AuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, RouterTestingModule ],
      providers: [AuthGuardService, AuthenticationService]
    });
  });

  it('should be created', inject([AuthGuardService], (service: AuthGuardService) => {
    expect(service).toBeTruthy();
  }));
});
