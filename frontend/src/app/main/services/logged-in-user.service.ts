import { Injectable, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { LendObject } from '../models/lend-object.model';
import { AuthenticationService } from '../../user/authentication.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MapSettingsService } from './map-settings.service';
import { map, catchError } from 'rxjs/operators';
import { Observable } from '../../../../node_modules/rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { ObjectRequest } from '../models/object-request.model';
import { interval } from '../../../../node_modules/rxjs/observable/interval';

@Injectable()
export class LoggedInUserService {
  private _user$: BehaviorSubject<User>;
  private _user: User;
  private _id: string;
  private _sub: any;

  constructor(
    private _http: HttpClient,
    private _authService: AuthenticationService,
    private userserv: UserService,
    private _mapserv: MapSettingsService
  ) {
    this._user$ = new BehaviorSubject<User>(undefined);
    this._authService.user$.subscribe(val => {
      this.userserv.getUsersFromServer();
      this._id = val;
      if (this._id) {
        console.log('changed id');
        console.log(this._id);
        this.loggedInUserfromUsers();
      }
    });
  }

  private loggedInUserfromUsers() {
    this.userserv.users.subscribe(users => {
      if (users) {
        this._user = users.find(usr => usr.id === this._id);
        this._user$.next(this._user);
        this.mapToUserLocation();
        this.fetchInRequest();
        this.fetchOutRequest();
      } else {
        console.log('something went wrong');
        this.userserv.getUsersFromServer();
      }
    });
  }

  private fetchOutRequest() {
    if (this._id) {
    console.log('udpated from server');
    this._http
      .get(`/API/users/${this._id}/outrequest`)
      .pipe(map((list: any[]): ObjectRequest[] => list.map(ObjectRequest.fromJSON)))
      .subscribe(reqs => {
        console.log('outrequest');
        console.log(reqs);
        this._user.outRequest = reqs;
        this._user$.next(this._user);
      });
    }
  }

  private fetchInRequest() {
    if (this._id) {
    console.log('udpated from server');
    this._http
      .get(`/API/users/${this._id}/inrequest`)
      .pipe(map((list: any[]): ObjectRequest[] => list.map(ObjectRequest.fromJSON)))
      .subscribe(reqs => {
        console.log('inrequest');
        console.log(reqs);
        this._user.inRequest = reqs;
        this._user$.next(this._user);
      });
    }
  }

  private mapToUserLocation() {
    if (this._user) {
      this._mapserv.position = this._user.mapLocation;
    }
  }

  public get loggedInUser(): BehaviorSubject<User> {
    return this._user$;
  }

  public addNewLendObject(obj: any): void {
   const url = `/API/users/${this._id}/lending`;
    const lo = new LendObject(
      obj.name,
      obj.desc,
      obj.type,
      { id: this._id, name: this._user.name },
      obj.rules
    );
    console.log(lo);
    console.log(this._id);
    console.log(lo.toJSON());
    this._http.post(url, lo.toJSON()).subscribe(val => {
      this._user.lending.push(LendObject.fromJSON(val));
    });
  }

  public removeObject(objectId: string): void {
    const url = `/API/users/${this._id}/lending/${objectId}`;
    this._http
      .delete(url)
      .pipe(map(o => LendObject.fromJSON(o)))
      .subscribe(val => {
        this._user.removeLendingObject(val);
        this._user$.next(this._user);
      });
  }

  public addNewRequest(request: ObjectRequest) {
    let url = `/API/check/request`;
    console.log(request.toJSON());
    this._http.post(url, request.toJSON()).subscribe(
      (result: any) => {
        if (result.state) {
          switch (result.state) {
            case 'invalid dates': {
              console.log('invalid dates');
              break;
            }
            case 'request conflict': {
              console.log('invalid dates');
              break;
            }
            case 'ok': {
              url = `/API/users/${this._id}/outrequest`;
              this._http
                .post(url, request.toJSON())
                .pipe(map(ob => ObjectRequest.fromJSON(ob)))
                .subscribe(val => {
                  console.log(val);
                  this._user.outRequest.push(val);
                  this._user$.next(this._user);
                });
              break;
            }
          }

        }
      }
    );
  }
}
