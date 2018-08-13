import { User } from './user.model';

export class LendObject {
  private _id;
  private _name: string;
  private _description: string;
  private _type: ShareType;
  private _rules: string;
  private _owner: { id: string; name: string };
  private _user: { id: string; name: string };
  private _waitinglist: {
    id: string;
    name: string;
    todate: Date;
    fromdate: Date;
  }[];

  constructor(
    name: string,
    description: string,
    type: ShareType,
    owner: { id: string; name: string },
    rules?: string
  ) {
    this._name = name;
    this._description = description;
    this._type = type;
    const ownerid = owner.id;
    const ownername = owner.name;
    this._owner = { id: ownerid, name: ownername };
    console.log(this._owner);
    this._waitinglist = [];
    this._rules = rules;
  }

  static fromJSON(json: any): LendObject {
    console.log(json);
    const id: string = undefined;
    const name: string = undefined;
    const lo = new LendObject(
      json.name,
      json.description,
      LendObject.TypeFromJSON(json.type),
      json.owner,
      json.rules,
    );
    lo._id = json._id;
    if (json.user) {
      lo.user = json.user;
    }
      lo._waitinglist = json.waitinglist ? json.waitinglist : [];
    return lo;
  }

  public static TypeFromJSON(type: string): ShareType {
    let value: ShareType;
    switch (type) {
      case 'service':
        value = ShareType.Service;
        break;
      case 'tool':
        value = ShareType.Tool;
        break;
      case 'transport':
        value = ShareType.Transport;
        break;
    }
    return value;
  }

  public TypeToJSON(): string {
    let value: string;
    switch (this._type) {
      case ShareType.Service:
        value = 'service';
        break;
      case ShareType.Tool:
        value = 'tool';
        break;
      case ShareType.Transport:
        value = 'transport';
        break;
    }
    return value;
  }

  toJSON() {
    return {
      _id: this._id,
      name: this._name,
      description: this._description,
      type: this.TypeToJSON(),
      owner: this.owner,
      user: this.user ? this.user : undefined,
      rules: this._rules,
      waitinglist: this.waitinglist ? this.waitinglist : []
    };
  }

  public isAvailable(): boolean {
    return this._user === undefined && this._waitinglist.length === 0;
  }

  public isTempAvailable(): boolean {
    return this._user === undefined && this._waitinglist.length !== 0;
  }

  public isUsed(): boolean {
    return (
      this._user !== undefined &&
      this._waitinglist.length >= 0 &&
      this._waitinglist.length <= 3
    );
  }

  public isHeavilyUsed(): boolean {
    return (
      this._user !== undefined &&
      this._waitinglist.length > 3 &&
      this._waitinglist.length < 10
    );
  }

  public isVeryHeavilyUsed(): boolean {
    return this._user !== undefined && this._waitinglist.length >= 10;
  }

  /**
   * Getter waitinglist
   * @return {User[]}
   */
  public get waitinglist(): {
    id: string;
    name: string;
    todate: Date;
    fromdate: Date;
  }[] {
    return this._waitinglist;
  }

  /**
   * Getter name
   * @return {string}
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Getter id
   * @return {string}
   */
  public get id(): string {
    return this._id;
  }


  /**
   * Getter user
   * @return {{id: string, name: string}}
   */
  public get user(): { id: string; name: string } {
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
   * Getter owner
   * @return {{id: string, name: string}}
   */
  public get owner(): { id: string; name: string } {
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

  /**
   * Setter user
   * @param {{id: string, name: string}} value
   */
  public set user(value: { id: string; name: string }) {
    this._user = value;
  }
}

export enum ShareType {
  Service = 'male',
  Tool = 'wrench',
  Transport = 'car'
}
