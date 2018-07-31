import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user.model';

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
    this._currentSelectedUser = usr;

  }

  get sharing() {
    return this._currentSelectedUser.lending;
  }
  get using() {
    return this._currentSelectedUser.using;
  }
  get used() {
    return (this._currentSelectedUser !== undefined);
  }
  get name() {
    if (this._currentSelectedUser === undefined) {
      return '';
    }
    return this._currentSelectedUser.name;
  }
  get address() {
    return `
    ${this._currentSelectedUser.address} ${this._currentSelectedUser.extraAddressLine}
    `;
  }

  get rating() {
    return new Array<number>(this._currentSelectedUser.rating);
  }
  ngOnInit() {
  }

}
