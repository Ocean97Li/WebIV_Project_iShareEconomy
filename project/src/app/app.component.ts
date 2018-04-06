import { Component, EventEmitter } from '@angular/core';
import { LatLngBounds } from '@agm/core';
import { User } from './user/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'iShareEconomy';
  lat = 51.043526;
  lng = 3.713618;
  zoom = 18;
  label = 'label';
  streetViewControl = false;
  zoomControl = false;
  styles = [
    {
      'featureType': 'poi.business',
      'stylers': [
        {
          'visibility': 'off'
        }
      ]
    },
    {
      'featureType': 'poi.medical',
      'stylers': [
        {
          'visibility': 'off'
        }
      ]
    },
    {
      'featureType': 'poi.park',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'color': '#a1e09a'
        }
      ]
    },
    {
      'featureType': 'road.arterial',
      'elementType': 'labels.icon',
      'stylers': [
        {
          'visibility': 'off'
        }
      ]
    },
    {
      'featureType': 'road.highway',
      'elementType': 'labels.icon',
      'stylers': [
        {
          'visibility': 'off'
        }
      ]
    },
    {
      'featureType': 'transit.station.bus',
      'stylers': [
        {
          'visibility': 'off'
        }
      ]
    },
    {
      'featureType': 'transit.station.bus',
      'elementType': 'labels',
      'stylers': [
        {
          'visibility': 'off'
        }
      ]
    },
    {
      'featureType': 'transit.station.bus',
      'elementType': 'labels.text',
      'stylers': [
        {
          'visibility': 'off'
        }
      ]
    },
    {
      'featureType': 'transit.station.rail',
      'elementType': 'labels.text',
      'stylers': [
        {
          'visibility': 'off'
        }
      ]
    },
    {
      'featureType': 'water',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'color': '#638b9d'
        }
      ]
    },
    {
      'featureType': 'water',
      'elementType': 'labels.text',
      'stylers': [
        {
          'color': '#dfeff6'
        }
      ]
    }
  ];
  users = [
    new User('Hu Ocean', 'Li', 'Nonnemeerstraat', '19-24', 'lol', {lat: 51.043526, lng: 3.713618}),
    new User('Svengal', 'Viking', 'Svengalstrass', '4', 'lol2', {lat: 59.043526, lng: 8.713618}),
    new User('Ernie', 'Johnson', 'Svengalstrass', '4', 'lol3', {lat: 59.04359, lng: 8.713618}),
    new User('Kim', '', 'Svengalstrass', '4', 'lol2', {lat: 59.04359, lng: 8.713618}),
    new User('Barack', 'Obama', 'cia bunker', '0234', 'lol4', {lat: -10.04359, lng: -70.713618}),
    new User('Donald', 'Trump', 'cia bunker', '0234', 'lol4', {lat: -10.04359, lng: 18.713618}),
  ];

}
