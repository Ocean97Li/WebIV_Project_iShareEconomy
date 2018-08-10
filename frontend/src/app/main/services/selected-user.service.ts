import { Injectable, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { LendObject } from '../models/lend-object.model';
import { AuthenticationService } from '../../user/authentication.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MapSettingsService } from './map-settings.service';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Observable } from '../../../../node_modules/rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SelectedUserService {
  private _user$: BehaviorSubject<User>;
  private _user: User;
  private _userId: string;

  constructor(
    private _http: HttpClient,
    private userserv: UserService,
    private _mapserv: MapSettingsService
  ) {
    this._user$ = new BehaviorSubject<User>(undefined);
      this._user$.pipe(distinctUntilChanged()).subscribe(
        val => {
          this._user = val;
        }
      );
  }

  private mapToUserLocation() {
    if (this._user) {
      this._mapserv.position = this._user.mapLocation;
    }
  }

  public get name(): string {
    return this._user.name;
  }

  public get selectedUser(): BehaviorSubject<User> {
    return this._user$;
  }

}
