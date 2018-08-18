import { Injectable, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { LendObject } from '../models/lend-object.model';
import { AuthenticationService } from '../../user/authentication.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MapSettingsService } from './map-settings.service';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Observable } from '../../../../node_modules/rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { ObjectRequest } from '../models/object-request.model';

@Injectable()
export class SelectedUserService {
  private _user$: BehaviorSubject<User>;
  private _user: User;
  private _id: string;

  constructor(
    private _http: HttpClient,
    private _mapserv: MapSettingsService
  ) {
    this._user$ = new BehaviorSubject<User>(undefined);
      this._user$.pipe(distinctUntilChanged()).subscribe(
        val => {
          this._user = val;
          if (val) {
            this._id = val.id;
            this.fetchInRequest();
            this.fetchOutRequest();
          }
        }
      );
  }

  public get name(): string {
    return this._user.name;
  }

  public get selectedUser(): BehaviorSubject<User> {
    return this._user$;
  }

  public fetchOutRequest() {
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

  public fetchInRequest() {
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

}
