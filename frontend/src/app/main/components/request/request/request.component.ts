import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ObjectRequest } from '../../../models/object-request.model';
import { LoggedInUserService } from '../../../services/logged-in-user.service';
import { LendObject } from '../../../models/lend-object.model';
import { Lexer } from '../../../../../../node_modules/@angular/compiler';
import { LendObjectComponent } from '../../lend-object/lend-object/lend-object.component';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  @Input() public conflict: boolean = null;
  @Input() public selected = false;
  @Input() public selectable = false;
  private _request: ObjectRequest;
  @Output() private sendRequest: EventEmitter<ObjectRequest> = new EventEmitter<ObjectRequest>();
  constructor (private _loggedInUserService: LoggedInUserService) {
  }
  public send() {
    if (this.selectable) {
      this.sendRequest.emit(this._request);
    }
  }

  public remove() {
    if (this.dissaproved) {
      this.sendRequest.emit(this._request);
    }
  }

  /**
   * Setter request
   *
   * @param {ObjectRequest} value
   */
  @Input() set request(value: ObjectRequest) {
    this._request = value;
  }

  /**
   * get source name
   * @return {string}
   */
  get source(): string {
    return this._request.source.name;
  }

   /**
   * get dissaproved
   * @return {boolean}
   */
  get dissaproved(): boolean {
    return this.approved !== undefined;
  }

  /**
   * get approved
   * @return {string}
   */
  get approved(): boolean {
    return this._request.approved;
  }

   /**
   * get target name
   * @return {string}
   */
  get target(): string {
    return this._request.object.owner.name;
  }

  /**
   * get object
   * @return {string}
   */
  public get object(): LendObject {
    return this._request.object;
  }

  /**
   * get fromdate
   * @return {string}
   */
  public get fromdate(): Date {
    return this._request.dates.fromdate;
  }

  /**
   * get todate
   * @return {string}
   */
  public get todate(): Date {
    return this._request.dates.todate;
  }


  ngOnInit() {
  }

}
