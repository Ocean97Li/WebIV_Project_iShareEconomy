import { Component, OnInit, Input } from '@angular/core';
import { User } from '../user/user.model';
import { LendObject } from './lend-object.model';

@Component({
  selector: 'app-lend-object',
  templateUrl: './lend-object.component.html',
  styleUrls: ['./lend-object.component.css']
})
export class LendObjectComponent implements OnInit {
  private _selected: boolean;
  @Input()public selectable: boolean;
  private _obj: LendObject;
  constructor() {}
  @Input() set lendObject(obj: LendObject) {
    this._obj = obj;
  }
  ngOnInit() {
  }

  get name() {
    return this._obj.name;
  }

  public select(): void {
    this._selected = !this._selected;
  }

  public deselect(): void {
    this._selected = false;
  }

  get description() {
    return this._obj.description;
  }

  get owner() {
    return this._obj.owner;
  }

  get selected(): boolean {
      return this._selected;
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


}
