import { Injectable, OnInit } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { MapSettingsService } from './map-settings.service';
import { RegisterComponent } from '../../user/register/register.component';
declare let google: any;
@Injectable()
export class GeolocationService implements OnInit {
  public google: any;
  private _geocoder: any;
  private _currentLoc: any;
  private busy = false;
  private _currentAddress = 'hello!';
  constructor(public mapsApiLoader: MapsAPILoader, private _mapsSettingsService: MapSettingsService) {
    this.findCurrentLocation();
    this.mapsApiLoader.load().then(() => {
      this._geocoder = new google.maps.Geocoder();
      console.log(this._geocoder);
    });
  }

  ngOnInit(): void {
    this._geocoder = new google.maps.Geocoder();
    console.log(this._geocoder);
  }

  findCurrentLocation(): any {
    if (!this._currentLoc) {
      if (navigator.geolocation) {
          this._currentLoc = navigator.geolocation.getCurrentPosition(this.showPosition);
      } else {
          console.log('Geolocation is not supported by this browser.');
      }
    }
    return this._currentLoc;
  }

  showPosition(position) {
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
    position = {
      'lat': position.coords.latitude,
      'lng': position.coords.longitude
    };
    return position;
  }

  returnLocation(location) {
    return location;
  }
  public reverseGeo(location: { lat: number; lng: number }): boolean {
    if (this._geocoder) {
         this._geocoder.geocode({ location: location }, function(results, status): any {
        if (status === 'OK') {
          if (results[0]) {
            const address = results[0].formatted_address;
            RegisterComponent.observer$.next(address);
          } else {
            window.alert('No results found');
          }
        } else {
        }
      });
    } else {
      console.log('geocoder not yet available');
    }
    return true;
}
}

