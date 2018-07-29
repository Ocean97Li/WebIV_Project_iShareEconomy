import { User } from '../user/user.model';

export class LendObject {
  private _id;
  private _waitList: User[];
  private _name: string;
  private _description: string;
  private _type: ShareType;
  private _rules: string;

  constructor(
    name: string,
    description: string,
    type: ShareType,
    private _owner?: User,
    private _user?: User,
    rules?: string
  ) {
    this._name = name;
    this._description = description;
    this._type = type;
    this._waitList = [];
    this._rules = rules;

    if (this._user !== undefined) {
      this._user.addLendObject(this);
    }
    if (this._owner !== undefined) {
      this._owner.addLendObject(this);
    }
  }

  public addUser(user: User): void {
    if (this._waitList.length === 0 && this._user === undefined) {
      this._user = user;
    } else {
      this._waitList.push(user);
    }
  }

  public isAvailable(): boolean {
    return this._user === undefined && this._waitList.length === 0;
  }

  public isTempAvailable(): boolean {
    return this._user === undefined && this._waitList.length !== 0;
  }

  public isUsed(): boolean {
    return this._user !== undefined && this._waitList.length >= 0 && this._waitList.length <= 3;
  }

  public isHeavilyUsed(): boolean {
    return this._user !== undefined && this._waitList.length > 3 && this._waitList.length < 10;
  }

  public isVeryHeavilyUsed(): boolean {
    return this._user !== undefined && this._waitList.length >= 10;
  }

  /**
   * Getter waitList
   * @return {User[]}
   */
  public get waitList(): User[] {
    return this._waitList;
  }

  /**
   * Getter name
   * @return {string}
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Getter user
   * @return {User}
   */
  public get user(): User {
    return this._user;
  }

  /**
   * Getter description
   * @return {string}
   */
  public get description(): string {
    return this._description;
  }

   /**
   * Getter type
   * @return {string}
   */
  public get owner(): User {
    return this._owner;
  }

  /**
   * Getter type
   * @return {string}
   */
  public get type(): ShareType {
    return this._type;
  }

  /**
   * Setter waitList
   * @param {User[]} value
   */
  public set waitList(value: User[]) {
    this._waitList = value;
  }

  /**
   * Setter name
   * @param {string} value
   */
  public set name(value: string) {
    this._name = value;
  }

  /**
   * Setter description
   * @param {string} value
   */
  public set description(value: string) {
    this._description = value;
  }

  /**
   * Setter type
   * @param {string} value
   */
  public set type(value: ShareType) {
    this._type = value;
  }
}

export enum ShareType {
  Service = 'male',
  Tool = 'wrench',
  Transport = 'car'
}
