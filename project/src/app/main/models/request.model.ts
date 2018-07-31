import { User } from './user.model';
import { LendObject } from './lend-object.model';

export class Request {
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

  /**
   * Recipient can approve/dissaprove this request, if approved added to waitinglist/user of object
   * @param {boolean} yesno
   * @param {string} message
   * @param {string} authorization
   */
  approve(yesno: boolean, message: string, authorization: string) {
    if (authorization === this._target.authorCode) {
      this._approved = yesno;
      if (this._approved) {
        this._text = message;
        this._object.addUser(this._source);
      }
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
