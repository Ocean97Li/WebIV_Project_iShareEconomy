import { Component, OnInit, Input } from '@angular/core';
import { User } from '../user/user.model';
import { Request } from '../request/request.model';
import { LoggedInUserService } from '../services/logged-in-user.service';
import { LendObject } from '../lend-object/lend-object.model';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  private _request: Request;
  constructor (private _loggedInUserService: LoggedInUserService) {
  }
  //

  /**
   * Setter request
   *
   * @param {Request} value
   */
  @Input() set request(value: Request) {
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
  private get target(): string {
    return this._request.target.name;
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
