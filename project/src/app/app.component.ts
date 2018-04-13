import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { LatLngBounds } from '@agm/core';
import { User } from './user/user.model';
import { UserService } from './services/user.service';
import { MapSettingsService } from './services/map-settings.service';
import { SelectedUserPanelComponent } from './selected-user-panel/selected-user-panel.component';
import { MapsAPILoader } from '@agm/core';
import 'hammerjs';
import { timeout } from 'q';
declare let google: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService, MapSettingsService]
})
export class AppComponent {
  private _selecteduser: User;
  private _geocoder;
  private _currentLoc;
  constructor(
    public mapsApiLoader: MapsAPILoader,
    private _userService: UserService,
    private _mapSettings: MapSettingsService
  ) {
    this.findCurrentLocation();
    this.mapsApiLoader.load().then(() => {
      console.log('google script loaded');
      this._geocoder = new google.maps.Geocoder();
      console.log(this._geocoder);
    });
  }
  get users(): User[] {
    return this._userService.users;
  }

  newSelectedUser(user: User) {
    console.log('setting ' + user.firstname);
    this._selecteduser = user;
    this.reverseGeo(user.mapLocation);
  }

  private findCurrentLocation() {
    let pos;
    navigator.geolocation.getCurrentPosition(
      function() {}, function(e) {}, {}
    );
    navigator.geolocation.getCurrentPosition(
      function(position) {
        console.log(position.coords.latitude + ' ' + position.coords.longitude);
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      },
      function(e) {
        console.log('current location not found');
      },
      {
        maximumAge: 100,
        timeout: 90000
      }
    );
    this._currentLoc = pos;
  }

  private reverseGeo(location: { lat: number; lng: number }) {
    this._geocoder.geocode({ location: location }, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          console.log(results[0].formatted_address);
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
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
}
