import { Component, OnInit, Input } from '@angular/core';
import { User } from '../user/user.model';
import { LoggedInUserService } from '../services/logged-in-user.service';
import { LendObject } from '../lend-object/lend-object.model';
@Component({
  selector: 'app-logged-in-user',
  templateUrl: './logged-in-user.component.html',
  styleUrls: ['./logged-in-user.component.css']
})
export class LoggedInUserComponent implements OnInit {
  private _display = false;
  constructor(private loggedInUserService: LoggedInUserService) { }

  @Input() set currentLoggedInUser(usr: User) {
    this.loggedInUserService.loggedInUser = usr;
  }

  @Input() addNewLendObject(object: LendObject) {
    this.loggedInUserService.addNewLendObject(object);
  }
  get display() {
    return (this.loggedInUserService.loggedInUser !== undefined);
  }
  get name() {
    if (this.loggedInUserService.loggedInUser === undefined) {
      return '';
    }
    return `${this.loggedInUserService.loggedInUser.firstname} ${this.loggedInUserService.loggedInUser.lastname}`;
  }
  get address() {
    return `
    ${this.loggedInUserService.loggedInUser.address} ${this.loggedInUserService.loggedInUser.extraAddressLine}
    `;
  }

  get rating() {
    return new Array<number>(this.loggedInUserService.loggedInUser.rating);
  }

  get sharing() {
    return this.loggedInUserService.loggedInUser.lending;
  }

  get using() {
    return this.loggedInUserService.loggedInUser.using;
  }

  get inRequests() {
    return this.loggedInUserService.loggedInUser.inRequest;
  }

  get outRequests() {
    return this.loggedInUserService.loggedInUser.outRequest;
  }
  ngOnInit() {
  }

}
