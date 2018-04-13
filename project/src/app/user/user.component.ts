import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from './user.model';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  private _user: User;
  constructor() { }
  @Output() private selectedUser =  new EventEmitter<User>();
  @Input() set user(usr: User) {
      this._user = usr;
    }

   get extraAddressLine(): string {
     return this._user.extraAddressLine;
   }

   get address(): string {
    return this._user.address;
  }

   get rating(): number {
     return this._user.rating;
   }

   get firstname(): string {
     return this._user.firstname;
   }

   get lastname(): string {
     return this._user.lastname;
   }

   // these don't seem so secure, but will have to do for now
   get inRequest(): string[] {
     return this._user.inRequest;
   }
   get outRequest(): string[] {
     return this._user.inRequest;
   }

   get lending(): string[] {
     return this._user.lending;
   }

   get lentOut(): string[] {
     return this._user.lentOut;
   }

   get using(): string[] {
     return this._user.using;
   }

   get mapLocation(): {lat: number, lng: number} {
    return this._user.mapLocation;
  }

  selectUser(): boolean {
    console.log(this.firstname);
    this.selectedUser.emit(this._user);
    return false;
  }


}
