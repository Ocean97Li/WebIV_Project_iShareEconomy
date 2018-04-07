import { Injectable } from '@angular/core';
import { User } from '../user/user.model';

@Injectable()
export class UserService {

  private _users: User[];
  constructor() {
    this._users = [
      new User('Hu Ocean', 'Li', 'Nonnemeerstraat', '19-24', 'lol', {lat: 51.043526, lng: 3.713618}),
      new User('Angela', 'Merkel', 'ReichsStrasse', '19-24', 'lol', {lat: 51.03526, lng: 3.73618}),
      new User('Francois', 'Hollande', 'oooH de Champ de lise', '19-24', 'lol', {lat: 51.04326, lng: 3.71618}),
      new User('Ragnar', 'LothBrok', 'Plunderstreet', '4', 'lol2', {lat: 59.334591, lng: 18.063240}),
      new User('Gimli', 'Gloinson', 'MiddleEarthstreet', '4', 'lol3', {lat: -36.848461, lng: 174.763336}),
      new User('Mark', '', 'Rutte', '4', 'lol2', {lat: 52.314224, lng: 4.941841}),
      new User('Barack', 'Obama', 'CIA bunker', 'BD911', 'lol4', {lat: 39.063 , lng: -77.889}),
      new User('Donald', 'Trump', 'CIA bunker', 'BD911', 'china', {lat: 39.064, lng: -77.8}),
    ];
  }

  get users(): User[] {
    return this._users;
  }

  addNewUser(user: User) {
    this._users = [...this.users, user];
  }

}
