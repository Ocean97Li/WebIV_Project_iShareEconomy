import { Component, EventEmitter, Output } from '@angular/core';
import { LatLngBounds } from '@agm/core';
import { User } from './user/user.model';
import { UserService } from './services/user.service';
import { MapSettingsService } from './services/map-settings.service';
import { SelectedUserPanelComponent } from './selected-user-panel/selected-user-panel.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService, MapSettingsService],
})
export class AppComponent {
  private _selecteduser: User;
  constructor(private _userService: UserService, private _mapSettings: MapSettingsService) { }
  get users(): User[] {
    return this._userService.users;
  }

  newSelectedUser(user: User) {
    console.log('setting ' + user.firstname);
    this._selecteduser = user;
  }

  newUserAdded(user: User) {
    this._userService.addNewUser(user);
  }

  @Output() get selectedUser(): User {
    return this._selecteduser;
  }

  get title(): string {
    return this._mapSettings.title;
  }

  get lat(): number {
    return this._mapSettings.lat;
  }

  get lng(): number {
    return this._mapSettings.lng;
  }

    get zoom(): number {
    return this._mapSettings.zoom;
  }

   get label(): string {
    return this._mapSettings.label;
  }

   get streetViewControl(): boolean {
    return this._mapSettings.streetViewControl;
  }

   get zoomControl(): boolean {
    return this._mapSettings.zoomControl;
  }

   get styles(): Object[] {
    return this._mapSettings.styles;
  }
}

