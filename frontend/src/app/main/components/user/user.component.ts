import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../models/user.model';
import { LendObject } from '../../models/lend-object.model';
import { ObjectRequest } from '../../models/object-request.model';


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
   get inRequest(): ObjectRequest[] {
     return this._user.inRequest;
   }
   get outRequest(): ObjectRequest[] {
     return this._user.inRequest;
   }

   get lending(): LendObject[] {
     return this._user.lending;
   }

   get using(): LendObject[] {
     return this._user.using;
   }

   get mapLocation(): {lat: number, lng: number} {
    return this._user.mapLocation;
  }

  selectUser(): boolean {
    this.selectedUser.emit(this._user);
    return false;
  }



}
