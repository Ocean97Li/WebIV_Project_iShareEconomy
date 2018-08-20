import { Injectable, OnInit } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { MapSettingsService } from './map-settings.service';
import { Subject } from 'rxjs/Subject';
declare let google: any;
@Injectable()
export class GeolocationService implements OnInit {
  public static _addres$ = new Subject<string>();
  public google: any;
  private _geocoder: any;
  private _currentLoc: any;
  private busy = false;
  private _currentAddress = 'hello!';
  constructor(public mapsApiLoader: MapsAPILoader, private _mapsSettingsService: MapSettingsService) {
    this.mapsApiLoader.load().then(() => {
      this._geocoder = new google.maps.Geocoder();
    });
  }

  ngOnInit(): void {
    this._geocoder = new google.maps.Geocoder();
  }

  findCurrentLocation(): any {
    if (!this._currentLoc) {
      if (navigator.geolocation) {
          this._currentLoc = navigator.geolocation.getCurrentPosition(this.showPosition);
      } else {
      }
    }
    return this._currentLoc;
  }

  showPosition(position) {
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
            GeolocationService._addres$.next(address);
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

