import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { LendObject } from '../models/lend-object.model';
import { AuthenticationService } from '../../user-auth/authentication.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MapSettingsService } from './map-settings.service';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ObjectRequest } from '../models/object-request.model';
import { RealTimeService } from '../../user-auth/real-time.service';

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
        this._realtime.startCommunication(this._id);
        this.getUsersFromServer();
        this._users$.subscribe(users => {
          if (users) {
            users.forEach(user => this._realtime.startListeningTo(user.id));
          }
        });
        this.loggedInUserfromUsers();
        // listen for updates
        this._realtime.listenForCommunication().subscribe(id => {
          this._realtime.startCommunication(id);
        });
        this._realtime.listenForAddRemoveObject().subscribe(id => {
          if (id) {
            this.getUsersFromServer();
          }
        });
        this._realtime.listenForInRequest().subscribe(id => {
          if (id) {
            this.fetchInRequest();
          }
        });
        this._realtime.listenForApproveDenyRequest().subscribe(id => {
          if (id) {
            this.getUsersFromServer();
          }
        });
        this._realtime.listenForReturnObject().subscribe(id => {
          if (id) {
            this.getUsersFromServer();
          }
        });
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
        this.getUsersFromServer();
      }
    });
  }

  public fetchLending(fromId: string) {
    if (this._id) {
      this._http
        .get(`/API/users/${fromId}/lending`)
        .pipe(map((list: any[]): LendObject[] => list.map(LendObject.fromJSON)))
        .subscribe(los => {
          this._users[
            this._users.findIndex(u => u.id === fromId)
          ].lending = los;
          this._users$.next(this._users);
        },
        () => {
          this.getUsersFromServer();
        });
    }
  }

  public fetchUsing(fromId: string) {
    if (this._id) {
      this._http
        .get(`/API/users/${fromId}/using`)
        .pipe(map((list: any[]): LendObject[] => list.map(LendObject.fromJSON)))
        .subscribe(los => {
          this._user.using = los;
          this._user$.next(this._user);
        },
        () => {
          this.getUsersFromServer();
        });
    }
  }

  public fetchUser(userid) {
    if (userid) {
      this._http
        .get(`/API/users/${this._id}`)
        .pipe(map(u => User.fromJSON(u, true)))
        .subscribe(user => {
          if (user) {
            this._users[this._users.findIndex(u => u.id === user.id)].rating =
              user.rating;
            this._users[this._users.findIndex(u => u.id === user.id)].lending =
              user.lending;
            this._users[this._users.findIndex(u => u.id === user.id)].using =
              user.lending;
            this._users$.next(this._users);
          }
        },
        () => {
          this.getUsersFromServer();
        });
    }
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
        },
        () => {
          this.getUsersFromServer();
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
        },
        () => {
          this.getUsersFromServer();
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
        this._realtime.signalApproveDenyRequestToUser(request.source.id);
      },
      () => {
        this.getUsersFromServer();
      });
  }

  public returnLendoBject(obj: LendObject) {
    const id = obj.id;
    const url = `/API/users/${this._id}/using/${id}/return`;
    this._http
      .post(url, undefined)
      .pipe(map((val: any) => LendObject.fromJSON(val)))
      .subscribe(lo => {
        this._realtime.signalReturnObject(lo.owner.id);
        this.getUsersFromServer();
        this.loggedInUserfromUsers();
      },
      () => {
        this.getUsersFromServer();
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
        this.fetchInRequest();
        this._realtime.signalApproveDenyRequestToUser(request.object.owner.id);
      },
      () => {
        this.getUsersFromServer();
      });
  }

  public removeInRequest(req: ObjectRequest) {
    const id = req.id;
    const url = `/API/users/${this._id}/inRequest/${id}`;
    this._http
      .delete(url)
      .pipe(map((val: any) => ObjectRequest.fromJSON(val)))
      .subscribe(request => {
        this.fetchInRequest();
      },
      () => {
        this.getUsersFromServer();
      }
    );
  }

  public removeOutRequest(req: ObjectRequest) {
    const id = req.id;
    const url = `/API/users/${this._id}/outRequest/${id}`;
    this._http
      .delete(url)
      .pipe(map((val: any) => ObjectRequest.fromJSON(val)))
      .subscribe(() => {
          this.fetchOutRequest();
        },
        () => {
          this.getUsersFromServer();
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
      this._realtime.signalAddRemoveObject(this._id);
      this.getUsersFromServer();
    },
    () => {
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
        this._realtime.signalAddRemoveObject(this._id);
      },
      () => {
        this.getUsersFromServer();
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
                this._realtime.signalInRequestSentToUser(val.object.owner.id);
                this._user.outRequest.push(val);
                this._user$.next(this._user);
                obsv.next(true);
              });
            break;
          }
        }
      }
    },
    () => {
      this.getUsersFromServer();
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
