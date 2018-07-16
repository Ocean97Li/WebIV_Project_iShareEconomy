import { Injectable } from '@angular/core';
import { User } from '../user/user.model';
import { UserService } from './user.service';

@Injectable()
export class LoggedInUserService {
  private _loggedInUser: string;
  constructor(private _userService: UserService) {
    this._loggedInUser = 'Hu Ocean';
  }

  public get loggedInUser() {
    return this._userService.getUserByName(this._loggedInUser);
  }

  public set loggedInUser(user: User) {
    this._loggedInUser = user.firstname;
  }



}
