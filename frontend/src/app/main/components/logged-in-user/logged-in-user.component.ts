import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { LoggedInUserService } from '../../services/logged-in-user.service';
import { LendObject } from '../../models/lend-object.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ObjectRequest } from '../../models/object-request.model';
@Component({
  selector: 'app-logged-in-user',
  templateUrl: './logged-in-user.component.html',
  styleUrls: ['./logged-in-user.component.css']
})
export class LoggedInUserComponent implements OnInit {
  private _refreshB1 = true;
  private _refreshB2 = true;
  private _display = false;
  private user: User;
  private user$: BehaviorSubject<User>;
  constructor(private loggedInUserService: LoggedInUserService) {
    this.user$ = this.loggedInUserService.loggedInUser;
    this.user$.subscribe(val => {
      if (val !== null) {
        this.user = val;
      }
    });
   }

  get display() {
    return (this.user !== undefined);
  }
  get name() {
    if (this.user === undefined) {
      return 'Loading name...';
    }
    return this.user.name;
  }
  get address() {
    if (this.user === undefined) {
      return 'Loading address...';
    }
    return `
    ${this.user.address}`;
  }

  get rating() {
    if (this.user !== undefined) {
      return this.user.rating;
    }
  }

  get sharing() {
    if (this.user === undefined) {
      return [];
    }
    return this.user.lending;
  }

  get using() {
    if (this.user === undefined) {
      return [];
    }
    return this.user.using;
  }

  get inRequests() {
    if (this.user === undefined) {
      return [];
    }
    return this.user.inRequest;
  }

  get outRequests() {
    if (this.user === undefined) {
      return [];
    }
    return this.user.outRequest;
  }

  /**
   * Getter refreshB1
   * @return {boolean}
   */
  public get refreshB1(): boolean {
    return this._refreshB1;
  }

  /**
   * Getter refreshB2
   * @return {boolean}
   */
  public get refreshB2(): boolean {
    return this._refreshB2;
  }

  refreshInRequests(): void {
    if (this._refreshB1) {
      this._refreshB1 = false;
      this.loggedInUserService.fetchInRequest();
      this.refreshButtonPressed(true);
      this.loggedInUserService.getUsersFromServer();
    }
  }

  refreshOutRequests(): void {
    if (this._refreshB2) {
      this._refreshB2 = false;
      this.loggedInUserService.fetchOutRequest();
      this.refreshButtonPressed(false);
      this.loggedInUserService.getUsersFromServer();
    }
  }

  removeInRequest(request: ObjectRequest) {
    if (request.approved !== undefined) {
      console.log(request.approved);
      this.loggedInUserService.removeInRequest(request);
    }
  }

  removeOutRequest(request: ObjectRequest) {
    if (request.approved !== true) {
    this.loggedInUserService.removeOutRequest(request);
    }
  }

  private refreshButtonPressed(b1: boolean) {
    if (b1) {
      setTimeout(() => {
        console.log(this._refreshB1);
        console.log('arrived');
        this._refreshB1 = true;
      }, 5000);
    } else {
        setTimeout(() => {
          console.log(this._refreshB2);
          console.log('arrived');
          this._refreshB2 = true;
        }, 5000);
    }
  }

  ngOnInit() {
  }

}
