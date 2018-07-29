import { Injectable } from '@angular/core';
import { User } from '../user/user.model';
import { UserService } from './user.service';
import { LendObject } from '../lend-object/lend-object.model';

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

  public addNewLendObject(object: LendObject) {
    // temporary
    object.addUser(this.loggedInUser);
    this._userService.addObjectToUser(object, this.loggedInUser);

  }

  removeObject(selected: LendObject): void {
    //
  }



}
