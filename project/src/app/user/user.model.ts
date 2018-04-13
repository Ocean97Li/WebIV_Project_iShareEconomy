import { MapsAPILoader } from '@agm/core';

export class User {
         // UserPersonalData
         private _extraAddressLine = '';
         private _rating: number;
         private _icon = '../../user.ico';
         // UserData
         private _inRequest = new Array<string>();
         private _outRequest = new Array<string>();
         private _lending = new Array<string>();
         private _lentOut = new Array<string>();
         private _using = new Array<string>();
         public mapsApiLoader: MapsAPILoader;
         private geocoder;

         constructor(// esential data
          private _firstname: string,
          private _lastname: string,
          private _address: string,
          private _password: string,
          private _mapLocation: { lat: number; lng: number }) {
          }

        public get address(): string {
           return this._address;
         }

         public get extraAddressLine(): string {
           return this._extraAddressLine;
         }

         public get rating(): number {
           return this.rating;
         }

         public get firstname(): string {
           return this._firstname;
         }

         public get lastname(): string {
           return this._lastname;
         }


         // these don't seem so secure, but will have to do for now
         public get inRequest(): string[] {
           return this._inRequest;
         }
         public get outRequest(): string[] {
           return this._inRequest;
         }

         public get lending(): string[] {
           return this._lending;
         }

         public get lentOut(): string[] {
           return this._lentOut;
         }

         public get using(): string[] {
           return this._using;
         }
         get mapLocation(): { lat: number; lng: number } {
           return this._mapLocation;
         }
       }
