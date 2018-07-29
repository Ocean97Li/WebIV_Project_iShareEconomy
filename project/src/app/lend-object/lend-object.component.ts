import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../user/user.model';
import { LendObject } from './lend-object.model';


@Component({
  selector: 'app-lend-object',
  templateUrl: './lend-object.component.html',
  styleUrls: ['./lend-object.component.css']
})
export class LendObjectComponent implements OnInit {
  @Input()public selected: boolean;
  @Input()public selectable: boolean;
  private _obj: LendObject;
  @Output() private sendObject: EventEmitter<LendObject>;
  constructor() {
    this.sendObject = this.sendObject = new EventEmitter();
  }
  @Input() set lendObject(obj: LendObject) {
    this._obj = obj;
  }
  ngOnInit() {
  }

  send() {
    this.sendObject.emit(this._obj);
    console.log('emitted!');
  }

  get name() {
    return this._obj.name;
  }

  public select(): void {
    if (this.selectable) {
    console.log(this.selected);
    this.send();
    }
  }

  public deselect(): void {
    this.selected = false;
  }

  get description() {
    return this._obj.description;
  }

  get owner() {
    return this._obj.owner;
  }

  get type(): string {
    return this._obj.type;
  }

  get isAvailable(): boolean {
    return this._obj.isAvailable();
  }

  get isTempAvailable(): boolean {
    return this._obj.isTempAvailable();
  }

  get isUsed(): boolean {
    return this._obj.isUsed();
  }

  get isHeavilyUsed(): boolean {
    return this._obj.isHeavilyUsed();
  }

  get isVeryHeavilyUsed(): boolean {
    return this._obj.isVeryHeavilyUsed();
  }

  get waiting(): number {
    if (this.isAvailable) {
        return this._obj.waitList.length;
    }
    return this._obj.waitList.length + 1;
  }

  public usersTooltip() {
    return `Current user:  ${this._obj.user}
    Waitinglist: ${this._obj.waitList[this._obj.waitList.length - 1]}`;
  }


}
