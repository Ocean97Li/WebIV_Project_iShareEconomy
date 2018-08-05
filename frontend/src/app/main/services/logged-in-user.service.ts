import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { LendObject } from '../models/lend-object.model';
import { AuthenticationInterceptor } from '../../http-interceptors/AuthenticationInterceptor';
import { AuthenticationService } from '../../user/authentication.service';
import { BehaviorSubject } from '../../../../node_modules/rxjs/BehaviorSubject';
import { MapSettingsService } from './map-settings.service';
import { distinctUntilChanged } from '../../../../node_modules/rxjs/operators';
import { Observable } from '../../../../node_modules/rxjs/Observable';

@Injectable()
export class LoggedInUserService {

  private _user: User;
  constructor(private _mapService: MapSettingsService, private _authService: AuthenticationService) {
    _authService.user$.pipe(distinctUntilChanged()).subscribe(user => {
      if (user !== null && user !== undefined) {
        this._user = user;
        _mapService.position = this._user.mapLocation;
      }
    });
  }

  public get loggedInUser(): User {
    // return this._userService.getUserByName(this._loggedInUser);
    return this._user;
  }

  public addNewLendObject(obj: LendObject): Observable<LendObject> {
    return null;
  }

  public removeObject(obj: LendObject):  Observable<LendObject> {
    return null;
  }




}
