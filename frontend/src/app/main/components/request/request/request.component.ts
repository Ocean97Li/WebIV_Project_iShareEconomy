import { Component, OnInit, Input } from '@angular/core';
import { ObjectRequest } from '../../../models/object-request.model';
import { LoggedInUserService } from '../../../services/logged-in-user.service';
import { LendObject } from '../../../models/lend-object.model';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  private _request: ObjectRequest;
  constructor (private _loggedInUserService: LoggedInUserService) {
  }
  //

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


  ngOnInit() {
  }

}
