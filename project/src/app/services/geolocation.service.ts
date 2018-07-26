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
      this._geocoder = new google.maps.Geocoder();
      console.log(this._geocoder);
    });
  }

  ngOnInit(): void {
    this._geocoder = new google.maps.Geocoder();
    console.log(this._geocoder);
  }

  findCurrentLocation(): any {
      if (navigator.geolocation) {
          return navigator.geolocation.getCurrentPosition(this.showPosition);
      } else {
          console.log('Geolocation is not supported by this browser.');
      }
  }

  showPosition(position) {
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
    return {
      'x': position.coords.latitude,
      'y': position.coords.longitude
    };
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
