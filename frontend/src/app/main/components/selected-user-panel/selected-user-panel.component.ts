import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { SelectedUserService } from '../../services/selected-user.service';

@Component({
  selector: 'app-selected-user-panel',
  templateUrl: './selected-user-panel.component.html',
  styleUrls: ['./selected-user-panel.component.css']
})
export class SelectedUserPanelComponent implements OnInit {
  private _currentSelectedUser: User;
  private _used = false;
  constructor(private selectedUserServ: SelectedUserService) {
    selectedUserServ.selectedUser.subscribe(
      val => {
        if (val) {
          this._currentSelectedUser = val;
        }
      }
    );
   }
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
    ${this._currentSelectedUser.address}`;
  }

  get distance() {
    if (this.currentSelectedUser) {
      return '';
    }
    return this._currentSelectedUser.distance.toFixed(1);
  }

  get rating() {
   return this._currentSelectedUser.rating;
  }
  ngOnInit() {
  }

}
