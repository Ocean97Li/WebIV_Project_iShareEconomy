import { Injectable, OnInit } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
declare let google: any;
@Injectable()
export class GeolocationService implements OnInit {
  public google: any;
  private _geocoder: any;
  private _currentLoc: any;
  constructor(public mapsApiLoader: MapsAPILoader) {
    this.findCurrentLocation();
    this.mapsApiLoader.load().then(() => {
      console.log('google script loaded');
      this._geocoder = new google.maps.Geocoder();
      console.log(this._geocoder);
    });
  }

  ngOnInit(): void {
    console.log('google script loaded second time');
    this._geocoder = new google.maps.Geocoder();
    console.log(this._geocoder);
  }

  findCurrentLocation() {
    let pos;
    navigator.geolocation.getCurrentPosition(function() {}, function(e) {}, {});
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

  reverseGeo(location: { lat: number; lng: number }) {
    if (this._geocoder) {
      this._geocoder.geocode({ location: location }, function(results, status) {
        if (status === 'OK') {
          if (results[0]) {
            console.log(results[0].formatted_address);
            return results[0].formatted_address;
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });
    } else {
      console.log('geocoder not yet available');
      return '';
    }
  }
}
