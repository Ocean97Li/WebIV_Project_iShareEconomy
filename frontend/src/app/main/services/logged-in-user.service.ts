import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { LendObject } from '../models/lend-object.model';
import { AuthenticationInterceptor } from '../../http-interceptors/AuthenticationInterceptor';
import { AuthenticationService } from '../../user/authentication.service';

@Injectable()
export class LoggedInUserService {
  private _loggedInUser: string;
  constructor(private _userService: UserService, private _authService: AuthenticationService) {
    this._loggedInUser = 'Hu Ocean';
  }

  public get loggedInUser() {
    // return this._userService.getUserByName(this._loggedInUser);
    return this._authService.user$.value;
  }

  public set loggedInUser(user: User) {
    this._loggedInUser = user.firstname;
  }

  public addNewLendObject(object: LendObject) {
    // temporary
    object.addUser(this.loggedInUser);
    this._userService.addObjectToUser(object, this.loggedInUser);

  }

  removeObject(selected: LendObject): void {
    //
  }



}
