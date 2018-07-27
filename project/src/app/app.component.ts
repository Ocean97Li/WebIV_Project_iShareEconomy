import { Component, Output, OnInit } from '@angular/core';
import { LatLngBounds } from '@agm/core';
import { User } from './user/user.model';
import { UserService } from './services/user.service';
import { MapSettingsService } from './services/map-settings.service';
import { SelectedUserPanelComponent } from './selected-user-panel/selected-user-panel.component';
import 'hammerjs';
import { timeout, delay } from 'q';
import { GeolocationService } from './services/geolocation.service';
import { LoggedInUserService } from './services/logged-in-user.service';
import { Subject } from '../../node_modules/rxjs/Subject';
import {
  distinctUntilChanged,
  debounceTime,
  map,
  filter
} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public _open1 = false;
  public _display1 = false;
  public _open2 = false;
  public _display2 = false;
  public filterUser$ = new Subject<string>();
  private _selecteduser: User;
  private _geocoder;
  private _currentLoc;
  private _filtername: string;
  public searchType: string;
  public search: boolean;
  public readonly searchTypes = ['User', 'Object', 'Address'];
  constructor(
    private _userService: UserService,
    private _mapSettings: MapSettingsService,
    private _geoService: GeolocationService,
    private _loggedInUserService: LoggedInUserService
  ) {
    this.filterUser$.pipe(debounceTime(400)).subscribe(val => {
      this._filtername = val;
      console.log(val);
    });
  }

  ngOnInit(): void {
    this._currentLoc = this._geoService.findCurrentLocation();
  }

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

  get filtername(): string {
    return this._filtername;
  }

  public toggleNavLeft(drawerLeft) {
    this.toggleDisplay1();
    drawerLeft.toggle();
    this.toggleOpen1();
  }

  public toggleNavRight(drawerRight) {
    this.toggleDisplay2();
    drawerRight.toggle();
    this.toggleOpen2();
  }

  private toggleOpen1() {
    this._open1 = !this._open1;
    if (this._open1) {
      this.search = false;
    }
  }

  private toggleDisplay1() {
    // close
    if (this._open1) {
      this.toggleDisplayFalse1();
    } else {
      // open
      this._display1 = true;
    }
  }

  private toggleDisplayFalse1() {
    delay(30).then(() => {
      this._display1 = false;
    });
  }

  private toggleOpen2() {
    this._open2 = !this._open2;
    if (this._open2) {
      this.search = false;
    }
  }

  private toggleDisplay2() {
    // close
    if (this._open2) {
      this.toggleDisplayFalse2();
      console.log('called');
    } else {
      // open
      this._display2 = true;
    }
  }

  private toggleDisplayFalse2() {
    delay(30).then(() => {
      console.log('waited!');
      this._display2 = false;
    });
  }

  public toggleSearch(drawerLeft, drawerRight) {
    this.search = !this.search;
    if (this.search) {
      if (this._open2) {
        // opening
        this.toggleNavRight(drawerRight);
      } else {
        // closing
      }
      if (this._open1) {
        // opening
        this.toggleNavLeft(drawerLeft);
      } else {
        // closing
      }
    }
  }
}
