import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { LatLngBounds } from '@agm/core';
import { User } from './user/user.model';
import { UserService } from './services/user.service';
import { MapSettingsService } from './services/map-settings.service';
import { SelectedUserPanelComponent } from './selected-user-panel/selected-user-panel.component';
import 'hammerjs';
import { timeout, delay } from 'q';
import { GeolocationService } from './services/geolocation.service';
declare let google: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService, MapSettingsService, GeolocationService]
})
export class AppComponent {
  public _open1 = false;
  public _display = false;
  public _open2 = false;
  private _selecteduser: User;
  private _geocoder;
  private _currentLoc;
  constructor(
    private _userService: UserService,
    private _mapSettings: MapSettingsService,
    private _geoService: GeolocationService
  ) {}

  get users(): User[] {
    return this._userService.users;
  }

  newSelectedUser(user: User) {
    console.log('setting ' + user.firstname);
    this._selecteduser = user;
    this._geoService.reverseGeo(user.mapLocation);
  }

  newUserAdded(user: User) {
    this._userService.addNewUser(user);
  }

  @Output()
  get selectedUser(): User {
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


  toggleOpen1() {
    this._open1 = !this._open1;
    console.log(this._open1);
  }

  toggleDisplay() {
    // close
    if (this._open1) {
      this.toggleDisplayFalse();
      console.log('called');
    } else { // open
      this._display = true;
    }
  }

  async toggleDisplayFalse() {
    delay(300).then(() => {
      console.log('waited!');
      this._display = false;
    });
  }



}
