import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { LatLngBounds } from '@agm/core';
import { User } from './user/user.model';
import { UserService } from './services/user.service';
import { MapSettingsService } from './services/map-settings.service';
import { SelectedUserPanelComponent } from './selected-user-panel/selected-user-panel.component';
import 'hammerjs';
import { timeout, delay } from 'q';
import { GeolocationService } from './services/geolocation.service';
import { LoggedInUserService } from './services/logged-in-user.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public _open1 = false;
  public _display1 = false;
  public _open2 = false;
  public _display2 = false;
  private _selecteduser: User;
  private _geocoder;
  private _currentLoc;
  constructor(
    private _userService: UserService,
    private _mapSettings: MapSettingsService,
    private _geoService: GeolocationService,
    private _loggedInUserService: LoggedInUserService
  ) {}

  get users(): User[] {
    return this._userService.users;
  }

  newSelectedUser(user: User, drawerLeft: any) {
    if (user !== this._selecteduser) {
      if (user === this._loggedInUserService.loggedInUser) {
          return;
      }
      console.log('setting ' + user.firstname);
      if (!this._display1) {
        this.toggleNavLeft(drawerLeft);
      }
    this._selecteduser = user;
    } else {
      this.toggleNavLeft(drawerLeft);
    }
  }

  newUserAdded(user: User) {
    this._userService.addNewUser(user);
  }

  @Output()
  get selectedUser(): User {
    return this._selecteduser;
  }

  @Output()
  get loggedInUser(): User {
    return this._loggedInUserService.loggedInUser;
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


  public toggleNavLeft(drawerLeft) {
    this.toggleDisplay1();
    drawerLeft.toggle();
    this.toggleOpen1();
  }
  private toggleOpen1() {
    this._open1 = !this._open1;
    console.log(this._open1);
  }

  private toggleDisplay1() {
    // close
    if (this._open1) {
      this.toggleDisplayFalse1();
      console.log('called');
    } else { // open
      this._display1 = true;
    }
  }

  private async toggleDisplayFalse1() {
    delay(300).then(() => {
      console.log('waited!');
      this._display1 = false;
    });
  }

  private toggleOpen2() {
    this._open2 = !this._open2;
    console.log(this._open2);
  }

  private toggleDisplay2() {
    // close
    if (this._open2) {
      this.toggleDisplayFalse2();
      console.log('called');
    } else { // open
      this._display2 = true;
    }
  }

  private async toggleDisplayFalse2() {
    delay(300).then(() => {
      console.log('waited!');
      this._display2 = false;
    });
  }
}
