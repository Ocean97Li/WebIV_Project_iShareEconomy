import { User } from './user.model';
import { LendObject } from './lend-object.model';

export class Request {
  private _id: string;
  private _text: string;
  private _fromdate: Date;
  private _todate: Date;
  private _approved: boolean;
  private _replyText: string;

  constructor(
    private _source: User,
    private _target: User,
    private _object: LendObject
  ) {
    _source.addOutRequest(this);
    _target.addInRequest(this);
  }

   static fromJSON(json: any): Request {
    const request = new Request(
     User.fromJSON(json.source),
     User.fromJSON(json.target),
     LendObject.fromJSON(json.object)
    );
    request._id = json._id;
    request._text = json._text;
    request._fromdate = json.fromdate;
    request._todate = json.todate;
    request._approved = json._approved;
    request._replyText = json.replyText;
    return request;
  }

  toJSON() {
    return {
      _id: this._id,
      source: this._source.toJSON(),
      target: this._target.toJSON(),
      text: this._text,
      fromdate: this._fromdate,
      todate: this._todate,
      approved: this._approved,
      replyText: this._replyText
    };
  }

  approve(yesno: boolean, message: string, authorization: string) {
      this._approved = yesno;
      if (this._approved) {
        this._text = message;
        this._object.addUser(this._source);
      }
    }

  /**
   * Getter text
   * @return {string}
   */
  public get source(): User {
    return this._source;
  }

  /**
   * Getter text
   * @return {string}
   */
  public get target(): User {
    return this._target;
  }

  /**
   * Getter text
   * @return {string}
   */
  public get object(): LendObject {
    return this._object;
  }

  /**
   * Getter text
   * @return {string}
   */
  public get text(): string {
    return this._text;
  }

  /**
   * Getter fromdate
   * @return {Date}
   */
  public get fromdate(): Date {
    return this._fromdate;
  }

  /**
   * Getter todate
   * @return {Date}
   */
  public get todate(): Date {
    return this._todate;
  }

  /**
   * Getter approved
   * @return {boolean}
   */
  public get approved(): boolean {
    return this._approved;
  }

  /**
   * Getter replyText
   * @return {string}
   */
  public get replyText(): string {
    return this._replyText;
  }

  /**
   * Setter text
   * @param {string} value
   */
  public set text(value: string) {
    this._text = value;
  }

  /**
   * Setter fromdate
   * @param {Date} value
   */
  public set fromdate(value: Date) {
    this._fromdate = value;
  }

  /**
   * Setter todate
   * @param {Date} value
   */
  public set todate(value: Date) {
    this._todate = value;
  }

  /**
   * Setter approved
   * @param {boolean} value
   */
  public set approved(value: boolean) {
    this._approved = value;
  }

  /**
   * Setter replyText
   * @param {string} value
   */
  public set replyText(value: string) {
    this._replyText = value;
  }
}
