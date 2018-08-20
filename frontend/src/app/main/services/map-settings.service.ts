import { Injectable } from '@angular/core';

@Injectable()
export class MapSettingsService {
  private _title: string;
  private _lat: number;
  private _lng: number;
  private _zoom: number;
  private _label: string;
  private _streetViewControl: boolean;
  private _zoomControl: boolean;
  private _styles: Object[];

  constructor() {
    this._title = 'iShareEconomy';
    this._lat = 51.043526;
    this._lng = 3.713618;
    this._zoom = 18;
    this._label = 'label';
    this._streetViewControl = false;
    this._zoomControl = false;
    this._styles = [
      {
        featureType: 'poi.business',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.medical',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#a1e09a'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit.station.bus',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit.station.bus',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit.station.bus',
        elementType: 'labels.text',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit.station.rail',
        elementType: 'labels.text',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#638b9d'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text',
        stylers: [
          {
            color: '#dfeff6'
          }
        ]
      }
    ];
  }


  get title(): string {
    return this._title;
  }

  get lat(): number {
    return this._lat;
  }


  set position(posobject) {
    this._lat = posobject.lat;
    this._lng = posobject.lng;
  }


  get lng(): number {
    return this._lng;
  }


  get zoom(): number {
    return this._zoom;
  }

  set zoom(zoom: number) {
    this._zoom = zoom;
  }


   get label(): string {
    return this._label;
  }


   get streetViewControl(): boolean {
    return this._streetViewControl;
  }


   get zoomControl(): boolean {
    return this._zoomControl;
  }


   get styles(): Object[] {
    return this._styles;
  }

}
