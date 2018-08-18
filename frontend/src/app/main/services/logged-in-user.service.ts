import { Injectable, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { LendObject } from '../models/lend-object.model';
import { AuthenticationService } from '../../user/authentication.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MapSettingsService } from './map-settings.service';
import { map, catchError, distinctUntilChanged } from 'rxjs/operators';
import { Observable } from '../../../../node_modules/rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { ObjectRequest } from '../models/object-request.model';
import { interval } from '../../../../node_modules/rxjs/observable/interval';
import { RealTimeService } from '../../user/real-time.service';

@Injectable()
export class LoggedInUserService {
  private _user$: BehaviorSubject<User>;
  private _user: User;
  private _id: string;
  private _users: User[];
  private _users$ = new BehaviorSubject<User[]>(undefined);

  constructor(
    private _realtime: RealTimeService,
    private _http: HttpClient,
    private _authService: AuthenticationService,
    private _mapserv: MapSettingsService
  ) {
    this._user$ = new BehaviorSubject<User>(undefined);
    this._authService.user$.subscribe(val => {
      this._id = val;
      if (this._id) {
        this.getUsersFromServer();
        this.loggedInUserfromUsers();
      }
    });
  }

  private loggedInUserfromUsers() {
    this.users.subscribe(users => {
      if (users) {
        this._user = users.find(usr => usr.id === this._id);
        this._user$.next(this._user);
        this.mapToUserLocation();
        this.fetchInRequest();
        this.fetchOutRequest();
      } else {
        console.log('something went wrong');
        this.getUsersFromServer();
      }
    });
  }

  public fetchOutRequest() {
    if (this._id) {
      this._http
        .get(`/API/users/${this._id}/outrequest`)
        .pipe(
          map(
            (list: any[]): ObjectRequest[] => list.map(ObjectRequest.fromJSON)
          )
        )
        .subscribe(reqs => {
          this._user.outRequest = reqs;
          this._user$.next(this._user);
        });
    }
  }

  public fetchInRequest() {
    if (this._id) {
      this._http
        .get(`/API/users/${this._id}/inrequest`)
        .pipe(
          distinctUntilChanged(),
          map(
            (list: any[]): ObjectRequest[] => list.map(ObjectRequest.fromJSON)
          )
        )
        .subscribe(reqs => {
          this._user.inRequest = reqs;
          this._user$.next(this._user);
        });
    }
  }

  public approveRequest(req: ObjectRequest) {
    const id = req.id;
    const url = `/API/users/${this._id}/inRequest/${id}/approve`;
    this._http
      .post(url, undefined)
      .pipe(map((val: any) => ObjectRequest.fromJSON(val)))
      .subscribe(request => {
        this._user.lending[
          this._user.lending.findIndex(ob => ob.id === request.object.id)
        ] = request.object;
        this.loggedInUser.next(this._user);
        this.fetchInRequest();
      });
  }

  public returnLendoBject(obj: LendObject) {
    const id = obj.id;
    const url = `/API/users/${this._id}/using/${id}/return`;
    this._http
      .post(url, undefined)
      .pipe(map((val: any) => LendObject.fromJSON(val)))
      .subscribe(lo => {
        this._user.using = this._user.using.filter(object => obj.id !== lo.id);
        this._user$.next(this._user);
      });
  }

  public denyRequest(req: ObjectRequest) {
    const id = req.id;
    const url = `/API/users/${this._id}/inRequest/${id}/deny`;
    this._http
      .post(url, undefined)
      .pipe(map((val: any) => ObjectRequest.fromJSON(val)))
      .subscribe(request => {
        this._user.lending[
          this._user.lending.findIndex(ob => ob.id === request.object.id)
        ] = request.object;
        this.loggedInUser.next(this._user);
      });
  }

  public removeInRequest(req: ObjectRequest) {
    const id = req.id;
    const url = `/API/users/${this._id}/inRequest/${id}`;
    this._http
      .delete(url)
      .pipe(map((val: any) => ObjectRequest.fromJSON(val)))
      .subscribe(request => {
        this._user.inRequest = this._user.inRequest.filter(
          r => r.id !== request.id
        );
        this._user$.next(this._user);
      });
  }

  public removeOutRequest(req: ObjectRequest) {
    const id = req.id;
    const url = `/API/users/${this._id}/outRequest/${id}`;
    this._http
      .delete(url)
      .pipe(map((val: any) => ObjectRequest.fromJSON(val)))
      .subscribe(request => {
        this._user.inRequest = this._user.inRequest.filter(
          r => r.id !== request.id
        );
        this._user$.next(this._user);
      });
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
    this._http.post(url, lo.toJSON()).subscribe(val => {
      this._user.lending.push(LendObject.fromJSON(val));
      this.getUsersFromServer();
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
    const obsv = new BehaviorSubject<boolean>(undefined);
    let url = `/API/check/request`;
    this._http.post(url, request.toJSON()).subscribe((result: any) => {
      if (result.state) {
        switch (result.state) {
          case 'invalid dates': {
            obsv.next(false);
            break;
          }
          case 'request conflict': {
            obsv.next(false);
            break;
          }
          case 'ok': {
            url = `/API/users/${this._id}/outrequest`;
            this._http
              .post(url, request.toJSON())
              .pipe(map(ob => ObjectRequest.fromJSON(ob)))
              .subscribe(val => {
                this._user.outRequest.push(val);
                this._user$.next(this._user);
                obsv.next(true);
              });
            break;
          }
        }
      }
    });
    return obsv;
  }

  public getUsersFromServer() {
    const url = `/API/users/${this._id}/users`;
    this._http
      .get(url)
      .pipe(
        distinctUntilChanged(),
        map(
          (list: any[]): User[] => list.map(user => User.fromJSON(user, true))
        )
      )
      .subscribe(users => {
        this._users = users;
        this._users$.next(this._users);
        console.log(this._users);
      });
  }

  get users(): BehaviorSubject<User[]> {
    if (this._users$) {
      return this._users$;
    }
  }

  get userobjects(): User[] {
    return this._users;
  }
}
