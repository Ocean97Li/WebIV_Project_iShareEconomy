import { User } from './user.model';
import { Request } from './request.model';

export class LendObject {
  private _id;
  private _name: string;
  private _description: string;
  private _type: ShareType;
  private _rules: string;
  private _owner: User;
  private _user: User;
  private _waitList: User[];
  private _waitingList: Request[];

  constructor(
    name: string,
    description: string,
    type: ShareType,
    owner?: User,
    user?: User,
    rules?: string
  ) {
    this._name = name;
    this._description = description;
    this._type = type;
    this._owner = owner;
    this._user = user;
    this._waitList = [];
    this._waitingList = [];
    this._rules = rules;

    if (this._user !== undefined) {
      this._user.addLendObject(this);
    }
    if (this._owner !== undefined) {
      this._owner.addLendObject(this);
    }
  }

  static fromJSON(json: any): LendObject {
    const lo = new LendObject(
      json.name,
      json.description,
      json.type,
      json.owner,
      json.user,
      json.rules
    );
    lo._id = json._id;
    lo._waitingList = json.waitingList.map(o => LendObject.fromJSON(o));
    return lo;
  }

  toJSON() {
    return {
      _id: this._id,
      name: this._name,
      description: this._description,
      type: this._type,
      owner: this._owner.toJSON(),
      user: this._user.toJSON(),
      rules: this._rules,
      waitingList: this.waitingList
    };
  }

  public addUser(user: User): void {
    if (this._waitList.length === 0 && this._user === undefined) {
      this._user = user;
    } else {
      this._waitList.push(user);
    }
  }

  public addRequest(request: Request): boolean {
    if (this._waitingList.find(r => request.fromdate.valueOf() >= r.fromdate.valueOf()
    && request.todate.valueOf() <= r.todate.valueOf())) {
      return false;
    } else {
      this._waitingList.push(request);
      return true;
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
   * Getter rules
   * @return {string}
   */
  public get rules(): string {
    return this._rules;
  }

  /**
   * Getter rules
   * @return {Request[]}
   */
  public get waitingList(): Request[] {
    return this._waitingList;
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
