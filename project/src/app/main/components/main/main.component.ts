import { Component, Output, OnInit, Input } from '@angular/core';
import { LatLngBounds } from '@agm/core';
import { UserService } from '../../services/user.service';
import { MapSettingsService } from '../../services/map-settings.service';
import { SelectedUserPanelComponent } from '../selected-user-panel/selected-user-panel.component';
import 'hammerjs';
import { timeout, delay } from 'q';
import { GeolocationService } from '../../services/geolocation.service';
import { LoggedInUserService } from '../../services/logged-in-user.service';
import { Subject } from 'rxjs/Subject';
import {
  distinctUntilChanged,
  debounceTime,
  map,
  filter
} from 'rxjs/operators';
import { ShareType } from '../../models/lend-object.model';
import { UserFilterPipe } from '../user/user-filter.pipe';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public _open1 = false;
  public _display1 = false;
  public _open2 = false;
  public _display2 = false;
  private _selecteduser: User;
  private _geocoder;
  private _currentLoc;
  public filtername: string;
  public searchType: string;
  public search: boolean;
  public dissappearAnimation: boolean;
  private _users = new Array<User>();
  constructor(
    private _userService: UserService,
    private _mapSettings: MapSettingsService,
    private _geoService: GeolocationService,
    private _loggedInUserService: LoggedInUserService
  ) {
    this.searchType = 'User';
    this.filtername = '';
  }

  ngOnInit(): void {
    this._currentLoc = this._geoService.findCurrentLocation();
    this._users = this._userService.users;
  }

  // display component

  get users(): User[] {
    return this._users;
  }

  newSelectedUser(user: User, drawerLeft: any, drawerRight) {
    if (user === this._loggedInUserService.loggedInUser) {
      this.toggleNavRight(drawerRight);
    } else {
      if (user !== this._selecteduser) {
        if (!this._display1) {
          this.toggleNavLeft(drawerLeft);
        }
        this._selecteduser = user;
      } else {
        this.toggleNavLeft(drawerLeft);
      }
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
   // map component
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


  // display component

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
      this.dissappearAnimation = true;
      setTimeout(() => {
        this.search = false;
      }, 500);
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
      this.dissappearAnimation = true;
      setTimeout(() => {
        this.search = false;
      }, 500);
    }
  }

  private toggleDisplay2() {
    // close
    if (this._open2) {
      this.toggleDisplayFalse2();
    } else {
      // open
      this._display2 = true;
    }
  }

  private toggleDisplayFalse2() {
    delay(30).then(() => {
      this._display2 = false;
    });
  }

  // search
  public toggleSearch(drawerLeft, drawerRight) {
    if (this.search) {
      this.dissappearAnimation = true;
      setTimeout(() => {
        this.handleToggleSearch(drawerLeft, drawerRight);
      }, 500);
    } else {
      this.dissappearAnimation = false;
      this.handleToggleSearch(drawerLeft, drawerRight);
    }
  }

  public newSearch(search: string[]) {
    console.log('received');
    this.filtername = search[0];
    this.searchType = search[1];
    const pipe =  new UserFilterPipe();
    const users = pipe.transform(this._users, this.filtername, this.searchType);
    if (users.length >= 2) {
      this._mapSettings.position = users[0].mapLocation;
      this._mapSettings.zoom = 10;
    } else if (users.length === 1) {
      this._mapSettings.position = users[0].mapLocation;
      this._mapSettings.zoom = 18;
    }
    console.log(this.filtername);
    console.log(this.searchType);
  }

  private handleToggleSearch(drawerLeft, drawerRight) {
    this.search = !this.search;
    if (this.search) {
      if (this._open2) {
        // opening
        this.toggleNavRight(drawerRight);
      }
      if (this._open1) {
        // opening
        this.toggleNavLeft(drawerLeft);
      }
    }
  }

}
