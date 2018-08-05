import { MapsAPILoader } from '@agm/core';
import { LendObject } from './lend-object.model';
import { Request } from './request.model';

export class User {
  // ID
  private _id: number;
  private _password;
  // UserPersonalData
  private _username: string;
  private _firstname: string;
  private _lastname: string;
  private _address: string;
  private _mapLocation: { lat: number, lng: number };
  private _rating: number;
  // UserData
  private _lending = new Array<LendObject>();
  private _using = new Array<LendObject>();
  public mapsApiLoader: MapsAPILoader;
  private _inRequest: Request[];
  private _outRequest: Request[];

  constructor(// esential data
     username: string,
     firstname: string,
     lastname: string,
     address: string,
     mapLocation: { lat: number, lng: number }
  ) {
    this._username = username;
    this._firstname = firstname;
    this._lastname = lastname;
    this._address = address;
    this._mapLocation = mapLocation;
    this._inRequest = new Array<Request>();
    this._outRequest = new Array<Request>();
  }
  public static fromJSON(json: any, norequests?: boolean): User {
    const user = new User(
      json.username,
      json.firstname,
      json.lastname,
      json.address,
      json.mapLocation
    );
    user._id = json._id;
    user._lending = json.lending.map(o => LendObject.fromJSON(o));
    user._using = json.using.map(o => LendObject.fromJSON(o));
    if (!norequests) {
    user._inRequest = json.using.map(r => Request.fromJSON(r));
    user._outRequest = json.using.map(r => Request.fromJSON(r));
    }
    return user;
  }

  public toJSON() {
    console.log(this._address);
    console.log(this._password);
    return {
      username: this._username,
      firstname: this.firstname,
      lastname: this.lastname,
      address: this._address.toString(),
      password: this._password,
      mapLocation: this._mapLocation,
      _id: this._id,
      lending: this._lending.map(o => o.toJSON()),
      using: this._using.map(o => o.toJSON()),
      inRequest: this._inRequest.map(r => r.toJSON()),
      outRequest: this._outRequest.map(r => r.toJSON())
    };
  }

  public get id() {
    return this._id;
  }

  public get password() {
    return this._password;
  }

  public get address(): string {
    return this._address;
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

  public set password(password: string) {
    this._password = password;
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
