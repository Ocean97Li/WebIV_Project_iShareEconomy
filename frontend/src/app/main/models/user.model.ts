import { MapsAPILoader } from '@agm/core';
import { LendObject } from './lend-object.model';
import { ObjectRequest } from './object-request.model';

export class User {
  // ID
  private _id: string;
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
  private _inRequest: ObjectRequest[];
  private _outRequest: ObjectRequest[];
  // Dynamic
  private _distance: number;

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
    this._inRequest = [];
    this._outRequest = [];
  }
  public static fromJSON(json: any, norequests?: boolean): User {
    console.log(json);
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
    user._rating = json.rating;
    if (!norequests) {
    user._inRequest = json.inRequest.map(r => ObjectRequest.fromJSON(r));
    user._outRequest = json.outRequest.map(r => ObjectRequest.fromJSON(r));
    }
    console.log(json.distance);
    user._distance = json.distance;
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
      id: this._id,
      lending: this._lending.map(o => o.toJSON()),
      using: this._using.map(o => o.toJSON()),
      inRequest: this._inRequest.map(r => r.toJSON()),
      outRequest: this._outRequest.map(r => r.toJSON())
    };
  }

  public get id(): string {
    return this._id;
  }

  public get distance(): number {
    return this._distance;
  }

  public get password(): string {
    return this._password;
  }

  public get address(): string {
    return this._address;
  }

  public get rating(): number {
    return this._rating;
  }

  public get username(): string {
    return this._username;
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

  public get inRequest(): ObjectRequest[] {
    return this._inRequest;
  }
  public get outRequest(): ObjectRequest[] {
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

  public set lending(lending: LendObject[]) {
    this._lending = lending;
  }

  public set using(using: LendObject[]) {
    this._using = using;
  }

  public set inRequest(rqs: ObjectRequest[]) {
    this._inRequest = rqs;
  }

  public set outRequest(rqs: ObjectRequest[]) {
    this._outRequest = rqs;
  }

  public set rating(rating: number) {
    this._rating = rating;
  }


  public addLendingObject(object: LendObject) {
      this._lending.push(object);
  }

  public  removeLendingObject(object: LendObject) {
   this._lending = this.lending.filter(l => l.id !== object.id);
  }

  public addInRequest(request: ObjectRequest) {
    /*additional control*/
    this._inRequest.push(request);
  }

  public addOutRequest(request: ObjectRequest) {
    /*additional control*/
    this._outRequest.push(request);
  }




}
