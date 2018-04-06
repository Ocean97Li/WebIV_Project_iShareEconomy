import { Component, OnInit, Input } from '@angular/core';
import { User } from './user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  @Input() public user: User;
  constructor() { }
  get blockumber(): any {
    return this.user.blockumber;
   }

   get postalcode(): number {
     return this.user.postalcode;
   }

   get extraAddressLine(): string {
     return this.user.extraAddressLine;
   }

   get rating(): number {
     return this.user.rating;
   }

   get firstname(): string {
     return this.user.firstname;
   }

   get lastname(): string {
     return this.user.lastname;
   }

   get streetname(): string {
     return this.user.streetname;
   }

   get housenumber(): string {
     return this.user.housenumber;
   }

   // these don't seem so secure, but will have to do for now
   get inRequest(): string[] {
     return this.user.inRequest;
   }
   get outRequest(): string[] {
     return this.user.inRequest;
   }

   get lending(): string[] {
     return this.user.lending;
   }

   get lentOut(): string[] {
     return this.user.lentOut;
   }

   get using(): string[] {
     return this.user.using;
   }

   get mapLocation(): {lat: number, lng: number} {
    return this.user.mapLocation;
  }


}
