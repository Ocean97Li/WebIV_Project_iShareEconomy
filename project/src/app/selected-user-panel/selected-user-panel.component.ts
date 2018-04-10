import { Component, OnInit, Input } from '@angular/core';
import { User } from '../user/user.model';

@Component({
  selector: 'app-selected-user-panel',
  templateUrl: './selected-user-panel.component.html',
  styleUrls: ['./selected-user-panel.component.css']
})
export class SelectedUserPanelComponent implements OnInit {
  private _currentSelectedUser: User;
  private _used = false;
  constructor() { }
  @Input() set currentSelectedUser(usr: User) {
    console.log('new user arrived');
    this._currentSelectedUser = usr;

  }
  get used() {
    return (this._currentSelectedUser !== undefined);
  }
  get name() {
    if (this._currentSelectedUser === undefined) {
      return '';
    }
    return `${this._currentSelectedUser.firstname} ${this._currentSelectedUser.lastname}`;
  }
  get address() {
    return `
    ${this._currentSelectedUser.streetname} ${this._currentSelectedUser.housenumber}
    ${this._currentSelectedUser.postalcode}
    `;
  }

  get rating() {
    return new Array<number>(this._currentSelectedUser.rating);
  }
  ngOnInit() {
  }

}
