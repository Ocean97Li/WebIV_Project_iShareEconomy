export class User {
  // UserPersonalData
  private _blocknumber: number|null;
  private _postalcode: number;
  private _country: string;
  private _extraAddressLine: string;
  private _rating: number;
  private _icon = '../../favicon.ico';
  // UserData
  private _inRequest = new Array<string>();
  private _outRequest = new Array<string>();
  private _lending =  new Array<string>();
  private _lentOut = new Array<string>();
  private _using = new Array<string>();


  constructor(
    // esential data
    private _firstname: string,
    private _lastname: string,
    private _streetname: string,
    private _housenumber: string,
    private _password: string,
    private _mapLocation: {lat: number, lng: number}
  ) {
  }

  public get blockumber(): any {
   return this._blocknumber;
  }

  public get postalcode(): number {
    return this._blocknumber;
  }

  public get extraAddressLine(): string {
    return this.extraAddressLine;
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

  public get streetname(): string {
    return this._streetname;
  }

  public get housenumber(): string {
    return this._housenumber;
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
  get mapLocation(): {lat: number, lng: number} {
    return this._mapLocation;
  }






}
