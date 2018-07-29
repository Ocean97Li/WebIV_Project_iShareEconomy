import { MapsAPILoader } from '@agm/core';
import { LendObjectComponent } from '../lend-object/lend-object.component';
import { RequestComponent } from '../request/request.component';
import { LendObject } from '../lend-object/lend-object.model';
import { Request } from '../request/request.model';

export class User {
         // UserPersonalData
         private _extraAddressLine = '';
         private _rating: number;
         private _icon = '../../user.ico';
         // UserData
         private _lending = new Array<LendObject>();
         private _using = new Array<LendObject>();
         public mapsApiLoader: MapsAPILoader;
         private _inRequest: Request[];
         private _outRequest: Request[];
         private _authorCode: string;

         constructor(// esential data
          private _firstname: string,
          private _lastname: string,
          private _address: string,
          private _password: string,
          private _mapLocation: { lat: number; lng: number }) {
            this._inRequest = new Array<Request>();
            this._outRequest = new Array<Request>();
            this._authorCode = Math.random().toString(36).substring(2, 15)
            + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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

         public get name(): string {
           return `${this._firstname} ${this._lastname}`;
         }

         public get authorCode(): string {
           return this._authorCode;
         }

         // these don't seem so secure, but will have to do for now
         public get inRequest(): Request[] {
           return this._inRequest;
         }
         public get outRequest(): Request[] {
           return this._outRequest;
         }

         public get lending(): LendObject[] {
           return this._lending;
         }

         public get using(): LendObject[] {
           return this._using;
         }
         get mapLocation(): { lat: number; lng: number } {
           return this._mapLocation;
         }

         public set address(address: string) {
           this._address = address;
         }

         public set icon(icon: string) {
          this._icon = icon;
        }

        public addLendObject(object: LendObject) {
          if (object.owner === this) {
            this._lending.push(object);
          } else {
            this._using.push(object);
          }
        }

        public addInRequest(request: Request) {
          /*additional control*/
          this._inRequest.push(request);
        }

        public addOutRequest(request: Request) {
          /*additional control*/
          this._outRequest.push(request);
        }

       }
