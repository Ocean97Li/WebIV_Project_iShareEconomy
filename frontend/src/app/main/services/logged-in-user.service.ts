import { Injectable, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { LendObject } from '../models/lend-object.model';
import { AuthenticationService } from '../../user/authentication.service';
import { BehaviorSubject } from '../../../../node_modules/rxjs/BehaviorSubject';
import { MapSettingsService } from './map-settings.service';
import { map } from '../../../../node_modules/rxjs/operators';
import { Observable } from '../../../../node_modules/rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoggedInUserService {
  private _user$: BehaviorSubject<User>;
  private _user: User;
  private _id: string;

  constructor(
    private _http: HttpClient,
    private _authService: AuthenticationService,
    private userserv: UserService,
    private _mapserv: MapSettingsService
    ) {
      this._user$ = new BehaviorSubject<User>(null);
      this._authService.user$.subscribe(
        val => {
          this.loggedInUserFromServer();
          this._id = val;
          console.log('1. new user logged in');
          console.log(this._id);
        }
      );
  }

  private loggedInUserFromServer() {
    console.log('2 called');
    this.userserv.users.subscribe(
      users => {
      this._user = users.find(usr => usr.id === this._id);
      console.log('2. getting that user');
      console.log('2.2 packaging and posting it');
      this._user$.next(this._user);
      this.mapToUserLocation();
    });
  }

  private mapToUserLocation() {
    if (this._user) {
      this._mapserv.position = this._user.mapLocation;
    }
  }

  public get loggedInUser(): BehaviorSubject<User> {
    console.log('3. returning that user');
    return this._user$;
  }

  public addNewLendObject(obj: any): void {
    const url =  `/API/users/${this._id}/lending`;
    const lo = new LendObject(
      obj.name,
      obj.desc,
      obj.type,
      {id: this._id, name: this._user.name},
      obj.rules
    );
    console.log(lo.toJSON());
    this._http.post(url, lo.toJSON()).subscribe(
      val => {
        this._user.lending.push(LendObject.fromJSON(val));
      }
    );
  }

  public removeObject(objectId: string):  void {
    const url =  `/API/users/${this._id}/lending/${objectId}`;
     this._http.delete(url).pipe(map(o => LendObject.fromJSON(o))).subscribe(
      val => {
        this._user.removeLendingObject(val);
        this._user$.next(this._user);
      }
    );
  }

}
