import { LendObject } from './lend-object.model';

export class ObjectRequest {
  private _source: {id: string, name: string};
  private _object: LendObject;
  private _id: string;
  private _fromdate: Date;
  private _todate: Date;
  private _approved: boolean = undefined;
  private _returned: boolean;

  constructor(
    source: {id: string, name: string},
    object: LendObject,
    fromdate: Date,
    todate: Date,
  ) {
    this._source = source;
    this._object = object;
    this._fromdate = fromdate;
    this._todate = todate;
  }

   static fromJSON(json: any): ObjectRequest {
    const request = new ObjectRequest(
     json.source,
     json.object ? LendObject.fromJSON(json.object) : undefined,
     new Date(json.fromdate),
     new Date(json.todate),
    );
    request._id = json._id;
    request._approved = json.approved;
    request._returned = json.returned;
    return request;
  }

  toJSON() {
    return {
      _id: this._id,
      source: this._source,
      object: this._object.toJSON(),
      fromdate: this._fromdate,
      todate: this._todate,
      approved: this._approved
    };
  }

  approve(yesno: boolean, message: string, authorization: string) {
  }

  /**
   * Getter id
   * @return id: string
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Getter source
   * @return {{id: string, name: string}}
   */
  public get source(): {id: string, name: string} {
    return this._source;
  }

  /**
   * Getter approved
   * @return {boolean}
   */
  public get approved(): boolean {
    return this._approved;
  }

  /**
   * Getter object
   * @return {LendObject}
   */
  public get object(): LendObject {
    return this._object;
  }


  /**
   * Getter dates
   * @return {{fromdate: Date, todate: Date}}
   */
  public get dates(): {fromdate: Date, todate: Date} {
    return {fromdate: this._fromdate, todate: this._todate};
  }

}
