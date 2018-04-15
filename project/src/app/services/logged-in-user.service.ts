import { Injectable } from '@angular/core';
import { User } from '../user/user.model';
import { UserService } from './user.service';

@Injectable()
export class LoggedInUserService {
  private _loggedInUser: User;
  constructor(private _userService: UserService) {
    this._loggedInUser = this._userService.getUserByName('Hu Ocean');
  }

  get loggedInUser() {
    return this._loggedInUser;
  }

  set loggedInUser(user: User) {
    this._loggedInUser = user;
  }



}
