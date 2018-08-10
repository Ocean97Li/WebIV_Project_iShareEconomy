import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { LoggedInUserService } from '../../services/logged-in-user.service';
import { LendObject } from '../../models/lend-object.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Component({
  selector: 'app-logged-in-user',
  templateUrl: './logged-in-user.component.html',
  styleUrls: ['./logged-in-user.component.css']
})
export class LoggedInUserComponent implements OnInit {
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
    if (this.user === undefined) {
      return new Array<number>(0);
    }
    return new Array<number>(this.user.rating);
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
  ngOnInit() {
  }

}
