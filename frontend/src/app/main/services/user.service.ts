import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { LendObject, ShareType } from '../models/lend-object.model';
import { ObjectRequest } from '../models/object-request.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { Observable } from '../../../../node_modules/rxjs/Observable';
import { map, distinctUntilChanged } from 'rxjs/operators';
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';
import { interval } from 'rxjs/observable/interval';
@Injectable()
export class UserService {
  private _sub: any;
  private _users: User[];
  private _users$ = new BehaviorSubject<User[]>(undefined);
  private readonly _appUrl = '/API/users';

  constructor(private http: HttpClient) {
  this.getUsersFromServer();
  }

  public getUsersFromServer() {
    this.http
    .get(this._appUrl)
    .pipe(
      distinctUntilChanged(),
      map((list: any[]): User[] => list.map(user => User.fromJSON(user, true)))
    ).subscribe(
      users => {
        this._users = users;
        this._users$.next(this._users);
        console.log('fresh in');
        console.log(this._users);
      }
    );
  }

  get users(): BehaviorSubject<User[]> {
    if (this._users$) {
    return this._users$;
    }
    console.log('someone got no behaviour subject');
  }

  get userobjects(): User[] {
    return this._users;
  }

}
